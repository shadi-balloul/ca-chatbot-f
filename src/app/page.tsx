// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';

export default function Home() {
  const [inputUserId, setInputUserId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUserId } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputUserId.trim()) {
      setError('Please enter a user ID');
      return;
    }
    
    setUserId(inputUserId);
    router.push('/conversations');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Chatbot</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Enter your User ID"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                placeholder="user123"
                error={error}
              />
              
              <Button type="submit" className="w-full">
                Continue to Conversations
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}