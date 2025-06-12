const Joi = require("joi");

const createGradeSchema = Joi.object({
    submissionId: Joi.number().required().messages({
        'any.required': 'SubmissionId must be filled in.',
        'number.base': 'submissionId must be in the form of numbers.'
    }),
    score: Joi.number().min(0).max(100).required().messages({
        'any.required': 'Score must be filled in.',
        'number.base': 'The score must be a number.',
        'number.min': 'scoreMinimal0',
        'number.max': 'Maximum score of 100.'
    }),
    feedback: Joi.string().allow("", null)
});

const updateGradeSchema = Joi.object({
    score: Joi.number().min(0).max(100).messages({
        'number.base': 'The score must be a number.',
        'number.min': 'scoreMinimal0',
        'number.max': 'Maximum score of 100.'
    }),
    feedback: Joi.string().allow("", null)
});

module.exports = {
    createGradeSchema,
    updateGradeSchema
};
