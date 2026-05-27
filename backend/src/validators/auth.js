const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(8,"Password must be atleast 8 characters long"),
    name: z.string().min(1,"Name is required"),
    role: z.enum(['RECEPTIONIST','DOCTOR','ADMIN']).optional()
})

const loginSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(1, "Password is required")
})

module.exports = {registerSchema,loginSchema}