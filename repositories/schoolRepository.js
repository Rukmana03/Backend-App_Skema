const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const schoolRepository = {
    findAll: async () => {
        return await prisma.school.findMany({
            include: { classes: true },
        });
    },

    findById: async (id) => {
        return await prisma.school.findUnique({
            where: { id: Number(id) },
            include: { classes: true },
        });
    },

    create: async (data) => {
        return await prisma.school.create({ data });
    },

    update: async (id, data) => {
        return await prisma.school.update({
            where: { id: Number(id) },
            data,
        });
    },

    delete: async (id) => {
        return await prisma.school.delete({
            where: { id: Number(id) },
        });
    },
};

module.exports = schoolRepository;
