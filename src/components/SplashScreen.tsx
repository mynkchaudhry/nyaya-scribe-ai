
import React, { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showLegalTerms, setShowLegalTerms] = useState(false);
  
  useEffect(() => {
    // Start animation sequence
    const timer1 = setTimeout(() => {
      setProgress(30);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setProgress(60);
      setShowLegalTerms(true);
    }, 1200);
    
    const timer3 = setTimeout(() => {
      setProgress(90);
    }, 1800);
    
    const timer4 = setTimeout(() => {
      setProgress(100);
    }, 2200);
    
    const timer5 = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    
    // Clean up timers
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500">
      <div className="flex flex-col items-center max-w-md text-center px-6">
        <div className="relative">
          <Scale className="h-20 w-20 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-70 animate-pulse" />
        </div>
        
        <h1 className="mt-8 text-4xl font-serif font-bold tracking-tight">NyayaGPT</h1>
        <p className="mt-2 text-xl text-muted-foreground">Your AI legal assistant</p>
        
        <div className="w-full mt-10">
          <Progress value={progress} className="h-1.5" />
        </div>
        
        <div 
          className={cn(
            "mt-6 text-sm text-muted-foreground max-w-md transition-opacity duration-500",
            showLegalTerms ? "opacity-100" : "opacity-0"
          )}
        >
          <p>Accessing legal information from Supreme Court and High Court judgments, Indian statutes, procedural codes, and legal drafting conventions.</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
