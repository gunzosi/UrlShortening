import React, {FormEvent, useState} from 'react';
import axios from 'axios';
import {List} from "@mui/material";
import {type} from "node:os";
import {useUrlShortener} from "../hooks/useUrlShortener";

const CreateLinkPage = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const {loading, error, shortenUrl} = useUrlShortener();

    type urlResponse = {
        message: string,
        description: string,
        resource: string,
        errors: []
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await shortenUrl({ longUrl });
        if (response?.resource) {
            const baseUrl = "http://localhost:8080/";
            const urlCode = response.resource.replace(/.*\/api\/v1\//, "");
            setShortUrl(baseUrl + urlCode); // Đảm bảo định dạng đúng
        }
    };

    console.log(longUrl);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create a New Link</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Original URL
                    </label>
                    <input
                        type="url"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the original URL"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            {shortUrl && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    <p className={"font-medium"}>Shortened URL :</p>
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={"text-blue-600 hover:underline break-all"}
                    >
                        {shortUrl}
                    </a>
                </div>
            )}
        </div>
    );
};

export default CreateLinkPage;
