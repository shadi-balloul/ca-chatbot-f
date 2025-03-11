// src/types/index.ts
export interface Conversation {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Message {
    id: string;
    conversation_id: string;
    user_id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
  }
  
  export interface ConversationWithFirstMessage extends Conversation {
    first_message?: string;
  }