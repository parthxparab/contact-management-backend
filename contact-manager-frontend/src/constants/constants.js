// src/constants/categories.js
export const CATEGORY_OPTIONS = [
    { value: 1, label: 'Family' },
    { value: 2, label: 'Friends' },
    { value: 3, label: 'Work' },
];

export const initialFormData = {
    name: '',
    email: '',
    phone: '',
    age: '',
    category: 1
};

export const textFields = [
    { label: 'Name', name: 'name', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Phone', name: 'phone', type: 'tel' },
    { label: 'Age', name: 'age', type: 'number' },
];