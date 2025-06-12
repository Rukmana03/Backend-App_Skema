const Joi = require("joi");

const fileItemSchema = Joi.object({
    userId: Joi.number().required(),
    fileName: Joi.string().required(),
    fileUrl: Joi.string().required(),
    fileType: Joi.string().valid('Submission', 'Assignment').required(),
    submissionId: Joi.number().allow(null).optional(),
    assignmentId: Joi.number().required(),
    uploadDate: Joi.date().required()
});

const addManyFilesSchema = Joi.array().items(fileItemSchema);

module.exports = { addManyFilesSchema };
