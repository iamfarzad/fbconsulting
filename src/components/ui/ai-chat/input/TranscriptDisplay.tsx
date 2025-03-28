
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptDisplayProps {
  isListening: boolean;
  transcript: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  isListening, 
  transcript 
}) => {
  return (
    <AnimatePresence>
      {isListening && transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-2 p-3 bg-muted/50 rounded-lg text-sm"
        >
          <p className="text-xs text-muted-foreground mb-1">Listening...</p>
          <p>"{transcript}"</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranscriptDisplay;
