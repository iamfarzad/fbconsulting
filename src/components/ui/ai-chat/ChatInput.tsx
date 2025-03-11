
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { VoiceControls } from "./VoiceControls";
import { SendButton } from "./SendButton";
import { SuggestionButton } from "./SuggestionButton";
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
  placeholder = "Ask me anything about AI automation for your business...",
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
    aiProcessing,
    isTranscribing
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
    <div className="flex flex-col w-full">
      {/* Animated Transcription Display */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out bg-black/95 backdrop-blur-lg text-white rounded-2xl mb-2",
          isTranscribing ? "max-h-24 opacity-100 py-3 px-4 border border-white/20" : "max-h-0 opacity-0 py-0 px-0"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 transition-transform duration-500",
          isTranscribing ? "translate-y-0" : "-translate-y-full"
        )}>
          <div className="flex-shrink-0">
            <AnimatedBars isActive={isListening} small={false} />
          </div>
          <p className="text-sm font-medium animate-fade-in-up">
            {transcript || "Listening..."}
          </p>
        </div>
      </div>

      {/* Chat Input Box */}
      <div className={cn(
        "relative bg-white/95 backdrop-blur-lg border border-black/20 rounded-2xl transition-all duration-300",
        (showMessages || hasMessages) ? "shadow-lg" : ""
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
              "text-black/90 text-sm",
              "focus:outline-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-black/50 placeholder:text-sm",
              "min-h-[60px] rounded-2xl"
            )}
            style={{
              overflow: "hidden",
            }}
            disabled={isLoading || isListening}
          />
        </div>

        <div className="flex items-center justify-between p-3 border-t border-black/10">
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
    </div>
  );
}
