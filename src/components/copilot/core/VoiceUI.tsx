import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedBars } from './ui/AnimatedBars';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';
import { VoicePanel } from './voice/VoicePanel';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import type { VoiceUIProps } from '@/types/voice';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const VoiceUI: React.FC<VoiceUIProps> = ({ onCommand, noFloatingButton = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithVoice') === 'true';
  });

  const { toast } = useToast();
  const commandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const {
    sendMessage,
    messages,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    isRecording
  } = useGemini();

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

  const handleCommand = async (command: string) => {
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
        commandTimeoutRef.current = setTimeout(() => {
          if (isProcessing) {
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
          enableTTS: true
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
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    }
  };

  const handleToggleListening = async () => {
    if (isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
      setShowTooltip(true);

      if (!hasInteracted) {
        setIsExpanded(true);
        setHasInteracted(true);
        localStorage.setItem('hasInteractedWithVoice', 'true');
      }
    }

    const tooltipTimeout = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(tooltipTimeout);
  };

  // Cleanup effect
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

  const VoiceButton = ({ className }: { className?: string }) => (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "relative h-12 w-12 shrink-0",
        isRecording && "bg-red-50 hover:bg-red-100 border-red-200 text-red-600",
        className
      )}
      onClick={isExpanded ? handleToggleListening : toggleExpanded}
      disabled={isProcessing}
    >
      {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
          <AnimatedBars isActive small />
        </div>
      )}
    </Button>
  );

  return (
    <>
      {!noFloatingButton && (
        <div className="fixed bottom-4 right-4 z-50">
          <VoiceButton />
        </div>
      )}

      {noFloatingButton && (
        <div className="flex justify-center">
          <VoiceButton className="mx-auto" />
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <VoicePanel
            isListening={isRecording}
            transcript={messages[messages.length - 1]?.content || ''}
            onClose={toggleExpanded}
            onToggleListening={handleToggleListening}
            aiResponse={messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].content : ''}
          />
        )}
      </AnimatePresence>

      {showTooltip && !isExpanded && (
        <div className="fixed bottom-20 right-6 p-3 bg-black text-white rounded-lg shadow-lg z-50 max-w-xs">
          <p className="text-sm mb-2">Hey, I'm your voice assistant—say something to try it out!</p>
          {isRecording && (
            <div className="voice-waveform flex justify-center items-end h-5">
              <AnimatedBars isActive={isRecording} small={true} />
            </div>
          )}
        </div>
      )}

      {messages[messages.length - 1]?.content && isRecording && !isExpanded && (
        <div className="fixed bottom-24 right-24 p-2 bg-white/90 text-black rounded shadow-md">
          "{messages[messages.length - 1].content}"
        </div>
      )}
    </>
  );
};

export default VoiceUI;
