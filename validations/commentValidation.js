const Joi = require("joi");

const createCommentSchema = Joi.object({
    assignmentId: Joi.number().optional(),
    submissionId: Joi.number().optional(),
    text: Joi.string().min(1).required(),
}).or('assignmentId', 'submissionId');      

module.exports = { createCommentSchema };
