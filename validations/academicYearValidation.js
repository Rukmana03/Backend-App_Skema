const Joi = require("joi");

const createAcademicYearSchema = Joi.object({
    year: Joi.string().required().label("School year"),
    startDate: Joi.date().required().label("Start date"),
    endDate: Joi.date().required().label("Finished date"),
    isActive: Joi.boolean().optional()
});

const updateAcademicYearSchema = Joi.object({
    year: Joi.string().optional().label("School year"),
    startDate: Joi.date().optional().label("Start date"),
    endDate: Joi.date().optional().label("Finished date"),
    isActive: Joi.boolean().optional()
});

module.exports = {
    createAcademicYearSchema,
    updateAcademicYearSchema
};
