
import React from 'react';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeMediaProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeMedia: React.FC<CodeMediaProps> = ({ 
  code, 
  language = 'javascript', 
  className 
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-xs font-mono">
        <span>{language}</span>
        <button 
          onClick={copyToClipboard} 
          className="flex items-center gap-1 hover:text-primary"
        >
          <Copy size={14} />
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  );
};

export default CodeMedia;
