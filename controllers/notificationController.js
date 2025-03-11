const notificationService = require("../services/notificationService");
const { successResponse } = require("../utils/responeHandler");

const notificationController = {
    sendNotification: async (req, res, next) => {
        try {
            const { userId, message } = req.body;
            const response = await notificationService.sendNotification(userId, message);
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
        }
    },

    getUserNotifications: async (req, res, next) => {
        try {
            const userId = req.user.id; // Dapatkan dari token JWT
            const response = await notificationService.getUserNotifications(userId);
            res.status(response.status).json(response);
        } catch (error) {
            next(error);
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
