const Joi = require("joi");

const createClassSchema = Joi.object({
    schoolId: Joi.number().integer().required().messages({
        'any.required': 'schoolId wajib diisi',
        'number.base': 'schoolId harus berupa angka',
    }),
    className: Joi.string().min(3).max(100).required().messages({
        'any.required': 'className wajib diisi',
        'string.base': 'className harus berupa string',
        'string.min': 'className minimal 3 karakter',
        'string.max': 'className maksimal 100 karakter',
    }),
    status: Joi.string().valid('Active', 'Inactive').required(),
});

const addStudentSchema = Joi.object({
    studentId: Joi.number().integer().required().messages({
        'any.required': 'studentId wajib diisi',
        'number.base': 'studentId harus berupa angka',
    }),
    classId: Joi.number().integer().required().messages({
        'any.required': 'classId wajib diisi',
        'number.base': 'classId harus berupa angka',
    }),
});

const createSubjectClassSchema = Joi.object({
    subjectId: Joi.number().integer().required().messages({
        'any.required': 'subjectId wajib diisi',
        'number.base': 'subjectId harus berupa angka',
    }),
    classId: Joi.number().integer().required().messages({
        'any.required': 'classId wajib diisi',
        'number.base': 'classId harus berupa angka',
    }),
    teacherId: Joi.number().integer().required().messages({
        'any.required': 'teacherId wajib diisi',
        'number.base': 'teacherId harus berupa angka',
    }),
    code: Joi.string().alphanum().min(3).max(50).required().messages({
        'any.required': 'code wajib diisi',
        'string.alphanum': 'code hanya boleh huruf dan angka',
        'string.min': 'code minimal 3 karakter',
        'string.max': 'code maksimal 50 karakter',
    }),
});

module.exports = {createClassSchema, addStudentSchema, createSubjectClassSchema};