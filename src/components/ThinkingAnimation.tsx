
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ThinkingAnimationProps {
  className?: string;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ className }) => {
  const [thoughts, setThoughts] = useState<string[]>([]);
  const thoughtSteps = [
    "Analyzing query...",
    "Retrieving relevant cases...",
    "Processing legal precedents...",
    "Formulating legal opinion..."
  ];

  useEffect(() => {
    const showThoughts = async () => {
      for (let i = 0; i < thoughtSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setThoughts(prev => [...prev, thoughtSteps[i]]);
      }
    };
    
    showThoughts();
    
    return () => setThoughts([]);
  }, []);

  return (
    <div className={cn("flex flex-col space-y-3 w-full max-w-md p-4", className)}>
      <div className="inline-block mb-3">
        <div className="flex space-x-1.5">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={cn(
                "h-2.5 w-2.5 rounded-full bg-primary animate-pulse",
                dot === 0 && "animation-delay-0",
                dot === 1 && "animation-delay-150",
                dot === 2 && "animation-delay-300"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        {thoughts.map((thought, index) => (
          <div 
            key={index} 
            className="text-sm text-muted-foreground animate-fade-in flex items-center bg-accent/30 p-2 pl-3 pr-4 rounded-xl"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2.5"></div>
            {thought}
          </div>
        ))}
        
        {thoughts.length < thoughtSteps.length && (
          <Skeleton className="h-5 w-40 mt-1 opacity-40" />
        )}
      </div>
    </div>
  );
};

export default ThinkingAnimation;
