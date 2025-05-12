
import { apiService } from './api';

/**
 * Legal Query Request
 */
interface LegalQueryRequest {
  query: string;
  model?: string;
}

/**
 * Legal Query Response
 */
interface LegalQueryResponse {
  answer: string;
  sources: {
    title: string;
    url: string;
    snippet: string;
  }[];
  metadata: {
    model: string;
    processingTime: number;
    tokens: number;
  };
}

/**
 * Service for legal-related API calls
 */
export const legalService = {
  /**
   * Send a legal query to the backend
   */
  async sendQuery(request: LegalQueryRequest): Promise<LegalQueryResponse> {
    return apiService.post<LegalQueryResponse>('/api/query', request);
  },
  
  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId?: string): Promise<any> {
    const endpoint = conversationId 
      ? `/api/conversations/${conversationId}` 
      : '/api/conversations';
    return apiService.get(endpoint);
  },
  
  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    return apiService.delete(`/api/conversations/${conversationId}`);
  }
};
