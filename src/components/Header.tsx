
import React from 'react';
import { Scale, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="container max-w-full mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="bg-primary rounded-full p-1.5 shadow-sm">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="ml-2 text-xl font-serif font-semibold text-foreground">NyayaGPT</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
