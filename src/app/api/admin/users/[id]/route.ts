import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest, { params }: { params: { id: string }}) {
        const token = request.cookies.get("token")?.value;
        const verified = token ? verifyToken(token) : null;

        if (!verified || verified.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    try {
        const { id } = params;
        const body = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id },
            data: body,
        })

        const { password, ...userWithoutPassword } = updatedUser;
        return NextResponse.json(userWithoutPassword, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string }}) {
    const token = request.cookies.get("token")?.value;
    const verified = token ? verifyToken(token) : null;

    if (!verified || verified.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}