
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
  isLoading
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  return (
    <div className="border-t p-4 backdrop-blur-sm bg-background/90 sticky bottom-0 z-10">
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-xl border bg-background shadow-sm">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question..."
            className="resize-none pr-12 max-h-32 overflow-y-auto min-h-[56px] border-none focus-visible:ring-0 rounded-xl"
            disabled={isLoading}
            rows={1}
          />
          <div className="absolute right-3 bottom-3">
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-9 w-9 shadow-md bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 px-1">
          NyayaGPT provides general legal information, not legal advice. Always consult a qualified lawyer for specific legal matters.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
