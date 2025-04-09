const Joi = require("joi");

const assignmentValidator = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow(null, '').max(500),
    subjectClassId: Joi.number().integer().required(),
    teacherId: Joi.number().integer().required(),
    deadline: Joi.date().iso().required(),
    assignmentType: Joi.string().valid("Daily", "Weekly").required(),
    taskCategory: Joi.string().valid("Essay", "MultipleChoice", "Project").required(),
});

const updateAssignment = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(""),
    deadline: Joi.date().iso(),
    assignmentType: Joi.string().valid("Daily", "Weekly").optional(),
    taskCategory: Joi.string().valid("Essay", "MultipleChoice", "Project").optional(),
});


module.exports = { assignmentValidator, updateAssignment };
