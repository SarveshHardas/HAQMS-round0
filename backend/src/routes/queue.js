const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { queueQuerySchema, queueCheckinSchema, queueIdSchema, queueUpdateSchema } = require('../validators/queue');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/queue
// List all active queue tokens
router.get('/', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = queueQuerySchema.safeParse(req.query);

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        error: validated.error.issues,
      })
    }

    const { doctorId, status, page, limit } = validated.data;

    const skip = (page - 1) * limit;

    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const [tokens, total] = await Promise.all([
      prisma.queueToken.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            }
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
        },
        orderBy: {
          tokenNumber: 'asc'
        },
        skip: skip,
        take: limit
      }),
      prisma.queueToken.count({ where })
    ]);

    res.status(200).json({
      success: true,
      message: 'Queue fetched successfully',
      data: {
        tokens,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
          hasNextPage: skip + limit < total,
          hasPreviousPage: page > 1,
        }
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/queue/checkin
// Generate a new queue token for a patient.
router.post('/checkin', authenticate, authorize(['ADMIN', 'RECEPTIONIST']), async (req, res) => {
  try {

    const validated = queueCheckinSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        error: validated.error.issues
      })
    }

    const { patientId, doctorId, appointmentId } = validated.data;

    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: patientId },
      }),
      prisma.doctor.findUnique({
        where: { id: doctorId },
      }),
    ]);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: {
          id: true,
          patientId: true,
          doctorId: true,
        },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      if (
        appointment.patientId !== patientId ||
        appointment.doctorId !== doctorId
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Appointment does not belong to the provided patient and doctor',
        });
      }
    }

    const queueDate = new Date().toISOString().split('T')[0];

    const newToken = await prisma.$transaction(async (tx) => {
      const maxTokenResult = await tx.queueToken.aggregate({
        where: {
          doctorId,
          queueDate,
        },
        _max: {
          tokenNumber: true,
        },
      });

      const currentMax = maxTokenResult._max.tokenNumber || 0;

      return await tx.queueToken.create({
        data: {
          tokenNumber: currentMax + 1,
          patientId,
          doctorId,
          appointmentId: appointmentId || null,
          status: 'WAITING',
          queueDate,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
        },
      });
    })

    res.status(201).json({
      success: true,
      message: 'Checked in successfully. Token generated.',
      data: {
        token: newToken,
      }
    });
  } catch (error) {
    console.error('[Queue check-in error]:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Queue token conflict occurred. Please retry.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Check-in failed',
    });
  }
});

// PATCH /api/queue/:id
// Update token status (WAITING -> CALLING -> COMPLETED / SKIPPED)
router.patch('/:id', authenticate, authorize(['ADMIN', 'RECEPTIONIST', 'DOCTOR']), async (req, res) => {
  try {

    const validated = queueUpdateSchema.safeParse(req.body);
    const validatedID = queueIdSchema.safeParse(req.params);

    if (!validated.success || !validatedID.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        error: {
          bodyErrors: validated.success ? [] : validated.error.issues,
          paramErrors: validatedID.success ? [] : validatedID.error.issues,
        },
      })
    }

    const { status } = validated.data;
    const { id } = validatedID.data;

    const allowedTransitions = {
      WAITING: ['CALLING', 'SKIPPED'],
      CALLING: ['COMPLETED', 'SKIPPED'],
      COMPLETED: [],
      SKIPPED: [],
    };
    const existingToken = await prisma.queueToken.findUnique({
      where: { id },
    });

    if (!existingToken) {
      return res.status(404).json({
        success: false,
        message: 'Token not found',
      })
    }

    const currentStatus = existingToken.status;
    const allowedNextStatuses = allowedTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid queue transition from ${currentStatus} to ${status}`,
      });
    }

    const updatedToken = await prisma.queueToken.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Queue token updated successfully',
      data: {
        token: updatedToken,
      }
    });
  } catch (error) {
    console.error('[Queue token update error]:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Queue token not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update queue token',
    });
  }
});

module.exports = router;
