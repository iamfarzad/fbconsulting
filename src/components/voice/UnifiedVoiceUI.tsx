
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBars } from '../ui/AnimatedBars';
import { VoiceControls } from '../ui/ai-chat/VoiceControls';
import { VoicePanel } from './VoicePanel';
import { DemoVoiceControls } from './DemoVoiceControls';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { UnifiedVoiceUIProps } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

export const UnifiedVoiceUI: React.FC<UnifiedVoiceUIProps> = ({ 
  onCommand, 
  noFloatingButton = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithVoice') === 'true';
  });
  const [aiResponse, setAIResponse] = useState('');

  const { toast } = useToast();
  const commandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleCommand = async (command: string) => {
    console.log('Received voice command:', command);
    if (isProcessing) {
      console.log('Already processing a command, ignoring');
      return;
    }

    if (!hasInteracted) {
      localStorage.setItem('hasInteractedWithVoice', 'true');
      setHasInteracted(true);
    }

    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
    }

    try {
      if (command.trim()) {
        setIsProcessing(true);
        
        commandTimeoutRef.current = setTimeout(() => {
          if (isProcessing) {
            setIsProcessing(false);
            toast({
              title: "Processing Timed Out",
              description: "Command took too long to process. Please try again.",
              variant: "destructive"
            });
          }
        }, 30000);

        // Generate a mock response
        setTimeout(() => {
          setAIResponse(`I heard: "${command}"`);
          setIsProcessing(false);
        }, 1500);
        
        // Call original onCommand if provided
        if (onCommand) {
          await onCommand(command);
        }
      } else {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking again.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      toast({
        title: "Command Error",
        description: error instanceof Error ? error.message : "Failed to process voice command",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    }
  };

  const { isListening, transcript, toggleListening, voiceError } = useSpeechRecognition(handleCommand);
  
  // Show error toast if there's a voice error
  useEffect(() => {
    if (voiceError) {
      console.error("Voice recognition error:", voiceError);
      toast({
        title: "Voice Recognition Error",
        description: voiceError,
        variant: "destructive"
      });
    }
  }, [voiceError, toast]);
  
  const handleToggleListening = async () => {
    if (isProcessing) return;
    await toggleListening();
    setShowTooltip(true);
    
    if (!hasInteracted) {
      setIsExpanded(true);
      setHasInteracted(true);
      localStorage.setItem('hasInteractedWithVoice', 'true');
    }
    
    const tooltipTimeout = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(tooltipTimeout);
  };
  
  // Cleanup effect for any remaining timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    };
  }, []);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <>
      {!noFloatingButton && (
        <div className="fixed bottom-4 right-4 z-50">
          <VoiceControls 
            isListening={isListening}
            toggleListening={isExpanded ? handleToggleListening : toggleExpanded}
            disabled={isProcessing}
            aiProcessing={isProcessing}
          />
        </div>
      )}
      
      {noFloatingButton && (
        <div className="flex justify-center">
          <DemoVoiceControls 
            isListening={isListening}
            toggleListening={handleToggleListening}
            disabled={isProcessing}
            aiProcessing={isProcessing}
          />
        </div>
      )}
      
      <AnimatePresence>
        {isExpanded && (
          <VoicePanel
            isListening={isListening}
            transcript={transcript}
            onClose={toggleExpanded}
            onToggleListening={handleToggleListening}
            aiResponse={aiResponse}
          />
        )}
      </AnimatePresence>
      
      {showTooltip && !isExpanded && (
        <div className="fixed bottom-20 right-6 p-3 bg-black text-white rounded-lg shadow-lg z-50 max-w-xs">
          <p className="text-sm mb-2">Hey, I'm your voice assistant—say something to try it out!</p>
          {isListening && (
            <div className="voice-waveform flex justify-center items-end h-5">
              <AnimatedBars isActive={isListening} small={true} />
            </div>
          )}
        </div>
      )}
      
      {transcript && isListening && !isExpanded && (
        <div className="fixed bottom-24 right-24 p-2 bg-white/90 text-black rounded shadow-md">
          "{transcript}"
        </div>
      )}
    </>
  );
};

export default UnifiedVoiceUI;
