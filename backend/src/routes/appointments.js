const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { appointmentQuerySchema, appointmentCreateSchema, appointmentUpdateSchema, appointmentIdSchema } = require("../validators/appointment");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/appointments
// List all appointments
// PERFORMANCE BUG: Classic N+1 Query Issue!
// Instead of using Prisma's include, it loops through each appointment and executes
// individual select statements for Patient and Doctor details.
router.get('/', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = appointmentQuerySchema.safeParse(req.query);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: validated.error.issues,
      });
    }

    const { doctorId, status, page, limit } = validated.data;
    const where = {};

    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
              age: true,
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
        orderBy: {
          appointmentDate: 'asc',
        },
        skip,
        take: limit
      }),
      prisma.appointment.count({
        where,
      }),
    ]);
    return res.status(200).json({
      success: true,
      message: 'Appointments fetched successfully',
      data: {
        appointments,
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
    console.error('[APPOINTMENT_FETCH_ERROR]:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/appointments
// Book an appointment
// DESIGN BUG: Duplicate-prone schema. No unique index blocks duplicate appointment bookings.
// In this API, we have a half-hearted verification that is easily bypassed or logically flawed,
// allowing multiple bookings for the exact same date and doctor.
router.post('/', authenticate, authorize(['ADMIN', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = appointmentCreateSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: validated.error.issues,
      });
    }

    const { patientId, doctorId, appointmentDate, reason } = validated.data;
    const appDate = new Date(appointmentDate);

    if (appDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future',
      });
    }

    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: patientId },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.doctor.findUnique({
        where: { id: doctorId },
        select: {
          id: true,
          name: true,
          availableFrom: true,
          availableTo: true,
        },
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

    const appointmentHourMinute = appDate.toTimeString().slice(0, 5);
    if (appointmentHourMinute < doctor.availableFrom || appointmentHourMinute > doctor.availableTo) {
      return res.status(400).json({
        success: false,
        message: 'Appointment time is outside doctor availability hours',
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: appDate,
        reason: reason || '',
        status: 'PENDING',
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

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment,
      },
    });
  } catch (error) {
    console.error('[APPOINTMENT_CREATE_ERROR]:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Doctor already has an appointment at this time',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// PATCH /api/appointments/:id
// Update appointment status (COMPLETED, CANCELLED, etc.)
router.patch('/:id', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validatedBody = appointmentUpdateSchema.safeParse(req.body);

    const validatedParams = appointmentIdSchema.safeParse(req.params);

    if (!validatedBody.success || !validatedParams.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: {
          bodyErrors: validatedBody.success ? [] : validatedBody.error.issues,
          paramErrors: validatedParams.success ? [] : validatedParams.error.issues,
        },
      });
    }

    const { status } = validatedBody.data;
    const { id } = validatedParams.data;

    const existingAppointment =
      await prisma.appointment.findUnique({
        where: { id },
      });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    const allowedTransitions = {
      PENDING: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    const currentStatus = existingAppointment.status;

    const allowedNextStatuses = allowedTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid appointment transition from ${currentStatus} to ${status}`,
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
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

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: {
        appointment: updatedAppointment,
      },
    });
  } catch (error) {
    console.error('[APPOINTMENT_UPDATE_ERROR]:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
);

module.exports = router;
