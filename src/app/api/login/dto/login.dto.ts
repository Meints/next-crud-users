import { z } from "zod";

export const loginDTO = z.object({
    email: z.email('Invalid email format.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
})

export type LoginDTO = z.infer<typeof loginDTO>;