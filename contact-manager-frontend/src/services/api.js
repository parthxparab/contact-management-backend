// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/', // Adjust if your server is on a different port or domain
});

export default api;