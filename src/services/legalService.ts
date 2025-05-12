
import { apiService } from './api';
import { ModelType } from '../config/api';

/**
 * Legal Query Request
 */
export interface LegalQueryRequest {
  query: string;
  model_name?: ModelType;
  conversation_id?: string;
  strategy?: 'simple' | 'fusion';
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * Source document from search results
 */
export interface Source {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  model: string;
  strategy: string;
  chunks_retrieved: number;
  tokens_used: number;
  processing_time: number;
  conversation_id: string;
}

/**
 * Legal Query Response
 */
export interface LegalQueryResponse {
  response: string;
  metadata: ResponseMetadata;
  context_sources: Source[];
}

/**
 * Streaming chunk response
 */
export interface StreamChunk {
  chunk?: string;
  full?: string;
  done?: boolean;
  metadata?: ResponseMetadata;
  context_sources?: Source[];
  error?: string;
}

/**
 * Conversation message
 */
export interface ConversationMessage {
  timestamp: number;
  query: string;
  response: string;
}

/**
 * Conversation history response
 */
export interface ConversationHistoryResponse {
  conversation_id: string;
  messages: ConversationMessage[];
}

/**
 * Service for legal-related API calls
 */
export const legalService = {
  /**
   * Send a legal query to the backend
   */
  async sendQuery(request: LegalQueryRequest): Promise<LegalQueryResponse> {
    // For non-streaming requests use POST
    return apiService.post<LegalQueryResponse>('/query', request);
  },
  
  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ConversationHistoryResponse> {
    return apiService.get<ConversationHistoryResponse>(`/conversation/${conversationId}`);
  },
  
  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    return apiService.delete(`/conversation/${conversationId}`);
  },

  /**
   * Delete a message from a conversation
   */
  async deleteMessage(conversationId: string, messageIndex: number): Promise<void> {
    return apiService.delete(`/conversation/${conversationId}/message/${messageIndex}`);
  },
  
  /**
   * Delete multiple messages from a conversation
   */
  async deleteMultipleMessages(conversationId: string, messageIndices: number[]): Promise<void> {
    return apiService.delete(`/conversation/${conversationId}/messages`, {
      message_indices: messageIndices
    });
  },

  /**
   * Create an EventSource for streaming responses
   */
  createEventSource(request: LegalQueryRequest): EventSource {
    // Convert the request to URL params for GET request
    const params = new URLSearchParams();
    
    // Add all request parameters
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    // Force stream parameter to be true
    params.set('stream', 'true');
    
    // Create an event source for the query endpoint
    const url = `${apiService.getBaseUrl()}/query?${params.toString()}`;
    return new EventSource(url);
  }
};

