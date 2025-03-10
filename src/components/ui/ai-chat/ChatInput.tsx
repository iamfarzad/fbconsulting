
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
  
  const handleCommand = (command: string) => {
    // For now, just set the transcribed text as the input value
    setValue(command);
    adjustHeight();
  };
  
  const { isListening, transcript, toggleListening } = useSpeechRecognition(handleCommand);

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
            placeholder={placeholder}
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
            disabled={isLoading}
          />
        </div>
        
        {/* Transcription display */}
        {isListening && transcript && (
          <div className="px-4 py-2 text-xs text-black/70 italic">
            "{transcript}"
          </div>
        )}

        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                type="button"
                className="group p-2 hover:bg-black/10 rounded-lg transition-colors flex items-center gap-1"
                onClick={onClear}
                disabled={isLoading}
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
                disabled={isLoading}
              >
                <PlusIcon className="w-4 h-4" />
                Suggestion
              </button>
            )}
            
            {/* Voice button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? "bg-black text-white" 
                  : "text-black/70 hover:bg-black/10"
              }`}
              disabled={isLoading}
            >
              {isListening ? (
                <div className="flex items-center gap-1">
                  <MicOff className="w-4 h-4" />
                  <AnimatedBars isActive={true} small={true} />
                </div>
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
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={onSend}
              disabled={!value.trim() || isLoading}
            >
              {isLoading ? (
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
