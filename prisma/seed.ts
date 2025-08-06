import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@admin.com"},
        update: {},
        create: {
            name: "Admin",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "ADMIN",
        }
    });
}

main()
    .then(() => { console.log("Seeding completed successfully.")})
    .catch(console.error)
    .finally(() => prisma.$disconnect());