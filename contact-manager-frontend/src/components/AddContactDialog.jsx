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
import { CATEGORY_OPTIONS, initialFormData, textFields } from '../constants/constants';
import { createContact } from '../services/contactService';
import { handleInputChange, validateFormData } from '../utils/utils';

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
            await createContact({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                age: formData.age ? Number(formData.age) : null,
                category: Number(formData.category)
            });

            alert('Contact added successfully!');
            setFormData(initialFormData);
            if (onContactAdded) onContactAdded();
            onClose();

        } catch (err) {
            if (err.response) {
                setApiError(err.response.data.details || 'Error adding contact');
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
                        {textFields.map((field) => (
                            <TextField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                type={field.type || 'text'}
                                value={formData[field.name]}
                                onChange={handleInputChange(setFormData)}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                required={field.required || false}
                            />
                        ))}
                        <FormControl fullWidth error={!!errors.category}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange(setFormData)}
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
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddContactDialog;