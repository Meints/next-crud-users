import { z } from "zod";

export const registerDTO = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    cep: z.string().min(8).max(9).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
})

export type RegisterDTO = z.infer<typeof registerDTO>;