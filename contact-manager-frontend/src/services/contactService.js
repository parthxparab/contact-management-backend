// src/services/contactService.js
import api from './api';

/**
 * Fetch all contacts
 * GET /contacts
 */
export async function getAllContacts() {
    return api.get('/contacts');
}

/**
 * Fetch a single contact by Email
 * GET /contacts/email/:email
 */
export async function getContactByEmail(email) {
    return api.get(`/contacts/email/${encodeURIComponent(email)}`);
}
/**
 * Create a new contact
 * POST /contacts
 */
export async function createContact(data) {

    console.log({data})
    // Make a shallow copy of data, then strip non-digit chars from phone
    const sanitizedData = {
        ...data,
        phone: data.phone?.replace(/\D/g, '') ?? ''
    };

    return api.post('/contacts', sanitizedData);
}

/**
 * Update a contact fully (PUT) by Email
 * PUT /contacts/email/:email
 */
export async function updateContactByEmail(email, data) {
    // Make a shallow copy of data, then strip non-digit chars from phone
    const sanitizedData = {
        ...data,
        phone: data.phone?.replace(/\D/g, '') ?? ''
    };

    return api.put(`/contacts/email/${encodeURIComponent(email)}`, sanitizedData);
}
/**
 * Delete a contact by Email
 * DELETE /contacts/email/:email
 */
export async function deleteContactByEmail(email) {
    return api.delete(`/contacts/email/${encodeURIComponent(email)}`);
}