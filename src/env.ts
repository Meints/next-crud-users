import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string('Invalid database URL.'),
    JWT_SECRET: z.string().min(10, "JWT is required")
})

export const env = envSchema.parse(process.env);