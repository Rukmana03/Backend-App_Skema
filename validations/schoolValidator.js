const Joi = require('joi');

const schoolSchema = Joi.object({
    npsn: Joi.string().pattern(/^\d{8}$/).required(),
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().max(500).allow(null, '').optional(),
    city: Joi.string().min(2).max(100).required(),
    province: Joi.string().min(2).max(100).required(),
    postalCode: Joi.string().pattern(/^[0-9]{5}$/).required(),
    phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]{7,20}$/).allow(null, '').optional(),
    email: Joi.string().email().allow(null, '').optional(),
    status: Joi.string().valid('Active', 'Inactive').optional(),
});

const updateSchoolSchema = Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    address: Joi.string().max(500).allow(null, '').optional(),
    city: Joi.string().min(2).max(100).optional(),
    province: Joi.string().min(2).max(100).optional(),
    postalCode: Joi.string().pattern(/^[0-9]{5}$/).optional(),
    phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]{7,20}$/).allow(null, '').optional(),
    email: Joi.string().email().allow(null, '').optional(),
    status: Joi.string().valid('Active', 'Inactive').optional(),
});

module.exports = { schoolSchema, updateSchoolSchema };
