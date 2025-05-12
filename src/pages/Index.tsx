
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, RefreshCw, Trash2, BookOpen, Scale, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import ModelSelector from '@/components/ModelSelector';

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
}

interface Source {
  title: string;
  url: string;
  snippet: string;
}

const LegalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [conversationId, setConversationId] = useState<string | null>(null);
  
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

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    // In a real implementation, this would be an API call to your backend
    try {
      // Mock API response time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error(error);
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
    toast.success("Chat cleared");
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col container max-w-6xl mx-auto px-4 pt-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">NyayaGPT</h1>
            <p className="text-gray-600 mt-1">Your AI Legal Assistant for Indian Law</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ModelSelector 
              selectedModel={selectedModel} 
              setSelectedModel={setSelectedModel} 
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={clearChat} className="cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" /> Clear conversation
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <RefreshCw className="h-4 w-4 mr-2" /> New conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="bg-white rounded-t-lg border border-gray-200 p-1">
            <TabsList className="w-full bg-transparent grid grid-cols-2">
              <TabsTrigger value="chat" className="rounded">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Chat</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="sources" className="rounded">
                <div className="flex items-center">
                  <Scale className="h-4 w-4 mr-2" />
                  <span>Sources & Context</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col mt-0 bg-white border-x border-b border-gray-200 rounded-b-lg shadow-sm">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6">
                  <Scale className="h-12 w-12 mx-auto text-blue-600" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">Welcome to NyayaGPT</h3>
                <p className="text-gray-600 max-w-lg mb-6">
                  Your AI legal assistant trained on Indian law, including Supreme Court and High Court judgments, statutes, and legal procedures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {[
                    "What are my rights if I'm arrested?",
                    "Explain the process for filing a consumer complaint",
                    "What are the grounds for divorce in India?",
                    "Explain Right to Education Act provisions"
                  ].map((example, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setInput(example)}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm">{example}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-6">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4 animate-pulse mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Scale className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            <Separator />
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a legal question..."
                  className="resize-none pr-12 max-h-32 overflow-y-auto"
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 bottom-2"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                NyayaGPT provides general legal information, not legal advice. Always consult a qualified lawyer for specific legal matters.
              </p>
            </form>
          </TabsContent>

          <TabsContent value="sources" className="flex-1 mt-0 bg-white border-x border-b border-gray-200 rounded-b-lg shadow-sm overflow-y-auto">
            <SourcesPanel sources={sampleSources} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LegalAssistant;
