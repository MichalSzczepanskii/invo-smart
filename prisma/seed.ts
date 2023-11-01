import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'root@localhost.com',
      name: 'root',
      password: '$2b$10$0O6.kQV1Qtd4b7Vn60Ns5.rzcaiSh2P4wpoCjVdFnvkjug.6BL56y',
      encryptionKey: '',
      emailVerifiedAt: null,
    },
  });

  await prisma.service.createMany({
    data: [{ id: 1, name: 'GOOGLE_CALENDAR' }],
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
