
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Mic, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { Button } from '@/components/ui/button';

interface HeroVoiceInputProps {
  chatInputValue: string;
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  isTranscribing: boolean;
  useGeminiApi: boolean;
  onInputChange?: (value: string) => void;
}

export const HeroVoiceInput: React.FC<HeroVoiceInputProps> = ({
  chatInputValue,
  isListening,
  transcript,
  toggleListening,
  isVoiceSupported,
  isTranscribing,
  useGeminiApi,
  onInputChange
}) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (onInputChange) {
      onInputChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Implement send logic here
    }
  };

  return (
    <>
      <AnimatePresence>
        {(isListening || isTranscribing) && (
          <motion.div 
            className={cn(
              "flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full",
              useGeminiApi 
                ? "bg-black/5 border border-[#fe5a1d]/20 dark:bg-white/5" 
                : "bg-black/5 dark:bg-white/5"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <AnimatedBars isActive={isListening} small={true} />
            <span className="text-sm">
              {isTranscribing 
                ? (useGeminiApi ? "Gemini is processing..." : "Processing...") 
                : transcript || (useGeminiApi ? "Listening with Gemini Charon..." : "Listening...")}
            </span>
            {useGeminiApi && <span className="text-xs text-[#fe5a1d] font-medium">Gemini Voice</span>}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="w-full relative bg-white rounded-xl overflow-hidden border shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4">
          <textarea
            ref={textareaRef}
            className="w-full border-0 focus:ring-0 outline-none resize-none min-h-[56px]"
            placeholder={chatInputValue || "Ask me anything about AI automation..."}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="border-t p-2 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload size={16} />
              <span>Upload File</span>
            </Button>
            <span className="text-sm text-muted-foreground ml-4">No files attached</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-sm border-dashed">
              <span className="flex items-center gap-1">
                <span className="text-xs">+</span> Suggestion
              </span>
            </Button>
            
            {isVoiceSupported && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full", 
                  isListening && "bg-[#fe5a1d] text-white"
                )}
                onClick={toggleListening}
                disabled={isTranscribing}
              >
                <Mic size={20} />
              </Button>
            )}
            
            <Button
              size="icon"
              className="rounded-full bg-black text-white"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
