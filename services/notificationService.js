const notificationRepository = require("../repositories/notificationRepository");
const { throwError } = require("../utils/responseHandler");
const { createNotificationSchema, notificationIdSchema } = require("../validations/notificationValidation");

const notificationService = {
    sendNotification: async (payload) => {
        const { error } = createNotificationSchema.validate(payload);
        if (error) throwError(400, error.details[0].message);

        const notification = await notificationRepository.createNotification(payload.userId, payload.message);
        return notification;
    },

    getUserNotifications: async (userId) => {
        if (!userId) throwError(400, "User ID diperlukan");
        return await notificationRepository.getNotificationsByUser(userId);
    },

    markNotificationAsRead: async (notificationId) => {
        const { error } = notificationIdSchema.validate({ notificationId });
        if (error) throwError(400, error.details[0].message);

        return await notificationRepository.markAsRead(notificationId);
    },

    deleteNotification: async (notificationId) => {
        const { error } = notificationIdSchema.validate({ notificationId });
        if (error) throwError(400, error.details[0].message);

        await notificationRepository.deleteNotification(notificationId);
        return;
    },
};

module.exports = notificationService;
