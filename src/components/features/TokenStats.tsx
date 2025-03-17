// src/components/features/TokenStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { conversationService } from '@/services/api';

interface TokenStatsProps {
  conversationId: string;
  userId: string;
}

interface TokenStatsData {
  conversation_id: string;
  user_id: string;
  total_user_tokens: number;
  total_model_tokens: number;
  total_tokens: number;
  message_count: number;
}

export function TokenStats({ conversationId, userId }: TokenStatsProps) {
  const [tokenStats, setTokenStats] = useState<TokenStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenStats = async () => {
      if (!conversationId || !userId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await conversationService.getTokenStats(conversationId, userId);
        setTokenStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load token statistics.');
        setTokenStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenStats();
  }, [conversationId, userId]);

  return (
    <div className="p-4 border-l">
      <h3 className="text-lg font-semibold mb-4">Token Statistics</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : tokenStats ? (
        <div className="space-y-2">
          <p>
            <strong>Input Tokens:</strong> {tokenStats.total_user_tokens}
          </p>
          <p>
            <strong>Output Tokens:</strong> {tokenStats.total_model_tokens}
          </p>
          <p>
            <strong>Total Tokens:</strong> {tokenStats.total_tokens}
          </p>
          <p>
            <strong>Message Count:</strong> {tokenStats.message_count}
          </p>
        </div>
      ) : (
        <p>No token statistics available.</p>
      )}
    </div>
  );
}
