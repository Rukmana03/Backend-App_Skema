const Joi = require("joi");

const createClassSchema = Joi.object({
    schoolId: Joi.number().integer().required().messages({
        'any.required': 'schoolId must be filled in',
        'number.base': 'schoolId must be a number',
    }),
    academicYearId: Joi.number().integer().required().messages({
        'any.required': 'academicYearId must be filled in',
        'number.base': 'academicYearId must be a number',
        'number.integer': 'academicYearId must be an integer',
    }),
    className: Joi.string().min(3).max(100).required().messages({
        'any.required': 'className must be filled in',
        'string.base': 'className must be a string',
        'string.min': 'className Minimum 3 characters',
        'string.max': 'className Maximum 100 character',
    }),
    status: Joi.string().valid('Active', 'Inactive').required(),
});

const addStudentSchema = Joi.object({
    studentId: Joi.number().integer().required().messages({
        'any.required': 'studentId must be filled in',
        'number.base': 'studentId must be a number',
    }),
    classId: Joi.number().integer().required().messages({
        'any.required': 'classId must be filled in',
        'number.base': 'classId must be a number',
    }),
    academicYearId: Joi.number().integer().required().messages({
        'any.required': 'academicYearId must be filled in',
        'number.base': 'academicYearId must be a number',
    }),
    classStatus: Joi.string().valid("Active", "Promoted", "Transferred", "Graduated").optional()
});

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
    code: Joi.string().alphanum().min(3).max(50).required().messages({
        'any.required': 'code must be filled in',
        'string.alphanum': 'Code can only be letters and numbers',
        'string.min': 'Code minimal 3 grade',
        'string.max': 'Code maximum 50 characters',
    }),
});

const promoteStudentsSchema = Joi.object({
    studentIds: Joi.array().items(Joi.number().required()).min(1).required().messages({
        'array.min': 'At least one student must be given',
        'any.required': 'studentIds must be filled in'
    }),
    newClassId: Joi.number().required().messages({
        'any.required': 'newClassId must be filled in',
        'number.base': 'newClassId must be a number',
    }),
    academicYearId: Joi.number().required().messages({
        'any.required': 'academicYearId must be filled in',
        'number.base': 'academicYearId must be a number',
    }),
});

module.exports = {
    createClassSchema,
    addStudentSchema,
    createSubjectClassSchema,
    promoteStudentsSchema,
};
