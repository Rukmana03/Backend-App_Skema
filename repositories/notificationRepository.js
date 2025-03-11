const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificationRepository = {
    createNotification: async (userId, message) => {
        return await prisma.notification.create({
            data: {
                userId,
                message,
                status: "Unread",
                sentDate: new Date(),
            },
        });
    },

    getNotificationsByUser: async (userId) => {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },

    markAsRead: async (notificationId) => {
        return await prisma.notification.update({
            where: { id: notificationId },
            data: { status: "Read" },
        });
    },

    deleteNotification: async (notificationId) => {
        return await prisma.notification.delete({
            where: { id: notificationId },
        });
    },
};

module.exports = notificationRepository;
