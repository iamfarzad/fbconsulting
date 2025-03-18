
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConnectionTesterProps {
  apiKey: string;
  modelName: string;
  isLoading: boolean;
  hasSavedKey: boolean;
  onSave: () => void;
  onClear: () => void;
}

export const ConnectionTester: React.FC<ConnectionTesterProps> = ({
  apiKey,
  modelName,
  isLoading,
  hasSavedKey,
  onSave,
  onClear
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        onClick={onSave} 
        disabled={!apiKey || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : (
          hasSavedKey ? 'Update API Key' : 'Save Configuration'
        )}
      </Button>
      
      {hasSavedKey && (
        <Button 
          variant="outline" 
          onClick={onClear} 
          className="w-full"
        >
          Clear Configuration
        </Button>
      )}
    </div>
  );
};
