const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { validateContact } = require('../middleware/validateContact');

// CREATE: Add a new contact
router.post('/', validateContact, async (req, res) => {
    try {
        const { name, email, phone, age, category } = req.body;
        const contact = await Contact.create({ name, email, phone, age, category });
        return res.status(201).json(contact);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                details: 'A contact with this email already exists.'
            });
        }
        return res.status(500).json({ details: error.message });
    }
});

// READ: Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        console.log({contacts})
        return res.json(contacts);
    } catch (error) {
        return res.status(500).json({ details: error.message });
    }
});

// READ: Get contact by Email
router.get('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ details: 'Contact not found' });
        }
        return res.json(contact);
    } catch (error) {
        return res.status(500).json({ details: error.message });
    }
});

// PUT: Update a contact by Email
router.put('/email/:email', validateContact, async (req, res) => {
    try {
        const { email } = req.params;
        const { name, phone, age, category } = req.body;
        const newEmail = req.body.email; // New email to update

        // 1. Find the existing contact by the current email
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        // 2. Check if the new email already exists in another contact
        if (newEmail && newEmail !== email) {
            const duplicateEmail = await Contact.findOne({ where: { email: newEmail } });
            if (duplicateEmail) {
                return res.status(400).json({
                    details: 'A contact with this email already exists.',
                });
            }
        }

        // 3. Update the contact
        await contact.update({ name, email: newEmail, phone, age, category });

        return res.json(contact);
    } catch (error) {
        // Handle unique constraint error (if the user changed the email to another existing email)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                details: 'A contact with this email already exists.',
            });
        }
        return res.status(500).json({ details: error.message });
    }
});

// DELETE: Delete a contact by Email
router.delete('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ details: 'Contact not found' });
        }
        await contact.destroy();
        return res.json({ details: 'Contact deleted successfully' });
    } catch (error) {
        return res.status(500).json({ details: error.message });
    }
});

module.exports = router;