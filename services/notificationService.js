const notificationRepository = require("../repositories/notificationRepository");
const { successResponse, throwError } = require("../utils/responeHandler");

const notificationService = {
    sendNotification: async (userId, message) => {
        if (!userId || !message) throwError(400, "User ID dan pesan diperlukan");
        const notification = await notificationRepository.createNotification(userId, message);
        return successResponse(201, "Notifikasi dikirim", notification);
    },

    getUserNotifications: async (userId) => {
        const notifications = await notificationRepository.getUserNotifications(userId);
        return successResponse(200, "Daftar notifikasi", notifications);
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
