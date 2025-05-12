
import React from 'react';
import { MenuIcon, XIcon, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModelSelector from '@/components/ModelSelector';

interface ChatToolbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showSources: boolean;
  setShowSources: (show: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  clearChat: () => void;
  handleNewConversation: () => void;
  messagesLength: number;
}

const ChatToolbar: React.FC<ChatToolbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  showSources,
  setShowSources,
  selectedModel,
  setSelectedModel,
  clearChat,
  handleNewConversation,
  messagesLength
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b backdrop-blur-sm bg-background/90 sticky top-0 z-10">
      {/* Toggle Sidebar Button (Desktop) */}
      <Button 
        variant="ghost" 
        size="icon"
        className="hidden md:flex"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        {sidebarOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
      </Button>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs rounded-full"
          onClick={() => setShowSources(!showSources)}
        >
          {showSources ? "Hide Sources" : "Show Sources"}
        </Button>
        
        <ModelSelector 
          selectedModel={selectedModel} 
          setSelectedModel={setSelectedModel} 
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          disabled={messagesLength === 0}
          title="Clear conversation"
          className="rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNewConversation}
          title="New conversation"
          className="rounded-full"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatToolbar;
