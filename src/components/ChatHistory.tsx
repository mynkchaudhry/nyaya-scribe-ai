
import React from 'react';
import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatHistoryProps {
  conversations: {
    id: string;
    title: string;
    updatedAt: Date;
  }[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  className?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  className
}) => {
  return (
    <div className={cn("flex flex-col h-full bg-background border-r", className)}>
      <div className="p-4">
        <Button 
          onClick={onNewConversation} 
          variant="outline" 
          className="w-full justify-start gap-2 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-[1.02]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Conversation</span>
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div 
                key={conv.id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-200",
                  activeConversationId === conv.id 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent/50 hover:scale-[1.01]"
                )}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{conv.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto opacity-20" />
              <p className="mt-2">No conversations yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
