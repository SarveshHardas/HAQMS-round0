const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { patientQuerySchema, patientCreateSchema, patientIdSchema } = require('../validators/patient');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/patients
router.get('/', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = patientQuerySchema.safeParse(req.query);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: validated.error.issues,
      });
    }

    const { search, gender, page, limit } = validated.data;
    const where = {};
    if (search?.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          phoneNumber: {
            contains: search.trim(),
          },
        },
        {
          email: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }
    if (gender && gender !== 'All') {
      where.gender = gender;
    }
    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          age: true,
          gender: true,
          createdAt: true,
        },
      }),
      prisma.patient.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Patients fetched successfully',
      data: {
        patients,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
          hasNextPage: skip + limit < total,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('[PATIENT_FETCH_ERROR]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/patients/:id
router.get('/:id', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = patientIdSchema.safeParse(req.params);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient id',
        errors: validated.error.issues,
      });
    }
    const { id } = validated.data;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          select: {
            id: true,
            appointmentDate: true,
            status: true,
            reason: true,
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
              },
            },
          },
        },
        queueTokens: {
          select: {
            id: true,
            tokenNumber: true,
            status: true,
            queueDate: true,
          },
        },
      },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient fetched successfully',
      data: {
        patient,
      },
    });

  } catch (error) {
    console.error('[PATIENT_FETCH_BY_ID_ERROR]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/patients (Register patient)
router.post('/', authenticate, authorize(['ADMIN', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = patientCreateSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: validated.error.issues,
      });
    }
    const { name, email, phoneNumber, age, gender, medicalHistory } = validated.data;
    const existingPatient = await prisma.patient.findUnique({
      where: { phoneNumber },
    });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient already exists with this phone number',
      });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email: email || null,
        phoneNumber,
        age,
        gender,
        medicalHistory: medicalHistory || '',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        age: true,
        gender: true,
        medicalHistory: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        patient,
      },
    });

  } catch (error) {
    console.error('[PATIENT_CREATE_ERROR]:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Patient already exists',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const validated = patientIdSchema.safeParse(req.params);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient id',
        errors: validated.error.issues,
      });
    }

    const { id } = validated.data;

    const patient = await prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }
    await prisma.patient.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted patient ${patient.name}`,
    });
  } catch (error) {
    console.error('[PATIENT_DELETE_ERROR]:', error);

    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete patient with active medical records',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
