import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CATEGORY_OPTIONS, initialFormData } from '../constants/constants';
import { updateContactByEmail } from '../services/contactService';
import { validateFormData } from '../utils/utils';

function EditContactDialog({ open, onClose, contactData, onContactUpdated }) {

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (open && contactData) {
            setFormData({
                name: contactData.name || '',
                email: contactData.email || '',
                phone: contactData.phone || '',
                age: contactData.age || '',
                category: contactData.category || 1
            });
            setApiError(null);
        }
    }, [open, contactData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        // 1. Run validation
        const validationErrors = validateFormData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission if invalid
        }

        // Clear any old errors if validation passes
        setErrors({});

        try {
            // 2. Call the update service
            await updateContactByEmail(contactData.email, {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                age: Number(formData.age),
                category: Number(formData.category),
            });

            // 3. Show success alert
            alert('Contact updated successfully!');

            // 4. Notify parent and close dialog
            if (onContactUpdated) onContactUpdated();
            onClose();
        } catch (err) {
            if (err.response) {
                setApiError(err.response.data.message || 'Error updating contact');
            } else {
                setApiError('Network error');
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            required
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                        <TextField
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            error={!!errors.age}
                            helperText={errors.age}
                        />
                        <FormControl fullWidth error={!!errors.category}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                {CATEGORY_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.category && (
                                <Typography variant="caption" color="error">
                                    {errors.category}
                                </Typography>
                            )}
                        </FormControl>
                    </Stack>

                    {apiError && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {apiError}
                        </Typography>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditContactDialog;