import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBars } from './ui/AnimatedBars';
import { VoiceControls } from './ui/ai-chat/VoiceControls';
import { VoicePanel } from './voice/VoicePanel';
import { DemoVoiceControls } from './voice/DemoVoiceControls';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { VoiceUIProps } from '@/types/voice';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { useMessage } from '@/contexts/MessageContext';

const VoiceUI: React.FC<VoiceUIProps> = ({ onCommand, noFloatingButton = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithVoice') === 'true';
  });

  const { toast } = useToast();
  const commandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setMessage, audioEnabled } = useMessage();
  const { sendMessage, messages, isProcessing: isProcessingMessage, error } = useGemini();
  
  // Handle Gemini errors
  useEffect(() => {
    if (error) {
      toast({
        title: "AI Service Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Watch for new AI messages and update audio playback
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && audioEnabled) {
      setMessage(lastMessage.content);
    }
  }, [messages, audioEnabled, setMessage]);

  const handleCommand = async (command: string) => {
    console.log('Received voice command:', command);
    if (isProcessing || isProcessingMessage) {
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
        setMessage(null); // Clear previous message
        
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

        // Send command to get AI response
        await sendMessage({
          type: 'text_message',
          text: command,
          enableTTS: audioEnabled
        });
        
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
            disabled={isProcessing || isProcessingMessage}
            aiProcessing={isProcessing || isProcessingMessage}
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
            aiResponse={messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].content : ''}
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

export default VoiceUI;
