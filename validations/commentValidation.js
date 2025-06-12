const Joi = require("joi");

const createCommentSchema = Joi.object({
    text: Joi.string().required(),
  assignmentId: Joi.number().optional().allow(null),
  submissionId: Joi.number().optional().allow(null),
}).or('assignmentId', 'submissionId');


module.exports = { createCommentSchema };
