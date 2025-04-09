const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificationRepository = {
    async createNotification(userId, message) {
        return prisma.notification.create({
            data: {
                userId,
                message,
                status: "Unread",
                sentDate: new Date(),
            },
        });
    },

    async getNotificationsByUser(userId) {
        return prisma.notification.findMany({
            where: {
                userId,
                deletedAt: null 
            },
            select: {
                id: true,
                userId: true,
                message: true,
                status: true,
                sentDate: true,
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async markAsRead(notificationId) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { status: "Read" },
        });
    },

    async deleteNotification(notificationId) {
        return prisma.notification.delete({
            where: { id: notificationId },
        });
    },
};

module.exports = notificationRepository;
