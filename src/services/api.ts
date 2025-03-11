// src/services/api.ts
import axios from 'axios';
import { Conversation, Message } from '@/types';

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
    const response = await apiClient.post('/conversations/', { user_id: userId });
    return response.data;
  },

  getUserConversations: async (userId: string): Promise<Conversation[]> => {
    const response = await apiClient.get(`/conversations/user/${userId}/`);
    return response.data;
  },

  getConversationHistory: async (conversationId: string, userId: string): Promise<Message[]> => {
    const response = await apiClient.get(`/conversations/${conversationId}/history/`, {
      params: { user_id: userId }
    });
    return response.data;
  },

  sendMessage: async (conversationId: string, userId: string, message: string): Promise<Message> => {
    const response = await apiClient.post(`/conversations/${conversationId}/messages/`, {
      user_id: userId,
      message
    });
    return response.data;
  }
};