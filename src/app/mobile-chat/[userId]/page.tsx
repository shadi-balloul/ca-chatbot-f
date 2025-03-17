'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MobileChatInterface } from '@/components/features/MobileChatInterface';
import { conversationService } from '@/services/api';
import { Conversation } from '@/types';

export default function MobileChatPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!userId) {
        setError('User ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Create a new conversation when the page loads
        const newConversation = await conversationService.createConversation(userId);
        setConversation(newConversation);
      } catch (err: any) {
        console.error('Failed to create conversation:', err);
        setError(err.message || 'Failed to initialize chat');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Initializing chat...</div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <div className="text-red-500 mb-4">Error: {error || 'Could not create conversation'}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <MobileChatInterface userId={userId} conversation={conversation} />
    </div>
  );
}