import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  const passwordAdmin = await bcrypt.hash('password-admin', roundsOfHashing);
  const passwordExample = await bcrypt.hash('password123', roundsOfHashing);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@admin.com',
    },
    update: {},
    create: {
      username: 'admin',
      role: Role.ADMIN,
      password: passwordAdmin,
      email: 'admin@admin.com',
    },
  });

  const example = await prisma.user.upsert({
    where: {
      email: 'test@example.com',
    },
    update: {},
    create: {
      username: 'example',
      role: Role.ADMIN,
      password: passwordExample,
      email: 'test@example.com',
    },
  });

  console.log({ admin, example });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
