import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { updateUserDTO } from "../dto/update-user.dto";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const verified = token ? verifyToken(token) : null;

    if(!verified || !verified.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: verified.id },
    })

    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
        )
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
}

export async function PUT(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const verified = token ? verifyToken(token) : null;

    if(!verified || !verified.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const body = await request.json();
    const parsed = updateUserDTO.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { errors: parsed.error.message },
            { status: 400 }
        );
    }

    const dataToUpdate = { ...parsed.data }

    if (dataToUpdate.password) {
        dataToUpdate.password = await hash(dataToUpdate.password, 10);
    }

    const updatedData = await prisma.user.update({
        where: { id: verified.id },
        data: dataToUpdate,
    })

    const { password, ...userWithoutPassword } = updatedData;

    return NextResponse.json({
        message: "User updated successfully",
        user: userWithoutPassword,
    }, { status: 200 });
}