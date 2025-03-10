
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, Loader2, Mic, MicOff, PlusIcon } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AnimatedBars } from "@/components/ui/AnimatedBars";

interface ChatInputProps {
  value: string;
  setValue: (value: string) => void;
  onSend: () => void;
  onClear: () => void;
  isLoading: boolean;
  showMessages: boolean;
  hasMessages: boolean;
  suggestedResponse: string | null;
  placeholder: string;
}

export function ChatInput({
  value,
  setValue,
  onSend,
  onClear,
  isLoading,
  showMessages,
  hasMessages,
  suggestedResponse,
  placeholder
}: ChatInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  
  const [aiProcessing, setAiProcessing] = useState(false);
  
  const handleCommand = async (command: string) => {
    setAiProcessing(true);
    try {
      // Set the transcribed text as input value
      setValue(command);
      adjustHeight();
      
      // Auto-send if we have a complete command
      if (command.trim()) {
        await onSend();
      }
    } finally {
      setAiProcessing(false);
    }
  };
  
  const { 
    isListening, 
    transcript, 
    toggleListening,
    voiceError 
  } = useSpeechRecognition(handleCommand);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent form submission
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleSuggestionClick = () => {
    if (suggestedResponse) {
      setValue(suggestedResponse);
      adjustHeight();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission which causes page jumps
    if (value.trim() && !isLoading) {
      onSend();
    }
  };

  return (
    <div className={cn(
      "relative bg-white border border-black/70",
      (showMessages || hasMessages) ? "rounded-b-xl border-t-0" : "rounded-xl"
    )}>
      <form onSubmit={handleSubmit}>
        <div className="overflow-y-auto">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : placeholder}
            className={cn(
              "w-full px-4 py-3",
              "resize-none",
              "bg-transparent",
              "border-none",
              "text-black text-sm",
              "focus:outline-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-black/50 placeholder:text-sm",
              "min-h-[60px]"
            )}
            style={{
              overflow: "hidden",
            }}
            disabled={isLoading || isListening}
          />
        </div>
        
        {/* Transcription display with error handling - Expanded when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black/5 overflow-hidden"
            >
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mic size={16} className="text-black/70" />
                  <p className="text-black/70 font-medium text-sm">Voice recognition active</p>
                </div>
                
                {transcript ? (
                  <p className="text-black/90 italic text-sm">"{transcript}"</p>
                ) : (
                  <p className="text-black/50 text-sm">Waiting for speech...</p>
                )}
                
                {voiceError && (
                  <p className="text-red-500 mt-2 text-xs">{voiceError}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                type="button"
                className="group p-2 hover:bg-black/10 rounded-lg transition-colors flex items-center gap-1"
                onClick={onClear}
                disabled={isLoading || isListening}
              >
                <Loader2 className="w-4 h-4 text-black" />
                <span className="text-xs text-black hidden group-hover:inline transition-opacity">
                  Clear
                </span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {suggestedResponse && (
              <button
                type="button"
                className="px-2 py-1 rounded-lg text-sm text-black/80 transition-colors border border-dashed border-black/30 hover:border-black/60 hover:bg-black/10 flex items-center justify-between gap-1"
                onClick={handleSuggestionClick}
                disabled={isLoading || isListening}
              >
                <PlusIcon className="w-4 h-4" />
                Suggestion
              </button>
            )}
            
            {/* Voice button with dynamic states */}
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "p-2 rounded-lg transition-colors flex items-center gap-1",
                isListening 
                  ? "bg-black text-white" 
                  : "text-black/70 hover:bg-black/10",
                aiProcessing && "opacity-50 cursor-wait"
              )}
              disabled={isLoading || aiProcessing}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <AnimatedBars isActive={true} small={true} />
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            
            {/* Send button */}
            <button
              type="button"
              className={cn(
                "px-1.5 py-1.5 rounded-lg text-sm transition-colors border hover:border-black flex items-center justify-between gap-1",
                value.trim() && !isLoading
                  ? "bg-black text-white border-black"
                  : "text-black/80 border-black/30",
                (isLoading || aiProcessing) && "opacity-50 cursor-not-allowed"
              )}
              onClick={onSend}
              disabled={!value.trim() || isLoading || isListening || aiProcessing}
            >
              {isLoading || aiProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpIcon
                  className={cn(
                    "w-4 h-4",
                    value.trim() && !isLoading
                      ? "text-white"
                      : "text-black/80"
                  )}
                />
              )}
              <span className="sr-only">Send</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
