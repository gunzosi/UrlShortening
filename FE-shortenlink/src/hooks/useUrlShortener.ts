import { useState, useCallback } from "react";
import { UrlRequest } from "../payload/req/UrlRequest";
import { UrlResponse } from "../payload/res/UrlResponse";
import { LinkItemType } from "../payload/type/LinkItemType";
import axiosInstance from "../config/axiosConfig";
import {UserResponse} from "../payload/res/UserResponse";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

export const useUrlShortener = () => {
    const [loading, setLoading] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const shortenUrl = useCallback(async (urlRequest: UrlRequest): Promise<UrlResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post<UrlResponse>(`${API_BASE_URL}/shorten`, urlRequest);

            if (response.data.resource) {
                const urlCode = response.data.resource.replace(/.*\/api\/v1\//, "");
                setShortUrl(`${API_BASE_URL}/${urlCode}`);
            }

            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            console.error('Error:', err.response?.data?.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllUrl = useCallback(async (): Promise<LinkItemType[] | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get<UrlResponse>('/getAll');

            const links = response.data.data?.map((item: any) => ({
                id: item.id,
                title: item.title || item.longUrl,
                longUrl: item.longUrl,
                shortUrl: `${API_BASE_URL}/${item.urlCode}`,
                urlCode: item.urlCode,
                createdAt: item.createdAt,
            })) ?? [];

            return links;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUrl = useCallback(async (urlCode: string, urlRequest: string): Promise<UrlResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.put<UrlResponse>(`${API_BASE_URL}/edit/${urlCode}`, {
                customUrlCode: urlRequest
            });

            if (response.data?.message === 'Error' && response.data?.description === '@Service - Custom URL code already exists') {
                setError('Custom URL code already exists');
                return null;
            }

            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUrl = useCallback(async (urlCode: string): Promise<UrlResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.delete<UrlResponse>(`${API_BASE_URL}/${urlCode}`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUrlUUID = useCallback(async (urlCode: string): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get<UrlResponse>(`${API_BASE_URL}/getUUID/${urlCode}`);
            return response.data.urlUUID;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUrlStats = useCallback(async (urlUUID: string): Promise<UrlResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get<UrlResponse>(`${API_BASE_URL}/link/${urlUUID}/stats`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserUrls = useCallback(async (): Promise<LinkItemType[] | null> => {
        try {
            setLoading(true);
            setError(null);
            // Use the specific endpoint for user's URLs
            const response = await axiosInstance.get<UrlResponse>('/user/urls');

            const links = response.data.data?.map((item: any) => ({
                id: item.id,
                title: item.title || item.longUrl,
                longUrl: item.longUrl,
                shortUrl: `${API_BASE_URL}/${item.urlCode}`,
                urlCode: item.urlCode,
                createdAt: item.createdAt,
            })) ?? [];

            return links;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // New method to get URL owner
    const getUrlOwner = useCallback(async (urlCode: string): Promise<UserResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get<UserResponse>(`/url/${urlCode}/owner`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

// New method to get user's URLs by specific user ID (if needed)
    const getUserUrlsById = useCallback(async (userId: number): Promise<LinkItemType[] | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get<UrlResponse>(`/user/${userId}/urls`);

            const links = response.data.data?.map((item: any) => ({
                id: item.id,
                title: item.title || item.longUrl,
                longUrl: item.longUrl,
                shortUrl: `${API_BASE_URL}/${item.urlCode}`,
                urlCode: item.urlCode,
                createdAt: item.createdAt,
            })) ?? [];

            return links;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        shortUrl,
        getAllUrl,
        shortenUrl,
        updateUrl,
        deleteUrl,
        getUrlUUID,
        getUrlStats,
        getUserUrls,
        getUrlOwner,
        getUserUrlsById
    };
};