const { z } = require('zod');

const appointmentStatuses = [
    'PENDING',
    'COMPLETED',
    'CANCELLED',
];

const appointmentQuerySchema = z.object({
    doctorId: z.string().uuid().optional(),
    status: z.enum(appointmentStatuses).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

const appointmentCreateSchema = z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    appointmentDate: z.string(),
    reason: z.string().max(500).optional(),
});

const appointmentUpdateSchema = z.object({
    status: z.enum(appointmentStatuses),
});

const appointmentIdSchema = z.object({
    id: z.string().uuid(),
});

module.exports = {
    appointmentQuerySchema,
    appointmentCreateSchema,
    appointmentUpdateSchema,
    appointmentIdSchema,
};