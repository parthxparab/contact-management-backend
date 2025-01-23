import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deleteContactByEmail, getAllContacts } from '../services/contactService';
import { formatPhoneNumber, getCategoryLabel } from '../utils/utils';
import EditContactDialog from './EditContactDialog'; 

function ContactsList({ refreshFlag }) {
    const [contacts, setContacts] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const fetchContacts = async () => {
        try {
            const res = await getAllContacts();
            setContacts(res.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [refreshFlag]);

    const handleContactUpdated = () => {
        setEditDialogOpen(false);
        setSelectedContact(null);
        fetchContacts(); 
    };

    const handleEditClick = (contact) => {
        setSelectedContact(contact);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = async (contactEmail) => {
        const confirmed = window.confirm('Are you sure you want to delete this contact?');
        if (!confirmed) {
            return;
        }

        try {
            await deleteContactByEmail(contactEmail);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: 2 }} elevation={4}>
                <Typography variant="h6" sx={{ m: 2 }}>
                    All Contacts
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['Name', 'Email', 'Phone', 'Age', 'Category'].map((header) => (
                                <TableCell key={header}>{header}</TableCell>
                            ))}
                            <TableCell align='center'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => (
                            <TableRow key={index}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{formatPhoneNumber(contact.phone)}</TableCell>
                                <TableCell>{contact.age ?? 'N/A'}</TableCell>
                                <TableCell>{getCategoryLabel(contact.category)}</TableCell>
                                <TableCell align='center'>
                                    {/* Edit button */}
                                    <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() => handleEditClick(contact)}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    {/* Delete button */}
                                    <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => handleDeleteClick(contact.email)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            {selectedContact && (
                <EditContactDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    contactData={selectedContact}
                    onContactUpdated={handleContactUpdated}
                />
            )}
        </>
    );
}

export default ContactsList;