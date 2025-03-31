
import React from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '../ui/AnimatedBars';
import { cn } from '@/lib/utils';

interface VoicePanelProps {
  isListening: boolean;
  transcript?: string;
  aiResponse?: string;
  onClose: () => void;
  onToggleListening: () => void;
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  isListening,
  transcript,
  aiResponse,
  onClose,
  onToggleListening
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 right-4 md:right-6 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-80 z-50 border border-black/10 dark:border-white/10"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-sm">Voice Assistant</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-3 mb-4 min-h-20 max-h-40 overflow-y-auto">
        {transcript ? (
          <p className="text-sm">{transcript}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {isListening ? "Listening..." : "Press the mic button and speak"}
          </p>
        )}
      </div>
      
      {aiResponse && (
        <div className="bg-primary/10 rounded-lg p-3 mb-4 text-sm">
          <p>{aiResponse}</p>
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={onToggleListening}
          className={cn(
            "rounded-full w-12 h-12 flex items-center justify-center transition-colors",
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-primary/90 hover:bg-primary text-white"
          )}
        >
          {isListening ? (
            <AnimatedBars isActive={true} small={true} className="h-6" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          <span className="sr-only">
            {isListening ? "Stop listening" : "Start listening"}
          </span>
        </button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        {isListening 
          ? "Tap to stop" 
          : "Tap and speak your command"}
      </p>
    </motion.div>
  );
};

export default VoicePanel;
