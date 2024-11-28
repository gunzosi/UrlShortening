import axios from 'axios';
import {jwtDecode } from 'jwt-decode';
import axiosInstance from '../config/axiosConfig';

const API_DEV_BASE_URL = "http://localhost:8080/api/v1/auth";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    role?: string[];
}

export interface JwtPayload {
    id: number;
    username: string;
    email: string;
    roles: string[];
    exp: number;
}

export const AuthService = {
    async login(loginRequest: LoginRequest) {
        try {
            const response = await axiosInstance.post(`/auth/signin`, loginRequest);
            console.log("Login response data:", response.data);
            // @ts-ignore
            if (response.data.token) {
                // @ts-ignore
                const decodedToken = jwtDecode<JwtPayload>(response.data.token);
                console.log("Decoded Token:", decodedToken);

                // Lưu vào localStorage
                console.log("----- Saving user to localStorage with key \'user\' : ", {});
                localStorage.setItem('user', JSON.stringify({
                    // @ts-ignore
                    accessToken: response.data.token,
                    id: decodedToken.id,
                    username: decodedToken.username,
                    email: decodedToken.email,
                    roles: decodedToken.roles
                }));


                return {
                    // @ts-ignore
                    token: response.data.token,
                    user: {
                        id: decodedToken.id,
                        username: decodedToken.username,
                        email: decodedToken.email,
                        roles: decodedToken.roles
                    }
                };
            }
            return response.data;
        } catch (error: any) {
            console.error('Login error details:', error.response?.data || error.message);
            throw error;
        }
    },

    async signup(signupRequest: SignupRequest) {
        try {
            const response = await axios.post(`${API_DEV_BASE_URL}/signup`, signupRequest);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    logout() {
        // Remove user from localStorage
        localStorage.removeItem('user');
    },

    getCurrentUser(): JwtPayload | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                // Verify token exists and is not expired
                if (userData.accessToken && !this.isTokenExpired()) {
                    return jwtDecode<JwtPayload>(userData.accessToken);
                }
            } catch (error) {
                console.error('Error decoding user token:', error);
                this.logout();
            }
        }
        return null;
    },

    isTokenExpired(): boolean {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                if (userData.accessToken) {
                    const decodedToken = jwtDecode<JwtPayload>(userData.accessToken);
                    // Check if token expiration time is in the past
                    return Date.now() >= (decodedToken.exp * 1000);
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
                return true;
            }
        }
        return true;
    },

};