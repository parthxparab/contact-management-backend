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
import { createContact } from '../services/contactService';
import { validateFormData } from '../utils/utils';

function AddContactDialog({ open, onClose, onContactAdded }) {

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        const validationErrors = validateFormData(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            // Use the createContact service function
            await createContact({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                age: Number(formData.age),
                category: Number(formData.category)
            });

            alert('Contact added successfully!');
            // Reset the form
            setFormData(initialFormData);
            // Notify parent and close dialog
            if (onContactAdded) onContactAdded();
            onClose();

        } catch (err) {
            if (err.response) {
                setApiError(err.response.data.message || 'Error adding contact');
            } else {
                setApiError('Network error');
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add a New Contact</DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ mb: 2 }}>
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
                        <Typography color="error" sx={{ mb: 1 }}>
                            {apiError}
                        </Typography>
                    )}

                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddContactDialog;