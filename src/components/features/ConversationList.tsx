// src/components/features/ConversationList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { conversationService } from '@/services/api';
import { Conversation, Message, ConversationWithFirstMessage } from '@/types';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ConversationListProps {
  userId: string;
  activeConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({ 
  userId, 
  activeConversationId,
  onSelectConversation 
}: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationWithFirstMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // In ConversationList.tsx, update the fetchConversations function:

const fetchConversations = async () => {
  try {
    setIsLoading(true);
    const fetchedConversations = await conversationService.getUserConversations(userId);
    
    // Transform conversations to include first message if available
    const conversationsWithFirstMessages = fetchedConversations.map(conversation => {
      // Check if the conversation already has messages in the response
      const userMessages = conversation.messages
        ? conversation.messages.filter(msg => msg.role === 'user')
        : [];
      
      return {
        ...conversation,
        first_message: userMessages.length > 0 ? userMessages[0].content : undefined
      };
    });
    
    setConversations(conversationsWithFirstMessages);
  } catch (error) {
    console.error('Error fetching conversations:', error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const createNewConversation = async () => {
    try {
      const newConversation = await conversationService.createConversation(userId);
      setConversations(prev => [newConversation, ...prev]);
      onSelectConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const getConversationTitle = (conversation: ConversationWithFirstMessage) => {
    if (conversation.first_message) {
      // Take first few words (up to 5)
      const words = conversation.first_message.split(' ');
      return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
    }
    return 'Empty Conversation';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <Button 
          onClick={createNewConversation} 
          className="w-full flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Conversation
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-pulse">Loading conversations...</div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            No conversations yet
          </div>
        ) : (
          <ul className="divide-y">
            {conversations.map((conversation) => (
              <li key={conversation._id}>
                <button
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none ${
                    activeConversationId === conversation._id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="font-medium truncate">
                    {getConversationTitle(conversation)}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {new Date(conversation.last_message_time).toLocaleDateString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}