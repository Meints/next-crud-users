import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { loginDTO } from "./dto/login.dto";
import z from "zod";
import { generateToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = loginDTO.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.message },
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

        const token = generateToken({ id: user.id, role: user.role})

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        return response;
        
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}