
import { Source, ResponseMetadata } from '@/services/legalService';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  metadata?: ResponseMetadata;
  thinking?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}
