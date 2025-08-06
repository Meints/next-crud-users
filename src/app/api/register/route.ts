import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { registerDTO } from "./dto/register.dto";
import z from "zod";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = registerDTO.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: z.treeifyError(parsed.error)},
                { status: 400 }
            )
        }

        const { name, email, password, cep } = parsed.data;

        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered." },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                cep,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        })

        return NextResponse.json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}