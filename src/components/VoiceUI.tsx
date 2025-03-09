
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceUIProps {
  onCommand?: (command: string) => void;
}

const VoiceUI: React.FC<VoiceUIProps> = ({ onCommand = () => {} }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
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
      setTimeout(() => setShowTooltip(false), 5000);
    }
  };
  
  return (
    <>
      <button 
        className={`voice-ui-btn ${isListening ? 'voice-ui-active' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? "Stop listening" : "Start voice commands"}
      >
        {isListening ? <Mic /> : <MicOff />}
      </button>
      
      {showTooltip && (
        <div className="fixed bottom-20 right-6 p-3 bg-deep-purple text-neon-white rounded-lg shadow-lg z-50 max-w-xs">
          <p className="text-sm mb-2">Hey, I'm your guide—say "show me your work" or "tell me more"!</p>
          {isListening && (
            <div className="voice-waveform flex justify-center items-end h-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <span 
                  key={i} 
                  className="waveform-bar" 
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    height: `${Math.random() * 16 + 4}px` 
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {transcript && isListening && (
        <div className="fixed bottom-24 right-24 p-2 bg-white/90 text-deep-purple rounded shadow-md">
          "{transcript}"
        </div>
      )}
    </>
  );
};

export default VoiceUI;
