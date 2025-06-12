const Joi = require("joi");

const profileSchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        "string.base": "The name must be in the form of text.",
        "string.max": "Maximum name 100 characters.",
        "any.required": "Name must be filled in."
    }),

    identityNumber: Joi.string().allow(null, "").optional().messages({
        "string.base": "The identity number must be in the form of text."
    }),

    bio: Joi.string().allow(null, "").optional().messages({
        "string.base": "Bio must be in the form of text."
    }),

    profilePhoto: Joi.string().uri().allow(null, "").optional().messages({
        "string.uri": "Profile photo must be a valid url."
    })
});

module.exports = profileSchema;
