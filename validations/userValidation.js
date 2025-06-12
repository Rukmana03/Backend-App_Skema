const Joi = require("joi");

const createUserSchema = Joi.object({
    username: Joi.string().max(50).required().messages({
        "string.empty": "Username cannot be empty.",
        "string.min": "usernameMinimal3Character",
        "string.max": "Username a maximum of 50 characters.",
        "any.required": "Username must be filled in."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "string.empty": "Email can't be empty.",
        "any.required": "Email must be filled in."
    }),
    password: Joi.string().min(8).max(100).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[^\\s]+$")).required().messages({
        "string.pattern.base": "Passwords must contain uppercase letters, lowercase letters, numbers, and may not contain spaces.",
        "string.min": "A minimum password of 8 characters.",
        "string.max": "A maximum password of 100 characters.",
        "string.empty": "The password cannot be empty.",
        "any.required": "Password must be filled in.",
    }),
    role: Joi.string().valid("Admin", "Teacher", "Student").required().messages({
        "any.only": "Role can only be 'admin', 'Teacher', or 'Student'.",
        "any.required": "Role must be filled in."
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
