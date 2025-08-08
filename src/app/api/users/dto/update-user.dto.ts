import { z } from "zod";

export const updateUserDTO = z.object({
    name: z.string().min(3).optional(),
    password: z.string().min(6).optional(),
    cep: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
})

export type updateUserDTO = z.infer<typeof updateUserDTO>;