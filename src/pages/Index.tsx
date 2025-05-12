
import React, { useState } from 'react';
import { toast } from 'sonner';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import ChatHistory from '@/components/ChatHistory';
import SplashScreen from '@/components/SplashScreen';
import { useLegalQuery } from '@/hooks/useLegalQuery';
import { DEFAULT_MODEL } from '@/config/api';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import ChatToolbar from '@/components/chat/ChatToolbar';
import { Message, Conversation } from '@/types/chat';

const LegalAssistant = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const { 
    isLoading, 
    progress, 
    sources,
    metadata,
    streamQuery 
  } = useLegalQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add thinking message
    const thinkingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      thinking: true,
    };

    setMessages(prevMessages => [...prevMessages, userMessage, thinkingMessage]);
    
    // Clear input
    const queryText = input.trim();
    setInput('');
    
    // Stream the query response
    streamQuery(
      queryText,
      selectedModel,
      conversationId || undefined,
      // On chunk handler (update the assistant message)
      (chunk, fullText) => {
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastIndex = newMessages.length - 1;
          
          // Replace the thinking message with the real response
          if (newMessages[lastIndex].thinking) {
            newMessages[lastIndex] = {
              role: 'assistant',
              content: fullText,
              timestamp: new Date(),
            };
          }
          
          return newMessages;
        });
      },
      // On complete handler
      (responseSources, responseMetadata) => {
        // Update the assistant message with sources and metadata
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastIndex = newMessages.length - 1;
          
          if (newMessages[lastIndex].role === 'assistant') {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              sources: responseSources,
              metadata: responseMetadata
            };
          }
          
          return newMessages;
        });
        
        // Create a conversation if it's a new one
        if (!conversationId && responseMetadata?.conversation_id) {
          const newConversationId = responseMetadata.conversation_id;
          const newConversation = {
            id: newConversationId,
            title: queryText.slice(0, 30) + (queryText.length > 30 ? '...' : ''),
            updatedAt: new Date()
          };
          
          setConversations(prev => [...prev, newConversation]);
          setConversationId(newConversationId);
        }
      }
    );
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    toast.success("Chat cleared");
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    // In a real app, we would load the conversation from the server
    setConversationId(id);
    toast.success(`Conversation ${id} loaded`);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (conversationId === id) {
      setMessages([]);
      setConversationId(null);
    }
    
    toast.success(`Conversation deleted`);
  };

  if (showSplashScreen) {
    return <SplashScreen onComplete={() => setShowSplashScreen(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {isLoading && (
        <div className="absolute top-16 left-0 right-0 z-10">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar - Hidden on mobile */}
        <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0'}`}>
          {sidebarOpen && (
            <ChatHistory 
              conversations={conversations}
              activeConversationId={conversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              className="h-full"
            />
          )}
        </div>
        
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-16 z-10">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 rounded-r-2xl">
            <ChatHistory 
              conversations={conversations}
              activeConversationId={conversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              className="h-full"
            />
          </SheetContent>
        </Sheet>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <ChatToolbar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            showSources={showSources}
            setShowSources={setShowSources}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            clearChat={clearChat}
            handleNewConversation={handleNewConversation}
            messagesLength={messages.length}
          />
          
          {/* Chat Container */}
          <ChatContainer 
            messages={messages}
            showSources={showSources}
            sources={sources}
            isLoading={isLoading}
            setInput={setInput}
          />
          
          {/* Input Area */}
          <ChatInput 
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default LegalAssistant;
