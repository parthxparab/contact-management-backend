const { contactSchema } = require('../validators/contactValidators');

const validateContact = (req, res, next) => {
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details.map(detail => detail.message),
        });
    }

    if (value.phone) {
        value.phone = value.phone.replace(/[^0-9+() -]/g, '');
    }

    req.body = value;

    // Proceed to next middleware or route handler
    next();
};

module.exports = { validateContact };