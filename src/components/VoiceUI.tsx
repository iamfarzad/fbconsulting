
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBars } from './ui/AnimatedBars';
import { VoiceButton } from './voice/VoiceButton';
import { VoicePanel } from './voice/VoicePanel';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { VoiceUIProps } from '@/types/voice';

const VoiceUI: React.FC<VoiceUIProps> = ({ onCommand = () => {} }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithVoice') === 'true';
  });

  const { isListening, transcript, toggleListening } = useSpeechRecognition(onCommand);
  
  const handleToggleListening = () => {
    toggleListening();
    setShowTooltip(true);
    
    if (!hasInteracted) {
      setIsExpanded(true);
      setHasInteracted(true);
      localStorage.setItem('hasInteractedWithVoice', 'true');
    }
    
    setTimeout(() => setShowTooltip(false), 5000);
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <>
      <VoiceButton 
        isListening={isListening}
        onClick={isExpanded ? handleToggleListening : toggleExpanded}
        isExpanded={isExpanded}
      />
      
      <AnimatePresence>
        {isExpanded && (
          <VoicePanel
            isListening={isListening}
            transcript={transcript}
            onClose={toggleExpanded}
            onToggleListening={handleToggleListening}
          />
        )}
      </AnimatePresence>
      
      {showTooltip && !isExpanded && (
        <div className="fixed bottom-20 right-6 p-3 bg-deep-purple text-neon-white rounded-lg shadow-lg z-50 max-w-xs">
          <p className="text-sm mb-2">Hey, I'm your guide—say "show me your work" or "tell me more"!</p>
          {isListening && (
            <div className="voice-waveform flex justify-center items-end h-5">
              <AnimatedBars isActive={isListening} small={true} />
            </div>
          )}
        </div>
      )}
      
      {transcript && isListening && !isExpanded && (
        <div className="fixed bottom-24 right-24 p-2 bg-white/90 text-deep-purple rounded shadow-md">
          "{transcript}"
        </div>
      )}
    </>
  );
};

export default VoiceUI;
