const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { doctorQuerySchema, doctorIdSchema } = require('../validators/doctor');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = doctorQuerySchema.safeParse(req.query);

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        details: validated.error.issues,
      });
    }

    const { search, specialization, page, limit, } = validated.data;

    const filters = {};
    const skip = (page - 1) * limit;
    if (search?.trim()) {
      filters.name = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    if (specialization && specialization !== 'All') {
      filters.specialization = specialization;
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where: filters,
        skip,
        take: limit
      }),
      prisma.doctor.count({
        where: filters
      })
    ]);

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: {
        doctors,
        pagination: {
          total,
          page,
          limit,
          hasPreviousPage: page > 1,
          hasNextPage: skip + limit < total,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    });
  } catch (error) {
    console.error("[Doctor_Fetch_All_Error]: ", error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/doctors/stats
// Returns aggregation details about available doctors
router.get('/stats', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const [totalDoctors, surgeonsCount, averageFee, highestExperience] = await Promise.all([
      prisma.doctor.count(),
      prisma.doctor.count({
        where: { department: "Surgery" },
      }),
      prisma.doctor.aggregate({
        _avg: {
          consultationFee: true,
        },
      }),
      prisma.doctor.aggregate({
        _max: {
          experience: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        total: totalDoctors,
        surgeons: surgeonsCount,
        averageFee: Math.round(averageFee._avg.consultationFee || 0),
        maxExperience: highestExperience._max.experience || 0,
      }
    });
  } catch (error) {
    console.error("[Doctor_Stats_Error]: ", error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/doctors/:id
router.get('/:id', authenticate, authorize(['ADMIN', 'DOCTOR', 'RECEPTIONIST']), async (req, res) => {
  try {
    const validated = doctorIdSchema.safeParse(req.params);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        details: validated.error.issues
      })
    }
    const { id } = validated.data
    const doctor = await prisma.doctor.findUnique({
      where: { id: id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error("[Doctor_Fetch_Error]: ", error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
