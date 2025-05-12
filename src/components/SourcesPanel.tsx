
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SourcesPanelProps {
  sources: Source[];
}

const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
  if (sources.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No sources available for this conversation.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-serif font-semibold mb-4">Legal Sources & References</h3>
      
      <div className="space-y-6">
        {sources.map((source, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <h4 className="font-serif font-medium text-gray-900 mb-2">{source.title}</h4>
            
            <p className="text-sm text-gray-700 mb-3">
              {source.snippet}
            </p>
            
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              View source <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          These sources are provided for reference only. Please consult with a qualified lawyer for legal advice specific to your situation.
        </p>
      </div>
    </div>
  );
};

export default SourcesPanel;
