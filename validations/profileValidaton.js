const Joi = require("joi");

const profileSchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        "string.base": "Nama harus berupa teks.",
        "string.max": "Nama maksimal 100 karakter.",
        "any.required": "Nama wajib diisi."
    }),

    identityNumber: Joi.string().allow(null, "").optional().messages({
        "string.base": "Nomor identitas harus berupa teks."
    }),

    bio: Joi.string().allow(null, "").optional().messages({
        "string.base": "Bio harus berupa teks."
    }),

    profilePhoto: Joi.string().uri().allow(null, "").optional().messages({
        "string.uri": "Profile photo harus berupa URL yang valid."
    })
});

module.exports = profileSchema;
