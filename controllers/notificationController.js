const notificationService = require("../services/notificationService");
const { successResponse } = require("../utils/responeHandler");

const notificationController = {
    sendNotification: async (req, res,) => {
        try {
            const { userId, message } = req.body;
            const notification = await notificationService.sendNotification(userId, message);

            res.status(201).json({
                message: "Notifikasi berhasil dikirim",
                data: notification
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getUserNotifications: async (req, res) => {
        try {
            const userId = req.user.id;
            const notifications = await notificationService.getUserNotifications(userId);

            res.status(200).json({
                message: "Notifikasi berhasil diambil",
                data: notifications,
            });
        } catch (error) {
            console.error("[ERROR] Gagal mengambil notifikasi:", error);
            res.status(500).json({ success: false, message: "Terjadi kesalahan", error: error.message });
        }
    },

    markNotificationAsRead: async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await notificationService.markNotificationAsRead(parseInt(id));
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },

    deleteNotification: async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await notificationService.deleteNotification(parseInt(id));
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = notificationController;
