'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { conversationService } from '@/services/api';
import { CacheInfo } from '@/types';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/layout/Layout';

const DashboardPage = () => {
    const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCacheData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await conversationService.getContextCacheInfo();
            setCacheInfo(data);
        } catch (apiError: any) {
            setError(apiError.message || 'Failed to load cache information.');
            setCacheInfo(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCacheData();
    }, [fetchCacheData]);

    const handleRefresh = () => {
        fetchCacheData();
    };

    return (
        <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-100"> {/* Center on page, min-height */}
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl"> {/* Responsive width, max width */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center"> {/* Bigger font size for title */}
                    Dashboard - Context Cache Information
                </h1>

                <div className="mb-6 flex justify-end"> {/* Moved button to right, added margin-bottom */}
                    <Button onClick={handleRefresh} variant="outline" size="md"> {/* Outline variant, md size */}
                        Refresh Cache Info
                    </Button>
                </div>

                {loading ? (
                    <p className="text-lg text-gray-700">Loading cache information...</p> 
                ) : error ? (
                    <p className="text-red-500 text-lg">Error loading cache info: {error}</p> 
                ) : cacheInfo ? (
                    <div className="space-y-4">
                        <div className="flex items-center"> 
                            <strong className="text-lg text-gray-700 w-40 flex-shrink-0">Cache Name:</strong> 
                            <p className="text-lg text-blue-600">{cacheInfo?.name ?? 'N/A'}</p> 
                        </div>
                        <div className="flex items-center">
                            <strong className="text-lg text-gray-700 w-40 flex-shrink-0">Model:</strong>
                            <p className="text-lg text-blue-600">{cacheInfo?.model ?? 'N/A'}</p>
                        </div>
                        <div className="flex items-center">
                            <strong className="text-lg text-gray-700 w-40 flex-shrink-0">Display Name:</strong>
                            <p className="text-lg text-blue-600">{cacheInfo?.display_name ?? 'N/A'}</p>
                        </div>
                        <div className="flex items-center">
                            <strong className="text-lg text-gray-700 w-40 flex-shrink-0">Created Time:</strong>
                            <p className="text-lg text-blue-600">{new Date(cacheInfo?.create_time ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center">
                            <strong className="text-lg text-gray-700 w-40 flex-shrink-0">Last Update Time:</strong>
                            <p className="text-lg text-blue-600">{new Date(cacheInfo?.update_time ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center">
                            <strong className="text-lg text-gray-700 w-40 flex-shrink-0">Expire Time:</strong>
                            <p className="text-lg text-blue-600">{new Date(cacheInfo?.expire_time ?? 0).toLocaleString()}</p>
                        </div>
                        {cacheInfo?.ttl_seconds !== null && (
                            <div className="flex items-center">
                                <strong className="text-lg text-gray-700 w-40 flex-shrink-0">TTL (seconds):</strong>
                                <p className="text-lg text-blue-600">{cacheInfo?.ttl_seconds}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700">No cache information available.</p>
                )}
            </div>
        </div>
        </Layout>
    );
};

export default DashboardPage;