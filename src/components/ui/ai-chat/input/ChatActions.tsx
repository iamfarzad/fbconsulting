
import React from 'react';
import { Loader2, Send, Image, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatActionsProps {
  suggestedResponse: string | null;
  onSuggestionClick: () => void;
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  onClearChat: () => void;
  showMediaUpload: boolean;
  setShowMediaUpload: React.Dispatch<React.SetStateAction<boolean>>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasMessages: boolean;
  aiProcessing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  documentInputRef: React.RefObject<HTMLInputElement>;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  suggestedResponse,
  onSuggestionClick,
  onSend,
  hasContent,
  isLoading,
  isListening,
  toggleListening,
  isVoiceSupported,
  onClearChat,
  showMediaUpload,
  setShowMediaUpload,
  onImageUpload,
  onFileUpload,
  hasMessages,
  aiProcessing,
  fileInputRef,
  documentInputRef
}) => {
  const isProcessing = isLoading || aiProcessing;
  
  return (
    <div className="flex items-center justify-between p-2 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center space-x-2">
        {/* Media upload toggle */}
        <button
          type="button"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
          className={cn(
            "p-1.5 rounded-md text-xs transition-colors",
            showMediaUpload 
              ? "bg-black/10 dark:bg-white/10" 
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Upload media"
        >
          {showMediaUpload ? <X className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
        </button>
        
        {/* Voice input button */}
        {isVoiceSupported && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={isProcessing}
            className={cn(
              "p-1.5 rounded-md text-xs transition-colors",
              isListening 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <Loader2 className={cn(
              "w-3.5 h-3.5",
              isListening ? "animate-spin" : "hidden"
            )} />
          </button>
        )}
        
        {/* Clear chat button */}
        {hasMessages && (
          <button
            type="button"
            onClick={onClearChat}
            disabled={isProcessing || isListening}
            className="p-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Media upload area */}
      {showMediaUpload && (
        <div className="absolute bottom-full left-0 right-0 bg-background/95 dark:bg-background/95 backdrop-blur-sm p-2 rounded-t-md border border-b-0 border-black/10 dark:border-white/10 flex space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 p-1.5 rounded-md text-xs hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Image className="w-3.5 h-3.5" />
            <span>Image</span>
          </button>
          
          <button
            type="button"
            onClick={() => documentInputRef.current?.click()}
            className="flex items-center space-x-1 p-1.5 rounded-md text-xs hover:bg-black/5 dark:hover:bg-white/5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document</span>
          </button>
          
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          
          <input 
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </div>
      )}
      
      {/* Send button */}
      <button
        type="button"
        onClick={onSend}
        disabled={!hasContent || isProcessing || isListening}
        className={cn(
          "p-1.5 rounded-md text-xs transition-colors border flex items-center justify-center",
          hasContent && !isProcessing && !isListening
            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
            : "text-muted-foreground border-muted",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Send
            className={cn(
              "w-3.5 h-3.5",
              hasContent && !isProcessing && !isListening
                ? "text-white dark:text-black"
                : "text-muted-foreground"
            )}
          />
        )}
      </button>
    </div>
  );
};
