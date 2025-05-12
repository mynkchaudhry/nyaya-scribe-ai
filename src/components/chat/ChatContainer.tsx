
import React, { useRef, useEffect } from 'react';
import { Source } from '@/services/legalService';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  showSources: boolean;
  sources: Source[];
  isLoading: boolean;
  setInput: (input: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  showSources, 
  sources,
  isLoading,
  setInput
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const exampleQuestions = [
    "What are my rights if I'm arrested?",
    "Explain the process for filing a consumer complaint",
    "What are the grounds for divorce in India?",
    "Explain Right to Education Act provisions"
  ];

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-6">
          <Scale className="h-12 w-12 mx-auto text-primary opacity-80" />
        </div>
        <h3 className="text-3xl font-serif font-semibold text-foreground mb-3 animate-fade-in">Welcome to NyayaGPT</h3>
        <p className="text-muted-foreground max-w-lg mb-8 animate-fade-in">
          Your AI legal assistant trained on Indian law, including Supreme Court and High Court judgments, statutes, and legal procedures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl animate-fade-in">
          {exampleQuestions.map((example, index) => (
            <Button 
              key={index}
              variant="outline" 
              className="flex justify-start py-3 px-4 h-auto text-left rounded-xl hover:bg-accent transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setInput(example)}
            >
              <span className="truncate">{example}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-20">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Sources Panel (Conditional) */}
      {showSources && (
        <div className="w-80 border-l overflow-y-auto animate-slide-in-right">
          <SourcesPanel sources={sources} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
