
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, Eraser, Loader2, PlusIcon } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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

  return (
    <div className={cn(
      "relative bg-deep-purple border border-teal/30",
      (showMessages || hasMessages) ? "rounded-b-xl border-t-0" : "rounded-xl"
    )}>
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
            "text-white text-sm",
            "focus:outline-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-neon-white/50 placeholder:text-sm",
            "min-h-[60px]"
          )}
          style={{
            overflow: "hidden",
          }}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              type="button"
              className="group p-2 hover:bg-deep-purple/80 rounded-lg transition-colors flex items-center gap-1"
              onClick={onClear}
              disabled={isLoading}
            >
              <Eraser className="w-4 h-4 text-teal" />
              <span className="text-xs text-teal hidden group-hover:inline transition-opacity">
                Clear
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {suggestedResponse && (
            <button
              type="button"
              className="px-2 py-1 rounded-lg text-sm text-teal/80 transition-colors border border-dashed border-teal/30 hover:border-teal/60 hover:bg-deep-purple/80 flex items-center justify-between gap-1"
              onClick={handleSuggestionClick}
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4" />
              Suggestion
            </button>
          )}
          <button
            type="button"
            className={cn(
              "px-1.5 py-1.5 rounded-lg text-sm transition-colors border hover:border-teal flex items-center justify-between gap-1",
              value.trim() && !isLoading
                ? "bg-teal text-deep-purple border-teal"
                : "text-teal/80 border-teal/30",
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
                    ? "text-deep-purple"
                    : "text-teal/80"
                )}
              />
            )}
            <span className="sr-only">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
