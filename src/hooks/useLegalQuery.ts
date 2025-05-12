
import { useState } from 'react';
import { toast } from 'sonner';
import { legalService } from '../services/legalService';

/**
 * Custom hook for sending legal queries to the backend
 */
export function useLegalQuery() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendQuery = async (query: string, model: string) => {
    setIsLoading(true);
    setProgress(10);
    
    try {
      // Start progress animation
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5;
          return Math.min(prev + increment, 90);
        });
      }, 300);
      
      // Make the actual API call
      const response = await legalService.sendQuery({
        query,
        model
      });
      
      clearInterval(interval);
      setProgress(100);
      
      // Allow the progress bar to complete animation
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
      
      return response;
    } catch (error: any) {
      setIsLoading(false);
      setProgress(0);
      toast.error(error.message || 'Failed to get a response. Please try again.');
      throw error;
    }
  };
  
  return {
    isLoading,
    progress,
    sendQuery
  };
}
