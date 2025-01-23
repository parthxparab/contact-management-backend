const Joi = require('joi');

// Validation schema for creating/updating a contact
const contactSchema = Joi.object({
    name: Joi.string().min(1).max(100).required()
        .messages({
            'string.empty': '"name" cannot be empty',
            'any.required': '"name" is required',
            'string.max': '"name" length must be less than or equal to 100 characters',
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': '"email" must be a valid email',
            'any.required': '"email" is required',
        }),
    phone: Joi.string().allow(null, '')
        .pattern(/^[0-9-+\s()]*$/)
        .messages({
            'string.pattern.base': '"phone" must contain only numbers, spaces, dashes, parentheses, or plus signs',
        }),
    age: Joi.number().allow(null).integer().min(0).max(120)
        .messages({
            'number.base': '"age" must be a number',
            'number.min': '"age" cannot be negative',
            'number.max': '"age" must be less than or equal to 120',
        }),
    category: Joi.number().integer().valid(1, 2, 3).default(1)
        .messages({
            'any.only': '"category" must be 1 (Family), 2 (Friends), or 3 (Work)',
        }),
});

module.exports = {
    contactSchema
};