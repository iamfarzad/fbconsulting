
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { VoiceControls } from "./VoiceControls";
import { SendButton } from "./SendButton";
import { SuggestionButton } from "./SuggestionButton";

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
  
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing
  } = useVoiceInput(setValue, onSend);

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
      "relative bg-white border border-black/70",
      (showMessages || hasMessages) ? "rounded-b-xl border-t-0" : "rounded-xl"
    )}>
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
            <SuggestionButton
              suggestion={suggestedResponse}
              onClick={handleSuggestionClick}
              disabled={isLoading || isListening}
            />
          )}
          
          <VoiceControls
            isListening={isListening}
            toggleListening={toggleListening}
            disabled={isLoading}
            aiProcessing={aiProcessing}
          />
          
          <SendButton
            hasContent={!!value.trim()}
            isLoading={isLoading}
            aiProcessing={aiProcessing}
            disabled={isListening}
            onClick={onSend}
          />
        </div>
      </div>
    </div>
  );
}
