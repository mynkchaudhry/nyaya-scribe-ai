
import React from 'react';
import { Scale, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border/50 bg-background/90 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
      <div className="container max-w-full mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="ml-3 text-xl font-serif font-semibold text-foreground tracking-tight">NyayaGPT</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover-glow"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-all" />
            ) : (
              <Moon className="h-5 w-5 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
