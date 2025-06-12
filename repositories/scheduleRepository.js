const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const scheduleRepository = {
    getAssignmentsFor24hReminder: async (now) => {
        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const next25h = new Date(now.getTime() + 25 * 60 * 60 * 1000); // buffer 1 jam

        return prisma.assignment.findMany({
            where: {
                deadline: {
                    gte: next24h,
                    lt: next25h,
                },
                notifiedBefore24h: false,
                deletedAt: null
            },
        });
    },

    getAssignmentsFor2hReminder: async (now) => {
        const next2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const next3h = new Date(now.getTime() + 3 * 60 * 60 * 1000); // buffer 1 jam

        return prisma.assignment.findMany({
            where: {
                deadline: {
                    gte: next2h,
                    lt: next3h,
                },
                notifiedBefore2h: false,
                deletedAt: null
            },
        });
    },

    mark24hNotified: async (assignmentId) => {
        return prisma.assignment.update({
            where: { id: assignmentId },
            data: { notifiedBefore24h: true },
        });
    },

    mark2hNotified: async (assignmentId) => {
        return prisma.assignment.update({
            where: { id: assignmentId },
            data: { notifiedBefore2h: true },
        });
    },
};

module.exports = scheduleRepository;