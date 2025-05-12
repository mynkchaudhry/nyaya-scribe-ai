
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, RefreshCw, Trash2, Scale, MenuIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import ModelSelector from '@/components/ModelSelector';
import ChatHistory from '@/components/ChatHistory';
import ThinkingAnimation from '@/components/ThinkingAnimation';
import SplashScreen from '@/components/SplashScreen';
import { useLegalQuery } from '@/hooks/useLegalQuery';
import { DEFAULT_MODEL, ModelType } from '@/config/api';
import { Source, ResponseMetadata } from '@/services/legalService';

// Types
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  metadata?: ResponseMetadata;
  thinking?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

const LegalAssistant = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    isLoading, 
    progress, 
    sources,
    metadata,
    streamQuery 
  } = useLegalQuery();

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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

  const exampleQuestions = [
    "What are my rights if I'm arrested?",
    "Explain the process for filing a consumer complaint",
    "What are the grounds for divorce in India?",
    "Explain Right to Education Act provisions"
  ];

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
                disabled={messages.length === 0}
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
          
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
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
              ) : (
                <div className="pb-20">
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Sources Panel (Conditional) */}
            {showSources && (
              <div className="w-80 border-l overflow-y-auto animate-slide-in-right">
                <SourcesPanel sources={sources} />
              </div>
            )}
          </div>
          
          {/* Input Area */}
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
        </div>
      </div>
    </div>
  );
};

export default LegalAssistant;
