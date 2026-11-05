
import "dotenv/config";
import prisma from "../config/prisma.ts";
import bcrypt from "bcrypt";

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const createAdmin = async () => {
    try {
        // Check that all required environment variables exist
        if (!adminName || !adminEmail || !adminPassword) {
            throw new Error(
                "Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env"
            );
        }

        // Check whether an account with this email already exists
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminEmail
            }
        });

        if (existingAdmin) {
            if (existingAdmin.role === "admin") {
                console.log("Admin account already exists.");
            } else {
                console.log(
                    "This email is already registered with another role."
                );
            }
            return;
        }

        // Hash the admin password
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Create the admin account
        const newAdmin = await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                passwordHash,
                role: "admin"
            }
        });

        console.log("Admin account created successfully.");
        console.log("Name:", newAdmin.name);
        console.log("Email:", newAdmin.email);
        console.log("Role:", newAdmin.role);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
};

createAdmin();
