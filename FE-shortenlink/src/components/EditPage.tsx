import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useUrlShortener } from "../hooks/useUrlShortener";

const EditPage = () => {
    const { urlCode } = useParams(); // Lấy urlCode từ URL params
    const navigate = useNavigate();
    const { loading, error, updateUrl } = useUrlShortener();
    const [newUrl, setNewUrl] = useState<string>('');

    // Cập nhật giá trị mặc định cho newUrl từ urlCode
    useEffect(() => {
        if (urlCode) {
            setNewUrl(urlCode); // Gán giá trị mặc định cho newUrl từ urlCode
        }
    }, [urlCode]);

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newUrl.trim()) {
            try {
                const response = await updateUrl(urlCode!, newUrl);
                // @ts-ignore
                console.log(response, response.message, response.description);

                // Kiểm tra lỗi nếu customUrlCode đã tồn tại
                if (response && response.message === 'Error' && response.description === '@Service - Custom URL code already exists') {
                    alert('Custom URL code already exists. Please choose another URL.');  // Thông báo lỗi khi đã tồn tại
                }

                if (response && response.message === 'Success' && response.description === '@Service - URL code updated successfully') {
                    alert('URL updated successfully');
                    navigate('/');
                }
            } catch (err) {
                console.error('Failed to update:', err);
            }
        }
    };

    return (
        <div className={"max-w-2xl mx-auto p-6"}>
            <h1 className={"text-2xl font-bold mb-6"}>Edit Custom URL</h1>
            <form onSubmit={handleUpdateSubmit} className={"space-y-4"}>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        New Custom URL
                    </label>
                    <input
                        type={"text"}
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={"Enter new custom URL"}
                        required
                    />
                </div>
                <button
                    type={"submit"}
                    disabled={loading}
                    className={"w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"}
                >
                    {loading ? 'Updating...' : 'Update URL'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default EditPage;
