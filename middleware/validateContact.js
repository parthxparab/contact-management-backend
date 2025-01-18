// middleware/validateContact.js
const { contactSchema, contactPatchSchema } = require('../validators/contactValidators');

const validateContact = (req, res, next) => {
    // Validate req.body
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Return all validation errors in a structured format
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details.map(detail => detail.message),
        });
    }

    // Optional: Additional sanitization can happen here
    // For example, strip out special characters from phone
    if (value.phone) {
        value.phone = value.phone.replace(/[^0-9+() -]/g, '');
    }

    // Overwrite req.body with the sanitized/validated data
    req.body = value;

    // Proceed to next middleware or route handler
    next();
};

const validateContactPatch = (req, res, next) => {
    const { error, value } = contactPatchSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details.map((detail) => detail.message),
        });
    }

    // Optional: Additional sanitization (e.g., phone).
    if (value.phone) {
        value.phone = value.phone.replace(/[^0-9+() -]/g, '');
    }

    req.body = value;
    next();
};

module.exports = { validateContact, validateContactPatch };