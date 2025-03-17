'use client';

import { useState, useEffect, useRef } from 'react';
import { conversationService } from '@/services/api';
import { Conversation, Message } from '@/types';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface MobileChatInterfaceProps {
  userId: string;
  conversation: Conversation;
}

export function MobileChatInterface({ userId, conversation }: MobileChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

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

  const adjustTextareaHeight = () => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${Math.min(
        messageInputRef.current.scrollHeight,
        120
      )}px`;
    }
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
      
      // Reset textarea height
      if (messageInputRef.current) {
        messageInputRef.current.style.height = 'auto';
      }

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
      <div className="p-4 border-b bg-blue-600 text-white">
        <h2 className="text-lg font-semibold">Bank Chat Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {formatDate(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex-shrink-0 sticky bottom-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1 min-h-[40px] border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <textarea
              ref={messageInputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                adjustTextareaHeight();
              }}
              placeholder="Type your message..."
              className="w-full p-3 focus:outline-none resize-none min-h-[40px] max-h-[120px]"
              disabled={isSending}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full h-10 w-10 disabled:opacity-50"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}