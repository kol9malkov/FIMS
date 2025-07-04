import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // или твой адрес
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers ??= {}; // ✅ если headers нет — создаём
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default api;
