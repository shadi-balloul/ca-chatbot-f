// src/app/conversations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ConversationList } from '@/components/features/ConversationList';
import { ChatInterface } from '@/components/features/ChatInterface';
import { useUser } from '@/context/UserContext';
import { Conversation } from '@/types';

export default function ConversationsPage() {
  const { userId } = useUser();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

  if (!userId) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-12rem)]">
        <div className="flex h-full">
          {/* Mobile menu button */}
          <div className="md:hidden p-4 bg-gray-50 border-b">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isMobileMenuOpen ? 'Hide Conversations' : 'Show Conversations'}
            </button>
          </div>

          {/* Sidebar - Conversation List */}
          <div className={`w-full md:w-1/3 lg:w-1/4 bg-gray-50 border-r ${
            isMobileMenuOpen ? 'block absolute inset-0 z-10 bg-white' : 'hidden md:block'
          }`}>
            {isMobileMenuOpen && (
              <div className="p-4 border-b">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 focus:outline-none"
                >
                  Close
                </button>
              </div>
            )}
            <ConversationList
              userId={userId}
              activeConversationId={selectedConversation?._id}
              onSelectConversation={(conversation) => {
                setSelectedConversation(conversation);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>

          {/* Main Content - Chat Interface */}
          <div className="flex-1">
            {selectedConversation ? (
              <ChatInterface
                userId={userId}
                conversation={selectedConversation}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation or create a new one to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}