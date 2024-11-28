import axios from 'axios';
import { AuthService } from '../service/AuthService';

// Create an Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            const token = userData.accessToken;

            if (AuthService.isTokenExpired()) {
                AuthService.logout();
                window.location.href = '/login';
                throw new Error('Token expired');
            }

            config.headers = {
                'Authorization': `Bearer ${token}`,
                ...config.headers
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);



// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;

        // If unauthorized and not already retried
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            AuthService.logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;