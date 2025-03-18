
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatInput } from '@/components/ui/ai-chat';
import { cn } from '@/lib/utils';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { VoiceControls } from '@/components/ui/ai-chat/VoiceControls';

interface HeroVoiceInputProps {
  chatInputValue: string;
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  isTranscribing: boolean;
  useGeminiApi: boolean;
}

export const HeroVoiceInput: React.FC<HeroVoiceInputProps> = ({
  chatInputValue,
  isListening,
  transcript,
  toggleListening,
  isVoiceSupported,
  isTranscribing,
  useGeminiApi
}) => {
  return (
    <>
      <AnimatePresence>
        {(isListening || isTranscribing) && (
          <motion.div 
            className={cn(
              "flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full",
              "bg-black/5 dark:bg-white/5 border border-white/10 dark:border-black/20"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <AnimatedBars isActive={isListening} small={true} />
            <span className="text-sm">
              {isTranscribing 
                ? (useGeminiApi ? "Gemini is processing..." : "Processing...") 
                : transcript || "Listening..."}
            </span>
            {useGeminiApi && <span className="text-xs font-medium">Gemini Voice</span>}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="w-full relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <AIChatInput 
          autoFullScreen={false} 
          placeholderText={chatInputValue || "Ask me anything about AI automation..."}
        />
        
        {isVoiceSupported && (
          <div className="absolute right-2 -bottom-14 flex items-center gap-2">
            <VoiceControls
              isListening={isListening}
              toggleListening={toggleListening}
              disabled={false}
              aiProcessing={isTranscribing}
            />
          </div>
        )}
      </motion.div>
    </>
  );
};
