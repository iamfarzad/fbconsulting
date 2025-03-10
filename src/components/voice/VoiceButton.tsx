
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  isExpanded: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ isListening, onClick, isExpanded }) => {
  return (
    <motion.button 
      className={`p-3 rounded-full ${isListening ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} transition-colors ${!isExpanded && 'animate-subtle-bounce'}`}
      onClick={onClick}
      aria-label={isListening ? "Stop listening" : "Start voice commands"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
    </motion.button>
  );
};
