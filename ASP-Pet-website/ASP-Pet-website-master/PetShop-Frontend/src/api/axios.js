import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7189/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error('API Error:', {
            url: originalRequest.url,
            status: error.response?.status,
            data: error.response?.data
        });

        // Don't redirect if we're already on login page or if it's the login request itself
        if (error.response?.status === 401 && !originalRequest.url.includes('/Authenticate/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
