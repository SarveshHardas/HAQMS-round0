const { z } = require('zod');

const queueQuerySchema = z.object({
    doctorId: z.string().uuid().optional(),
    status: z.enum(['WAITING', 'CALLING', 'COMPLETED', 'SKIPPED']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
})

const queueCheckinSchema = z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    appointmentId: z.string().uuid().optional(),
});

const queueUpdateSchema = z.object({
    status: z.enum([
        'WAITING',
        'CALLING',
        'COMPLETED',
        'SKIPPED',
    ]),
});

const queueIdSchema = z.object({
    id: z.string().uuid(),
});

module.exports = {
    queueQuerySchema,
    queueCheckinSchema,
    queueIdSchema,
    queueUpdateSchema
}