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
  sendMessage: async (
    conversationId: string,
    userId: string,
    message: string
  ): Promise<Message> => {
    console.log('Sending text message payload:', {
      conversationId,
      userId,
      message,
      type: 'text'
    });

    const response = await apiClient.post(`/api/conversations/${conversationId}/messages/`, {
      user_id: userId,
      message,
      type: 'text',  // <-- ensure we specify 'text' for normal text messages
    });
    return response.data;
  },
  sendAudioMessage: async (
    conversationId: string,
    userId: string,
    transcript: string,
    audioBlob: Blob
  ): Promise<Message> => {
    console.log('Sending audio message payload:', {
      conversationId,
      userId,
      message: transcript,
      type: 'audio',
    });

    // Step 1: Send the transcript with type='audio'
    const sendResponse = await apiClient.post(`/api/conversations/${conversationId}/messages/`, {
      user_id: userId,
      message: transcript,
      type: 'audio'
    });
    const botMessage: Message = sendResponse.data; // The response from the bot
    const sentMessageIndex = (sendResponse.data as any).sent_message_index;

    // Step 2: If we have a sent_message_index, upload the audio file
    if (sentMessageIndex !== undefined && sentMessageIndex !== null) {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('message_index', String(sentMessageIndex));
      formData.append('audio', audioBlob); // must be appended as file

      console.log('Uploading audio file with message_index:', sentMessageIndex);

      await apiClient.post(
        `/api/conversations/${conversationId}/audio`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    // Step 3: Return the bot’s response from step 1
    return botMessage;
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