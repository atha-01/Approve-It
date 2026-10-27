import prisma from "./src/config/prisma";

async function main() {
  const result = await prisma.$queryRaw`
    SELECT current_database()
  `;

  console.log("Connected to database:", result);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });