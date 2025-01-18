// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/', // Adjust if your server is on a different port or domain
});

export default api;