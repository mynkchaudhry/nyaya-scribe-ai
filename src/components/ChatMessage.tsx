
import React from 'react';
import { format } from 'date-fns';
import { Scale, Clock, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  metadata?: {
    model: string;
    processingTime?: number;
    tokens?: number;
  };
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Format the content to handle newlines
  const formattedContent = message.content.split('\n').map((text, i) => (
    <React.Fragment key={i}>
      {text}
      {i < message.content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`flex items-start gap-4 mb-6 ${isUser ? 'justify-start' : 'justify-start'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-blue-600 text-white' : 'bg-blue-100'
      }`}>
        {isUser ? (
          <span className="text-sm font-medium">U</span>
        ) : (
          <Scale className="h-4 w-4 text-blue-600" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {isUser ? 'You' : 'NyayaGPT'}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          
          {!isUser && message.metadata && (
            <Badge variant="outline" className="text-xs font-normal">
              {message.metadata.model}
            </Badge>
          )}
        </div>
        
        <div className="text-gray-800 leading-relaxed">
          {formattedContent}
        </div>
        
        {!isUser && message.metadata && (
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {message.metadata.processingTime !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{message.metadata.processingTime}s</span>
              </div>
            )}
            {message.metadata.tokens !== undefined && (
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span>{message.metadata.tokens} tokens</span>
              </div>
            )}
          </div>
        )}
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <span>{message.sources.length} sources cited</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
