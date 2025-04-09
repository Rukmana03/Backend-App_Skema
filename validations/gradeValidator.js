const Joi = require("joi");

const createGradeSchema = Joi.object({
    submissionId: Joi.number().required().messages({
        'any.required': 'submissionId wajib diisi.',
        'number.base': 'submissionId harus berupa angka.'
    }),
    teacherId: Joi.number().required().messages({
        'any.required': 'teacherId wajib diisi.',
        'number.base': 'teacherId harus berupa angka.'
    }),
    score: Joi.number().min(0).max(100).required().messages({
        'any.required': 'Score wajib diisi.',
        'number.base': 'Score harus berupa angka.',
        'number.min': 'Score minimal 0.',
        'number.max': 'Score maksimal 100.'
    }),
    feedback: Joi.string().allow("", null)
});

const updateGradeSchema = Joi.object({
    score: Joi.number().min(0).max(100).messages({
        'number.base': 'Score harus berupa angka.',
        'number.min': 'Score minimal 0.',
        'number.max': 'Score maksimal 100.'
    }),
    feedback: Joi.string().allow("", null)
});

module.exports = {
    createGradeSchema,
    updateGradeSchema
};
