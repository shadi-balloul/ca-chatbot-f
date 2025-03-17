// src/components/features/ChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { conversationService } from '@/services/api';
import { Conversation, Message } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { TokenStats } from './TokenStats'; // Import TokenStats

interface ChatInterfaceProps {
  userId: string;
  conversation: Conversation;
}

export function ChatInterface({ userId, conversation }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await conversationService.getConversationHistory(
        conversation._id,
        userId
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (conversation && userId) {
      fetchMessages();
    }
  }, [conversation, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);

      // Optimistically add user message to UI
      const tempUserMessage: Message = {
        role: 'user',
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, tempUserMessage]);
      setNewMessage('');

      // Send to API and get bot response
      const botResponse = await conversationService.sendMessage(
        conversation._id,
        userId,
        newMessage
      );

      // Add the real response from the bot
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">Conversation</h2>
      </div>

      <div className="flex-1 flex overflow-hidden"> {/* flex-1 to take available space and flex to display in the same row*/}
        <div className="flex-1 overflow-y-auto p-4 space-y-4"> {/* flex-1 to take available space */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Start a conversation by sending a message.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                    }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}
                  >
                    {formatDate(message.timestamp)} {message.token_count + ' tokens'}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <TokenStats conversationId={conversation._id} userId={userId} /> {/* Add TokenStats here */}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="flex items-center gap-1"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
