const Joi = require("joi");

const createAcademicYearSchema = Joi.object({
    year: Joi.string().required().label("Tahun Ajaran"),
    startDate: Joi.date().required().label("Tanggal Mulai"),
    endDate: Joi.date().required().label("Tanggal Selesai"),
    isActive: Joi.boolean().optional()
});

const updateAcademicYearSchema = Joi.object({
    year: Joi.string().optional().label("Tahun Ajaran"),
    startDate: Joi.date().optional().label("Tanggal Mulai"),
    endDate: Joi.date().optional().label("Tanggal Selesai"),
    isActive: Joi.boolean().optional()
});

module.exports = {
    createAcademicYearSchema,
    updateAcademicYearSchema
};
