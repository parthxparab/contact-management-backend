import { CATEGORY_OPTIONS } from "../constants/constants";

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateFormData(formData) {

    const errors = {};

    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Invalid email format';
    }
    if ((formData.age && (formData.age === "" || isNaN(formData.age) || formData.age < 0 || formData.age > 120))) {
        errors.age = 'Age must be a number between 0 and 120';
    }
    const phoneRegex = /^(?:[+\-()\s]*\d){10}[+\-()\s]*$/;
    if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Phone must have exactly 10 digits (0-9) and may include +, -, (, ), or spaces.';
    }
    const validCategories = CATEGORY_OPTIONS.map((opt) => opt.value); // [1,2,3]
    if (!validCategories.includes(Number(formData.category))) {
        errors.category = 'Invalid category selected';
    }

    return errors;
}

export function getCategoryLabel(categoryValue) {
    switch (categoryValue) {
        case 1: return 'Family';
        case 2: return 'Friends';
        case 3: return 'Work';
        default: return 'Unknown';
    }
}

export function formatPhoneNumber(phone) {
    if (!phone) return '';

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check if it has exactly 10 digits
    if (digits.length === 10) {
        const areaCode = digits.slice(0, 3);
        const middle = digits.slice(3, 6);
        const last = digits.slice(6);
        return `(${areaCode}) ${middle}-${last}`;
    }

    // If not 10 digits, just return the raw input
    return phone;
}

export const handleInputChange = (setState) => (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
};