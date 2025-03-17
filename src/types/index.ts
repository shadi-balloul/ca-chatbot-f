// src/types/index.ts
export interface Conversation {
  _id: string;  // Changed from 'id' to '_id' to match your API
  user_id: string;
  messages: Message[];  // Added to match your API response
  start_time: string;   // Changed from 'created_at' to 'start_time'
  last_message_time: string;  // Changed from 'updated_at' to 'last_message_time'
}

export interface Message {
  role: 'user' | 'model';  // Changed 'assistant' to 'model' to match your API
  content: string;
  timestamp: string;  // Changed from 'created_at' to 'timestamp'
  token_count?: number | null;  // Added to match your API response
}

export interface ConversationWithFirstMessage extends Conversation {
  first_message?: string;
}

export interface CacheInfo {
  name: string;
  model: string;
  display_name: string;
  create_time: string;
  update_time: string;
  expire_time: string;
  ttl_seconds: number | null; // Important: ttl_seconds is number | null
}