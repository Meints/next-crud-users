import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { loginDTO } from "./dto/login.dto";
import z from "zod";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = loginDTO.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: z.treeifyError(parsed.error)},
                { status: 400 }
            )
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                cep: user.cep,
                role: user.role,
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}