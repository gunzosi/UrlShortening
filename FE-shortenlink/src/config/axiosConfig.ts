import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                const token = userData.accessToken;

                if (token) {
                    const decodedToken = jwtDecode(token);
                    const isExpired = (decodedToken.exp as number) < Date.now() / 1000;

                    if (!isExpired) {
                        // @ts-ignore
                        config.headers['Authorization'] = `Bearer ${token}`;
                    } else {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }
                }
            } catch (error) {
                console.error('Error processing token:', error);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Access forbidden');
                    break;
                case 500:
                    console.error('Internal server error');
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;