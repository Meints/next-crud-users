import { z } from "zod";

export const registerDTO = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    cep: z.string()
})

export type RegisterDTO = z.infer<typeof registerDTO>;