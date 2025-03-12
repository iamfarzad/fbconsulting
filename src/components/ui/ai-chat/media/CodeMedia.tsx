
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeMediaProps {
  content: string;
  language?: string;
  className?: string;
}

export const CodeMedia = ({ content, language, className }: CodeMediaProps) => {
  return (
    <pre className={cn("bg-muted p-4 rounded-lg my-2 overflow-x-auto", className)}>
      <code className={language || ''}>
        {content}
      </code>
    </pre>
  );
};
