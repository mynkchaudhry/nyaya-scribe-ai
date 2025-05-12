
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { legalService, LegalQueryRequest, StreamChunk, Source, ResponseMetadata } from '../services/legalService';

interface UseLegalQueryResult {
  isLoading: boolean;
  progress: number;
  sources: Source[];
  metadata: ResponseMetadata | null;
  sendQuery: (query: string, model: string, conversationId?: string) => Promise<string>;
  streamQuery: (
    query: string, 
    model: string, 
    conversationId?: string, 
    onChunk?: (chunk: string, full: string) => void,
    onComplete?: (sources: Source[], metadata: ResponseMetadata) => void
  ) => () => void;
}

/**
 * Custom hook for sending legal queries to the backend
 */
export function useLegalQuery(): UseLegalQueryResult {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sources, setSources] = useState<Source[]>([]);
  const [metadata, setMetadata] = useState<ResponseMetadata | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Clean up event source on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Update progress during loading states
  const startProgressAnimation = useCallback(() => {
    setProgress(10);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5;
        return Math.min(prev + increment, 90);
      });
    }, 300);
    
    return interval;
  }, []);

  // Complete the progress animation
  const completeProgressAnimation = useCallback(() => {
    setProgress(100);
    
    // Allow the progress bar to complete animation
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  }, []);

  // Create request object
  const createQueryRequest = useCallback((query: string, model: string, conversationId?: string, streaming: boolean = false): LegalQueryRequest => {
    return {
      query,
      model_name: model as any,
      conversation_id: conversationId,
      stream: streaming
    };
  }, []);

  // Handle error cases
  const handleQueryError = useCallback((error: any) => {
    setIsLoading(false);
    setProgress(0);
    toast.error(error.message || 'Failed to get a response. Please try again.');
  }, []);

  // Regular query function (non-streaming)
  const sendQuery = useCallback(async (query: string, model: string, conversationId?: string): Promise<string> => {
    setIsLoading(true);
    const progressInterval = startProgressAnimation();
    
    try {
      // Make the actual API call
      const request = createQueryRequest(query, model, conversationId, false);
      const response = await legalService.sendQuery(request);
      
      clearInterval(progressInterval);
      completeProgressAnimation();
      
      // Set sources and metadata
      setSources(response.context_sources || []);
      setMetadata(response.metadata);
      
      return response.response;
    } catch (error: any) {
      clearInterval(progressInterval);
      handleQueryError(error);
      throw error;
    }
  }, [startProgressAnimation, completeProgressAnimation, createQueryRequest, handleQueryError]);
  
  // Handle streaming message events
  const handleStreamEvent = useCallback((
    event: MessageEvent, 
    eventSource: EventSource, 
    progressInterval: number,
    onChunk?: (chunk: string, full: string) => void,
    onComplete?: (sources: Source[], metadata: ResponseMetadata) => void
  ) => {
    try {
      const data: StreamChunk = JSON.parse(event.data);
      
      // Check for error
      if (data.error) {
        toast.error(data.error);
        clearInterval(progressInterval);
        setIsLoading(false);
        setProgress(0);
        eventSource.close();
        return;
      }
      
      // If this is the completion message
      if (data.done) {
        clearInterval(progressInterval);
        completeProgressAnimation();
        
        // Set sources and metadata
        if (data.metadata) {
          setMetadata(data.metadata);
        }
        
        if (data.context_sources) {
          setSources(data.context_sources);
          
          // Call completion callback
          if (onComplete && data.metadata) {
            onComplete(data.context_sources, data.metadata);
          }
        }
        
        eventSource.close();
        return;
      }
      
      // Handle normal chunk
      if (data.chunk && data.full && onChunk) {
        onChunk(data.chunk, data.full);
      }
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  }, [completeProgressAnimation]);
  
  // Streaming query function
  const streamQuery = useCallback((
    query: string, 
    model: string, 
    conversationId?: string,
    onChunk?: (chunk: string, full: string) => void,
    onComplete?: (sources: Source[], metadata: ResponseMetadata) => void
  ) => {
    setIsLoading(true);
    const progressInterval = startProgressAnimation();
    
    // Create request
    const request = createQueryRequest(query, model, conversationId, true);
    
    // Clean up previous event source
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    // Create new event source for streaming
    try {
      const eventSource = legalService.createEventSource(request);
      eventSourceRef.current = eventSource;
      
      // Handle messages
      eventSource.onmessage = (event) => {
        handleStreamEvent(event, eventSource, progressInterval, onChunk, onComplete);
      };
      
      // Handle connection errors
      eventSource.onerror = () => {
        toast.error('Connection error. Please try again.');
        clearInterval(progressInterval);
        setIsLoading(false);
        setProgress(0);
        eventSource.close();
      };
    } catch (error) {
      console.error('Error creating EventSource:', error);
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
      toast.error('Failed to establish streaming connection');
    }
    
    // Return a cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
    };
  }, [startProgressAnimation, createQueryRequest, handleStreamEvent]);
  
  return {
    isLoading,
    progress,
    sources,
    metadata,
    sendQuery,
    streamQuery
  };
}
