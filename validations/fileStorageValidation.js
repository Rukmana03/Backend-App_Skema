const Joi = require("joi");

const addFileToAssignmentSchema = Joi.object({
    userId: Joi.number().required(),
    assignmentId: Joi.number().required(),
    fileName: Joi.string().required(),
    fileUrl: Joi.string().uri().required()
});

module.exports = { addFileToAssignmentSchema };
