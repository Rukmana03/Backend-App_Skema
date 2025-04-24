const Joi = require("joi");

const createClassSchema = Joi.object({
    schoolId: Joi.number().integer().required().messages({
        'any.required': 'schoolId wajib diisi',
        'number.base': 'schoolId harus berupa angka',
    }),
    academicYearId: Joi.number().integer().required().messages({
        'any.required': 'academicYearId wajib diisi',
        'number.base': 'academicYearId harus berupa angka',
        'number.integer': 'academicYearId harus berupa bilangan bulat',
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
    academicYearId: Joi.number().integer().required().messages({
        'any.required': 'academicYearId wajib diisi',
        'number.base': 'academicYearId harus berupa angka',
    }),
    classStatus: Joi.string().valid("Active", "Promoted", "Transferred", "Graduated").optional()
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

const promoteStudentsSchema = Joi.object({
    studentIds: Joi.array().items(Joi.number().required()).min(1).required().messages({
        'array.min': 'Minimal satu studentId harus diberikan',
        'any.required': 'studentIds wajib diisi'
    }),
    newClassId: Joi.number().required().messages({
        'any.required': 'newClassId wajib diisi',
        'number.base': 'newClassId harus berupa angka',
    }),
    academicYearId: Joi.number().required().messages({
        'any.required': 'academicYearId wajib diisi',
        'number.base': 'academicYearId harus berupa angka',
    }),
});

module.exports = {
    createClassSchema,
    addStudentSchema,
    createSubjectClassSchema,
    promoteStudentsSchema,
};
