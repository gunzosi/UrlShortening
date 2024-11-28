import React, {useEffect, useState} from 'react';
import { QRCodeSVG } from "qrcode.react";
import {
    Card,
    CardContent,
    CardHeader,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Input,
    SelectChangeEvent
} from '@mui/material';
import { useUrlShortener } from "../hooks/useUrlShortener";

const QrCodePage = () => {
    const [url, setUrl] = useState('');
    const [selectedUrl, setSelectedUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

// Hook to get all URLs from the database (or other source)
    const { getAllUrl, getUserUrls, loading, error : fetchError } = useUrlShortener();

    const [urls, setUrls] = useState<{id: string, longUrl : string}[]>([]);

// Step 2: Fetch URLs from DB or API on component mount
    useEffect(() => {
        const fetchUrls = async() => {
            const urlsFromDb  = await getAllUrl();
            setUrls(urlsFromDb ?? []);
        }

        fetchUrls().then();
    }, [getAllUrl]);

// Step 3: Handle URL change from input
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        setError('');
    }

// Step 4: Handle dropdown selection (select existing URL from DB)
    const handleSelectUrl = (event: SelectChangeEvent<string>) => {
        const selected = event.target.value as string;
        setSelectedUrl(selected);
        setUrl(selected);
    };

// Step 5: Handle generating QR Code when input or selection changes
    const handleGenerateQRCode = () => {
        if (!url && !selectedUrl) {
            setError('Please enter a valid URL or select from the dropdown');
        }
    };

// Step 6. Return the QR Code with the URL by <QRCodeSVG /> component
    return (
        <div className={"max-w-2x1 mx-auto p-6"}>
            <h1 className={"text-2xl font-bold mb-6"}>
                Generate QR Code
            </h1>

            <Card>
                <CardHeader title={"Enter URL"}/>
                <CardContent>
                    <div className={"mb-4"}>
                        <input
                            type={"url"}
                            value={url}
                            onChange={handleUrlChange}
                            className={"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}
                            placeholder={"Enter URL"}
                            required
                        />
                    </div>
                    <FormControl fullWidth>
                        <InputLabel>
                            Choose URL From existing links
                        </InputLabel>
                        <Select
                            value={selectedUrl}
                            onChange={handleSelectUrl}
                            input={<Input />}
                            label="Choose URL from existing links"
                        >
                            {urls.map((url) => (
                                <MenuItem key={url.id} value={url.longUrl}>
                                    {url.longUrl}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

{/* Error handling */}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mt-6 flex justify-center">
                {(url || selectedUrl) && !error ? (
                    <QRCodeSVG value={url || selectedUrl} size={256} />
                ) : null}
            </div>

{/* Handle loading state */}
            {loading && <div>Loading...</div>}

{/* Error fetching URLs */}
            {fetchError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {fetchError}
                </div>
            )}
        </div>
    );
}

export default QrCodePage;