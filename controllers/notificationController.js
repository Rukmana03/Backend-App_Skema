const notificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const notificationController = {
    sendNotification: async (req, res) => {
        try {
            const { userId, message } = req.body;
            if (!userId || !message) {
                return errorResponse(res, 400, "userId dan message wajib diisi.");
            }

            const notification = await notificationService.sendNotification(userId, message);
            return successResponse(res, 201, "Notifikasi berhasil dikirim", notification);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengirim notifikasi");
        }
    },

    getUserNotifications: async (req, res) => {
        try {
            const userId = req.user.id;
            const notifications = await notificationService.getUserNotifications(userId);
            return successResponse(res, 200, "Notifikasi berhasil diambil", notifications);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal mengambil notifikasi");
        }
    },

    markNotificationAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return errorResponse(res, 400, "notificationId wajib diisi.");
            }

            const response = await notificationService.markNotificationAsRead(parseInt(id));
            return successResponse(res, 200, "Notifikasi ditandai sebagai dibaca", response);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal menandai notifikasi");
        }
    },

    deleteNotification: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return errorResponse(res, 400, "notificationId wajib diisi.");
            }

            await notificationService.deleteNotification(parseInt(id));
            return successResponse(res, 200, "Notifikasi berhasil dihapus");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Gagal menghapus notifikasi");
        }
    },
};

module.exports = notificationController;
