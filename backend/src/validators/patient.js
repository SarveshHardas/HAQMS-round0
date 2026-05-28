const { z } = require('zod');

const patientQuerySchema = z.object({
    search: z.string().max(50).optional(),
    gender: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

const patientIdSchema = z.object({
    id: z.string().uuid(),
});

const patientCreateSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    phoneNumber: z.string().regex(/^[0-9]{10}$/),
    age: z.coerce.number().min(0).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    medicalHistory: z.string().max(5000).optional(),
});

module.exports = {
    patientQuerySchema,
    patientIdSchema,
    patientCreateSchema,
};