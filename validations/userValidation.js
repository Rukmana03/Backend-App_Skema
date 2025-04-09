const Joi = require("joi");

const createUserSchema = Joi.object({
    username: Joi.string().max(50).required().messages({
        "string.empty": "Username tidak boleh kosong.",
        "string.min": "Username minimal 3 karakter.",
        "string.max": "Username maksimal 50 karakter.",
        "any.required": "Username wajib diisi."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Format email tidak valid.",
        "string.empty": "Email tidak boleh kosong.",
        "any.required": "Email wajib diisi."
    }),
    password: Joi.string().min(8).max(100).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[^\\s]+$")).required().messages({
        "string.pattern.base": "Password harus mengandung huruf besar, huruf kecil, angka, dan tidak boleh mengandung spasi.",
        "string.min": "Password minimal 8 karakter.",
        "string.max": "Password maksimal 100 karakter.",
        "string.empty": "Password tidak boleh kosong.",
        "any.required": "Password wajib diisi.",
    }),
    role: Joi.string().valid("Admin", "Teacher", "Student").required().messages({
        "any.only": "Role hanya bisa 'Admin', 'Teacher', atau 'Student'.",
        "any.required": "Role wajib diisi."
    }),

    // Profile
    name: Joi.string().max(100).optional().allow(""),
    identityNumber: Joi.string().optional().allow(""),
    bio: Joi.string().optional().allow(""),
    profilePhoto: Joi.string().uri().optional().allow(""),
});

const updateUserSchema = Joi.object({
    username: Joi.string().max(50).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).max(100).optional(),
    role: Joi.string().valid("Teacher", "Student").optional(),
});

module.exports = { createUserSchema, updateUserSchema };
