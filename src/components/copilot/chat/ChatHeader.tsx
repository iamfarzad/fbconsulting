
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ChatHeaderProps {
  personaName: string;
  isLoading: boolean;
  messagesCount: number;
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  personaName, 
  isLoading, 
  messagesCount, 
  onClear 
}) => {
  return (
    <div className="px-4 py-3 border-b flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <h3 className="font-medium text-sm">
          {personaName}
          {isLoading && <span className="ml-2 text-muted-foreground">(Initializing...)</span>}
        </h3>
      </div>
      
      {messagesCount > 1 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-8 px-2 text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          <span className="text-xs">Clear</span>
        </Button>
      )}
    </div>
  );
};
