const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const schoolRepository = {
    create: async (data) => {
        return prisma.school.create({ data });
    },

    update: async (id, data) => {
        id = Number(id);
        return prisma.school.update({
            where: { id },
            data,
        });
    },

    delete: async (id) => {
        id = Number(id);
        return prisma.school.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    },

    findAll: async () => {
        return prisma.school.findMany({
            where: { deletedAt: null },
            include: { classes: true },
            orderBy: { createdAt: "desc" }
        });
    },

    findById: async (id) => {
        id = Number(id);
        return prisma.school.findFirst({
            where: { id, deletedAt: null },
            include: { classes: true },
        });
    },

    findByNpsn: async (npsn) => {
        return prisma.school.findFirst({
            where: { npsn },
        });
    },

};

module.exports = schoolRepository;
