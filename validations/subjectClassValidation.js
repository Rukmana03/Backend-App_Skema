const Joi = require("joi");

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
    academicYearId: Joi.number().integer().required().messages({
        'any.required': 'academicYearId wajib diisi',
        'number.base': 'academicYearId harus berupa angka',
    }),
    subjectClassCode: Joi.string().alphanum().min(3).max(50).optional().messages({
        'string.alphanum': 'code hanya boleh huruf dan angka',
        'string.min': 'code minimal 3 karakter',
        'string.max': 'code maksimal 50 karakter',
    }),
});

module.exports = {
    createSubjectClassSchema
};
