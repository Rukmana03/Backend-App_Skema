const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('pass12345', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'rukmana@gmail.com' },
        update: {},
        create: {
            username: 'Admin_Skema',
            email: 'rukmana@gmail.com',
            password: hashedPassword,
            role: 'Admin',
            profile: {
                create: {
                    name: 'Administrator_Skema',
                    identityNumber: 'ADM-001',
                },
            },
        },
    });

    console.log('✅ Admin Created:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
