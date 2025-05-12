
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const models = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast, good for most queries',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Better accuracy, moderate speed',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most accurate, slower response time',
  },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, setSelectedModel }) => {
  const selectedModelData = models.find(model => model.id === selectedModel) || models[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 px-3 py-2 w-[180px] justify-between">
          <span className="truncate">{selectedModelData.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]">
        {models.map(model => (
          <DropdownMenuItem
            key={model.id}
            className="flex items-start gap-2 py-2 px-3 cursor-pointer"
            onClick={() => setSelectedModel(model.id)}
          >
            <div className={`mt-0.5 ${selectedModel === model.id ? 'text-primary' : 'text-transparent'}`}>
              <Check className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{model.name}</div>
              <div className="text-xs text-muted-foreground">{model.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelector;
