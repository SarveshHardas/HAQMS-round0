const { z } = require('zod');

const doctorQuerySchema = z.object({
    search: z.string().max(50).optional(),
    specialization: z.string().max(50).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
})

const doctorIdSchema = z.object({
    id: z.string().uuid()
})

module.exports = {
    doctorQuerySchema,
    doctorIdSchema
}