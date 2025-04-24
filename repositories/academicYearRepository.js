const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const academicYearRepository = {
    createAcademicYear: async (data) => {
        return await prisma.academicYear.create({ data });
    },

    getAllAcademicYears: async () => {
        return await prisma.academicYear.findMany({});
    },

    getAcademicYearById: async (id) => {
        return await prisma.academicYear.findUnique({ where: { id: Number(id) } });
    },

    getActiveAcademicYear: async () => {
        return await prisma.academicYear.findFirst({ where: { isActive: true } });
    },

    getInActiveAcademicYear: async () => {
        return await prisma.academicYear.findFirst({ where: { isActive: false } });
    },

    updateAcademicYear: async (id, data) => {
        return await prisma.academicYear.update({
            where: { id },
            data
        });
    },

    deleteAcademicYear: async (id) => {
        return await prisma.academicYear.delete({
            where: { id }
        });
    },

    deactivateAllYears: async () => {
        return await prisma.academicYear.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });
    }
};

module.exports = academicYearRepository;
