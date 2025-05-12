
import React from 'react';
import { format } from 'date-fns';
import { Scale, Clock, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ThinkingAnimation from './ThinkingAnimation';

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
  thinking?: boolean;
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
    <div 
      className={cn(
        "py-6 px-4 md:px-8 border-b border-border animate-fade-in",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-start gap-4">
          <div 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
              isUser ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}
          >
            {isUser ? (
              <span className="text-sm font-medium">U</span>
            ) : (
              <Scale className="h-4 w-4" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-medium text-sm">
                {isUser ? 'You' : 'NyayaGPT'}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.timestamp), 'HH:mm')}
              </span>
              
              {!isUser && message.metadata && (
                <Badge variant="outline" className="text-xs font-normal rounded-full px-2">
                  {message.metadata.model}
                </Badge>
              )}
            </div>
            
            <div className={cn(
              "text-foreground leading-relaxed rounded-xl",
              isUser ? "bg-primary/5 p-3" : "bg-transparent"
            )}>
              {message.thinking ? (
                <ThinkingAnimation />
              ) : (
                formattedContent
              )}
            </div>
            
            {!isUser && message.metadata && !message.thinking && (
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
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
            
            {!isUser && message.sources && message.sources.length > 0 && !message.thinking && (
              <div className="mt-2">
                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                  <span>{message.sources.length} sources cited</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
