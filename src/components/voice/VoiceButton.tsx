
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedBars } from '../ui/AnimatedBars';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  isExpanded: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ isListening, onClick, isExpanded }) => {
  return (
    <motion.button 
      className={`voice-ui-btn ${isListening ? 'voice-ui-active' : ''} ${!isExpanded && 'animate-subtle-bounce'}`}
      onClick={onClick}
      aria-label={isListening ? "Stop listening" : "Start voice commands"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isListening ? <Mic /> : <MicOff />}
    </motion.button>
  );
};
