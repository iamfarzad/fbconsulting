
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eraser, Loader2, PlusIcon } from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { trackEvent } from "@/services/analyticsService";

interface AnimatedChatInputProps {
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

export function AnimatedChatInput({
  value,
  setValue,
  onSend,
  onClear,
  isLoading,
  showMessages,
  hasMessages,
  suggestedResponse,
  placeholder
}: AnimatedChatInputProps) {
  // Create an array of AI-related placeholders
  const placeholders = [
    placeholder,
    "Ask about AI chatbots for your business...",
    "How can AI help automate my workflow?",
    "What AI solutions can improve my customer service?",
    "Ask about AI-driven analytics for your data..."
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSuggestionClick = () => {
    if (suggestedResponse) {
      setValue(suggestedResponse);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend();
      
      // Track chat submission
      trackEvent({
        action: 'animated_chat_submit',
        category: 'chatbot',
        label: 'message_sent',
      });
    }
  };

  return (
    <div className={cn(
      "relative bg-black border border-white/30",
      (showMessages || hasMessages) ? "rounded-b-xl border-t-0" : "rounded-xl"
    )}>
      <div className="py-2 px-2">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              type="button"
              className="group p-2 hover:bg-black/80 rounded-lg transition-colors flex items-center gap-1"
              onClick={onClear}
              disabled={isLoading}
            >
              <Eraser className="w-4 h-4 text-white" />
              <span className="text-xs text-white hidden group-hover:inline transition-opacity">
                Clear
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {suggestedResponse && (
            <button
              type="button"
              className="px-2 py-1 rounded-lg text-sm text-white/80 transition-colors border border-dashed border-white/30 hover:border-white/60 hover:bg-black/80 flex items-center justify-between gap-1"
              onClick={handleSuggestionClick}
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4" />
              Suggestion
            </button>
          )}
          {isLoading && (
            <div className="px-3 py-1">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
