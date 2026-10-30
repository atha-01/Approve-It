
import prisma from "../config/prisma.ts";
import bcrypt from "bcrypt";

const passwordHash = await bcrypt.hash("moatha@12345", 10);

const existingAdmin = await prisma.user.findUnique({
    where: {
        email: "admin@approveit.com"
    }
});

if (existingAdmin) {
    console.log("Admin account already exists");
    process.exit(1);
}

const newAdmin = await prisma.user.create({
    data: {
        name: "ApproveIT Admin",
        email: "admin@approveit.com",
        passwordHash: passwordHash,
        role: "admin"
    }
});

console.log(newAdmin.name);
console.log(newAdmin.email);
console.log(newAdmin.role);

await prisma.$disconnect();
