const Joi = require("joi");

const createNotificationSchema = Joi.object({
    userId: Joi.number().integer().required(),
    message: Joi.string().min(1).required(),
});

const notificationIdSchema = Joi.object({
    notificationId: Joi.number().integer().required(),
});

module.exports = {
    createNotificationSchema,
    notificationIdSchema,
};
