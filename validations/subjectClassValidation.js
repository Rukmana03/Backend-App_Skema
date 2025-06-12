const Joi = require("joi");

const createSubjectClassSchema = Joi.object({
    subjectId: Joi.number().integer().required().messages({
        'any.required': 'subjectId must be filled in',
        'number.base': 'subjectId must be a number',
    }),
    classId: Joi.number().integer().required().messages({
        'any.required': 'classId must be filled in',
        'number.base': 'classId must be a number',
    }),
    teacherId: Joi.number().integer().required().messages({
        'any.required': 'teacherId must be filled in',
        'number.base': 'teacherId must be a number',
    }),
    academicYearId: Joi.number().integer().required().messages({
        'any.required': 'academicYearId must be filled in',
        'number.base': 'academicYearId must be a number',
    }),
    subjectClassCode: Joi.string().alphanum().min(3).max(50).optional().messages({
        'string.alphanum': 'Code can only be letters and numbers',
        'string.min': 'Code minimal 3 grade',
        'string.max': 'Code maximum 50 characters',
    }),
});

module.exports = {
    createSubjectClassSchema
};
