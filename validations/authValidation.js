const Joi = require("joi");

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

module.exports = { changePasswordSchema };
