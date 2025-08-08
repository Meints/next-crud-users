import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const verified = token ? verifyToken(token) : null;

    if(!verified || verified.role !== 'ADMIN') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        )
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            cep: true,
            city: true,
            state: true,
            role: true,
            createdAt: true,

        }
    })


    return NextResponse.json(users, { status: 200 });
}