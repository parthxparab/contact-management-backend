const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { validateContact, validateContactPatch } = require('../middleware/validateContact');

// CREATE: Add a new contact
router.post('/', validateContact, async (req, res) => {
    try {
        const { name, email, phone, age, category } = req.body;
        const contact = await Contact.create({ name, email, phone, age, category });
        return res.status(201).json(contact);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'A contact with this email already exists.'
            });
        }
        return res.status(500).json({ message: error.message });
    }
});

// READ: Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        return res.json(contacts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// READ: Get contact by Email
router.get('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        return res.json(contact);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// PUT: Update a contact by Email
router.put('/email/:email', validateContact, async (req, res) => {
    try {
        const { email } = req.params;
        const { name, phone, age, category } = req.body;

        // 1. Find contact by email
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // 2. Update fields
        //    If the user tries to update the email, handle that separately
        //    or allow it (be mindful of the unique constraint).
        await contact.update({ name, email: req.body.email, phone, age, category });

        return res.json(contact);
    } catch (error) {
        // Handle unique constraint error (if the user changed the email to another existing email)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'A contact with this email already exists.',
            });
        }
        return res.status(500).json({ message: error.message });
    }
});

// PATCH: Partially update a contact by Email
router.patch('/email/:email', validateContactPatch, async (req, res) => {
    try {
        const { email } = req.params;
        const data = req.body;

        // 1. Find contact by email
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // 2. Update only the provided fields
        await contact.update(data);

        return res.json(contact);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'A contact with this email already exists.',
            });
        }
        return res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete a contact by Email
router.delete('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        await contact.destroy();
        return res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;