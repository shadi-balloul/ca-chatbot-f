// src/services/api.ts
import axios from 'axios';
import { Conversation, Message, CacheInfo } from '@/types';

// Base API URL - update this to your FastAPI backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const conversationService = {
  createConversation: async (userId: string): Promise<Conversation> => {
    // Updated to match your API endpoint
    const response = await apiClient.post('/api/conversations/', { user_id: userId });
    return response.data;
  },
  
  getUserConversations: async (userId: string): Promise<Conversation[]> => {
    // Updated to match your API endpoint
    const response = await apiClient.get(`/api/conversations/user/${userId}/`);
    return response.data;
  },
  
  getConversationHistory: async (conversationId: string, userId: string): Promise<Message[]> => {
    // Updated to match your API endpoint and add the user_id as a query parameter
    const response = await apiClient.get(`/api/conversations/${conversationId}/history/`, {
      params: { user_id: userId }
    });
    return response.data;
  },
  
  sendMessage: async (conversationId: string, userId: string, message: string): Promise<Message> => {
    // Updated to match your API endpoint and request body format
    const response = await apiClient.post(`/api/conversations/${conversationId}/messages/`, {
      user_id: userId,
      message
    });
    return response.data;
  },
  getContextCacheInfo: async (): Promise<CacheInfo> => {
    try {
        const response = await apiClient.get('/api/context-cache/info');

        // **Check response.status instead of response.ok for Axios:**
        if (response.status < 200 || response.status >= 300) { // Check if status is NOT in the 2xx success range
            const errorData = response.data; // Axios uses response.data for response body
            throw new Error(errorData.detail || `Failed to fetch context cache info: ${response.statusText}`);
        }

        return response.data;
    } catch (error: any) {
        console.error("API Error fetching context cache info:", error.message);
        throw error;
    }
  },
  getTokenStats: async (conversationId: string, userId: string): Promise<any> => {
    const response = await apiClient.get(`/api/conversations/${conversationId}/token-stats`, {
      params: { user_id: userId },
    });
    return response.data;
  },
};