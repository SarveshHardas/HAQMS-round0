const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reports/doctor-stats
router.get('/doctor-stats', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const start = Date.now();

    const today = new Date().toISOString().split('T')[0];
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        department: true,
        consultationFee: true,
      },
    });

    const reportData = await Promise.all(
      doctors.map(async (doc) => {
        const [totalAppointments, completedAppointments, cancelledAppointments, todayQueueSize] = await Promise.all([
          prisma.appointment.count({
            where: {
              doctorId: doc.id,
            },
          }),
          prisma.appointment.count({
            where: {
              doctorId: doc.id,
              status: 'COMPLETED',
            },
          }),
          prisma.appointment.count({
            where: {
              doctorId: doc.id,
              status: 'CANCELLED',
            },
          }),
          prisma.queueToken.count({
            where: {
              doctorId: doc.id,
              queueDate: today,
            },
          }),
        ]);

        return {
          id: doc.id,
          name: doc.name,
          specialization: doc.specialization,
          department: doc.department,
          totalAppointments,
          completedAppointments,
          cancelledAppointments,
          todayQueueSize,
          revenue: completedAppointments * doc.consultationFee,
        };
      })
    );

    const durationMs = Date.now() - start;

    return res.status(200).json({
      success: true,
      message: 'Doctor statistics generated successfully',
      data: {
        reports: reportData,
        generatedInMs: durationMs,
      },
    });

  } catch (error) {
    console.error('[REPORT_GENERATION_ERROR]:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
