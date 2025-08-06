import { z } from "zod";

export const loginDTO = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export type LoginDTO = z.infer<typeof loginDTO>;