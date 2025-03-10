
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBars } from './ui/AnimatedBars';
import { Button } from './ui/button';

// Add TypeScript declarations for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface VoiceUIProps {
  onCommand?: (command: string) => void;
}

const VoiceUI: React.FC<VoiceUIProps> = ({ onCommand = () => {} }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithVoice') === 'true';
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setTranscript(transcript);
          
          // Process commands
          if (transcript.includes('show me your work') || transcript.includes('portfolio')) {
            onCommand('portfolio');
          } else if (transcript.includes('tell me more') || transcript.includes('about')) {
            onCommand('about');
          } else if (transcript.includes('contact') || transcript.includes('get in touch')) {
            onCommand('contact');
          } else if (transcript.includes('services')) {
            onCommand('services');
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onCommand]);
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.log('Speech recognition not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setShowTooltip(true);
      
      // If this is the first time interacting, expand the UI
      if (!hasInteracted) {
        setIsExpanded(true);
        setHasInteracted(true);
        localStorage.setItem('hasInteractedWithVoice', 'true');
      }
      
      setTimeout(() => setShowTooltip(false), 5000);
    }
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <>
      <motion.button 
        className={`voice-ui-btn ${isListening ? 'voice-ui-active' : ''} ${!isExpanded && 'animate-subtle-bounce'}`}
        onClick={isExpanded ? toggleListening : toggleExpanded}
        aria-label={isListening ? "Stop listening" : "Start voice commands"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isListening ? <Mic /> : <MicOff />}
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 p-4 bg-black border border-white/30 rounded-xl shadow-lg z-50 w-80"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium text-sm">Voice Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="h-7 w-7 rounded-full"
              >
                <X className="h-4 w-4 text-white/70" />
              </Button>
            </div>
            
            <div className="text-white/80 text-sm mb-4">
              <p>Say commands like "show me your work" or "tell me about your services"</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={toggleListening}
                className={`p-4 rounded-full ${isListening ? 'bg-teal/80' : 'bg-teal/50'} transition-colors`}
              >
                {isListening ? <Mic className="w-6 h-6 text-deep-purple" /> : <MicOff className="w-6 h-6 text-white" />}
              </button>
              
              {isListening && (
                <div className="voice-waveform flex justify-center items-end h-8">
                  <AnimatedBars isActive={isListening} />
                </div>
              )}
              
              {transcript && (
                <div className="p-3 bg-white/10 rounded-lg w-full">
                  <p className="text-white/90 text-sm">"{transcript}"</p>
                </div>
              )}
            </div>
          </motion.div>
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
