
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

interface TranscriptDisplayProps {
  isListening: boolean;
  transcript: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  isListening, 
  transcript 
}) => {
  if (!isListening || !transcript) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="py-2 px-4 mb-2 bg-primary/10 rounded-lg flex items-start gap-2"
      >
        <Mic className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
        <div className="text-sm text-foreground">
          <p className="font-medium mb-0.5">Listening...</p>
          <p className="text-muted-foreground">{transcript}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
