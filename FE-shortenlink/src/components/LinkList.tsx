import React, { useState, useEffect } from 'react';
import LinkItem from './LinkItem';
import { useUrlShortener } from '../hooks/useUrlShortener';
import { LinkItemType } from "../payload/type/LinkItemType";

const LinkList = () => {
    const [links, setLinks] = useState<LinkItemType[]>([]);
    const { loading, getUserUrls , error, getAllUrl, deleteUrl } = useUrlShortener();

    // Fetch All DATA
    useEffect(() => {
        const fetchLinks = async () => {
            const fetchedLinks = await getUserUrls();
            if (fetchedLinks) {
                setLinks(fetchedLinks);
            }
        };

        fetchLinks().then();
    }, [getUserUrls]);

    const handleDelete = async (urlCode: string) => {
        const response = await deleteUrl(urlCode);
        if (response?.message === 'Success') {
            setLinks(links.filter(link => link.urlCode !== urlCode));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Links</h2>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        Created date ↓
                    </button>
                    <button className="px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        Filters ⚡
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : links.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No links found</div>
                ) : (
                    links.map((link) => (
                        <LinkItem
                            key={link.id}
                            {...link}
                            onDelete={() => handleDelete(link.urlCode)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default LinkList;