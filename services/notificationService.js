const notificationRepository = require("../repositories/notificationRepository");
const { successResponse, throwError } = require("../utils/responeHandler");

const notificationService = {
    sendNotification: async (userId, message) => {
        if (!userId || !message) {
            throw new Error("User ID dan pesan diperlukan");
        }

        return await notificationRepository.createNotification(userId, message);
    },

    getUserNotifications: async (userId) => {

        const notifications = await notificationRepository.getNotificationsByUser(userId);

        if (!Array.isArray(notifications) || notifications.length === 0) {
            return { success: true, message: "Tidak ada notifikasi ditemukan", data: [] };
        }

        notifications.forEach((notification, index) => {
            if (!notification.status) {
                notification.status = "Unread";
            }
        });

        return { data: notifications };
    },

    markNotificationAsRead: async (notificationId) => {
        const notification = await notificationRepository.markAsRead(notificationId);
        return successResponse(200, "Notifikasi ditandai sebagai dibaca", notification);
    },

    deleteNotification: async (notificationId) => {
        await notificationRepository.deleteNotification(notificationId);
        return successResponse(200, "Notifikasi dihapus");
    },
    
};

module.exports = notificationService;
