
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, RefreshCw, Trash2, Scale, MenuIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import ModelSelector from '@/components/ModelSelector';
import ChatHistory from '@/components/ChatHistory';
import ThinkingAnimation from '@/components/ThinkingAnimation';

// Types
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

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

const LegalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Rights during arrest',
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Consumer complaint procedure',
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Grounds for divorce',
      updatedAt: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Example sources that would come from the API
  const sampleSources: Source[] = [
    {
      title: "Supreme Court Judgment: State of Punjab v. Davinder Singh (2020)",
      url: "https://indiankanoon.org/doc/123456789/",
      snippet: "...the Court held that the State Government is empowered to make provisions for reservation in promotion in the services under the State in favor of the Scheduled Castes and Scheduled Tribes..."
    },
    {
      title: "Constitution of India, Article 15",
      url: "https://legislative.gov.in/constitution-of-india/",
      snippet: "Article 15 prohibits discrimination on grounds of religion, race, caste, sex or place of birth. However, it allows the state to make special provisions for women, children..."
    },
  ];

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const thinkingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      thinking: true,
    };

    setMessages(prevMessages => [...prevMessages, userMessage, thinkingMessage]);
    setInput('');
    setIsLoading(true);

    // In a real implementation, this would be an API call to your backend
    try {
      // Mock API response time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove the thinking message and add the real response
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages.pop(); // Remove thinking message
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: "Based on the Supreme Court's judgment in State of Punjab v. Davinder Singh (2020), the State Government is empowered to make provisions for reservation in promotion in the services under the State in favor of Scheduled Castes and Scheduled Tribes.\n\nArticle 15 of the Constitution prohibits discrimination on grounds of religion, race, caste, sex, or place of birth. However, it allows the state to make special provisions for women, children, and socially and educationally backward classes of citizens, including Scheduled Castes and Scheduled Tribes.\n\nIn the case of M. Nagaraj v. Union of India (2006), the Supreme Court upheld the constitutional validity of reservation in promotion, subject to the State proving backwardness, inadequacy of representation, and maintenance of efficiency.\n\nBased on these precedents, a government policy implementing reservation in promotions would be constitutional if it satisfies these three criteria established by the Supreme Court.\n\nIs there any specific aspect of reservation policy you would like me to elaborate on?",
          timestamp: new Date(),
          sources: sampleSources,
          metadata: {
            model: selectedModel,
            processingTime: 1.24,
            tokens: 312
          }
        };
        
        return [...newMessages, assistantMessage];
      });
      
      // Create a conversation if it's a new one
      if (!conversationId) {
        const newConversationId = `${conversations.length + 1}`;
        const newConversation = {
          id: newConversationId,
          title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
          updatedAt: new Date()
        };
        
        setConversations(prev => [...prev, newConversation]);
        setConversationId(newConversationId);
      }
      
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error(error);
      
      // Remove the thinking message if there's an error
      setMessages(prevMessages => prevMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar - Hidden on mobile */}
        <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
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
          <SheetContent side="left" className="w-64 p-0">
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
          <div className="flex items-center justify-between p-2 border-b">
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
                className="text-xs"
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
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewConversation}
                title="New conversation"
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
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">Welcome to NyayaGPT</h3>
                  <p className="text-muted-foreground max-w-lg mb-6">
                    Your AI legal assistant trained on Indian law, including Supreme Court and High Court judgments, statutes, and legal procedures.
                  </p>
                  <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                    {exampleQuestions.map((example, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="flex justify-start py-3 px-4 h-auto text-left"
                        onClick={() => setInput(example)}
                      >
                        <span className="truncate">{example}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Sources Panel (Conditional) */}
            {showSources && (
              <div className="w-80 border-l overflow-y-auto">
                <SourcesPanel sources={sampleSources} />
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit}>
              <div className="relative rounded-lg border bg-background">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a legal question..."
                  className="resize-none pr-12 max-h-32 overflow-y-auto min-h-[56px] border-none focus-visible:ring-0"
                  disabled={isLoading}
                  rows={1}
                />
                <div className="absolute right-3 bottom-3">
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full h-8 w-8"
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
