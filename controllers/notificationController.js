const notificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const notificationController = {
    sendNotification: async (req, res) => {
        try {
            const { userId, message } = req.body;
            if (!userId || !message) {
                return errorResponse(res, 400, "userId and message are required");
            }
            const notification = await notificationService.sendNotification(userId, message);
            return successResponse(res, 201, "Notification successfully sent", notification);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getUserNotifications: async (req, res) => {
        try {
            const userId = req.user.id;
            const notifications = await notificationService.getUserNotifications(userId);
            return successResponse(res, 200, "Notification successfully retrieved", notifications);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    getNotificationById: async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await notificationService.getNotificationById(Number(id));
            return successResponse(res, 200, "Notification was successfully taken", notification);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },

    deleteNotification: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return errorResponse(res, 400, "notificationId required");
            }
            await notificationService.deleteNotification(Number(id));
            return successResponse(res, 200, "Notification successfully deleted");
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message || "Internal server error");
        }
    },
};

module.exports = notificationController;
