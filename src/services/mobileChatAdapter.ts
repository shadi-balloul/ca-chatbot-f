import { conversationService } from './api';
import { Conversation, Message } from '@/types';

// This adapter helps to isolate the mobile chat functionality
// from the rest of the application, following the SOLID principles
export const mobileChatAdapter = {
  // Initialize a new conversation for a user
  initializeConversation: async (userId: string): Promise<Conversation> => {
    try {
      return await conversationService.createConversation(userId);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to initialize chat');
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId: string, userId: string): Promise<Message[]> => {
    try {
      return await conversationService.getConversationHistory(conversationId, userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to load messages');
    }
  },

  // Send a new message and get the response
  sendMessage: async (
    conversationId: string,
    userId: string,
    messageContent: string
  ): Promise<Message> => {
    try {
      return await conversationService.sendMessage(conversationId, userId, messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }
};