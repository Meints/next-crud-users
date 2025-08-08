import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { registerDTO } from "./dto/register.dto";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = registerDTO.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.message },
                { status: 400 }
            )
        }

        const { name, email, password, cep, city, state } = parsed.data;

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
            ...(cep && city && state ? { cep, city, state } : {}),
            },
        })

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: "User registered successfully",
            user: userWithoutPassword
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}