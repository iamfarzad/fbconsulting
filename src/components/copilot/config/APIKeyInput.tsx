
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface APIKeyInputProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  hasSavedKey: boolean;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({
  apiKey,
  setApiKey,
  hasSavedKey
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="apiKey">Gemini API Key</Label>
        {hasSavedKey && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <Check className="h-3 w-3" /> Key saved
          </span>
        )}
      </div>
      <Input
        id="apiKey"
        type="password" 
        value={apiKey} 
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Gemini API key"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Get your API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
      </p>
    </div>
  );
};
