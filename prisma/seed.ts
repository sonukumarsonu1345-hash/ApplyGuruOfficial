import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@applyguru.local";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      email,
      name: "ApplyGuru Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`Seeded admin user: ${admin.email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `No ADMIN_PASSWORD was set, so a default password was used: "${password}". ` +
        "Set ADMIN_EMAIL/ADMIN_PASSWORD in .env before seeding a real environment, " +
        "and change the password after first login either way.",
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
