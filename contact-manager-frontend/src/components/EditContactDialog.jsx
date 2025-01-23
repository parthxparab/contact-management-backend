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
import { updateContactByEmail } from '../services/contactService';
import { handleInputChange, validateFormData } from '../utils/utils';

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
            setErrors({});
            setApiError(null);
        }
    }, [open, contactData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        // 1. Run validation
        const validationErrors = validateFormData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; 
        }

        setErrors({});

        try {
            // 2. Call the update service
            await updateContactByEmail(contactData.email, {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                age: formData.age ? Number(formData.age) : null,
                category: Number(formData.category),
            });

            // 3. Show success alert
            alert('Contact updated successfully!');

            // 4. Notify parent and close dialog
            if (onContactUpdated) onContactUpdated();
            onClose();
        } catch (err) {
            if (err.response) {
                setApiError(err.response.data.details || 'Error updating contact');
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