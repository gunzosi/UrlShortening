import React, { useState } from 'react';
import  {useUrlShortener} from "../hooks/useUrlShortener";
import {useNavigate} from "react-router-dom";

interface LinkItemProps {
    id: string;
    title: string;
    longUrl: string;
    shortUrl: string;
    urlCode: string;
    createdAt: string;
    onDelete: () => void;
}

const LinkItem = ({
                      title,
                      longUrl,
                      shortUrl,
                      urlCode,
                      createdAt,
                      onDelete
                  }: LinkItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { loading, updateUrl } = useUrlShortener();
    const navigate = useNavigate();


    const domainUrl = "localhost:3000/";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const onAnalytics = async () => {
        console.log("Analytics Btn");
        navigate(`/analytics/${urlCode}`);
    };

    const onEditUrl = async () => {
        console.log("Analytics Btn");
        navigate(`/edit/${urlCode}`);
    };

    return (
        <div
            className="group hover:bg-blue-50/50 transition-colors duration-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0 pr-4">

                    <div className="flex items-center">
                        <span className="text-gray-500 font-semibold">Main Source: &nbsp;</span>
                        <h3 className="font-medium text-gray-900 truncate">
                            <a
                                href={longUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >{title || longUrl}</a>
                        </h3>
                    </div>
                    <div className="flex items-center mt-1 space-x-2 text-sm">
                        <span className="text-gray-500 font-semibold">Shorten URL:</span>
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            {shortUrl}
                        </a>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
                    </div>
                </div>

                <div
                    className={`flex items-center space-x-3 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-200`}
                >
                    <button
                        onClick={onEditUrl}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-600 hover:bg-orange-100 rounded transition-colors duration-200"
                    >
                        Edit Custom URL
                    </button>
                    <button
                        onClick={onAnalytics}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm text-yellow-600 hover:text-yellow-600 hover:bg-yellow-100 rounded transition-colors duration-200"
                    >
                        Details Analytics
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                    >
                        Copy
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkItem;