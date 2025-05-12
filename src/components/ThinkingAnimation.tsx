
import React from 'react';
import { cn } from '@/lib/utils';

interface ThinkingAnimationProps {
  className?: string;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ className }) => {
  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <div className="inline-block">
        <div className="flex space-x-1">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={cn(
                "h-2 w-2 rounded-full bg-primary animate-pulse",
                dot === 0 && "animation-delay-0",
                dot === 1 && "animation-delay-150",
                dot === 2 && "animation-delay-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
