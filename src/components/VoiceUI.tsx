
import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { useGeminiCopilot } from '@/components/copilot/GeminiCopilotProvider';

interface VoiceUIProps {
  onCommand?: (command: string) => void;
  noFloatingButton?: boolean;
}

export const VoiceUI: React.FC<VoiceUIProps> = ({
  onCommand,
  noFloatingButton = false
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  
  const { messages } = useGemini();
  
  // Use the copilot context that has the voice methods
  const { 
    isListening, 
    transcript, 
    toggleListening 
  } = useGeminiCopilot();
  
  // Update AI response when messages change
  useEffect(() => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    if (assistantMessages.length > 0) {
      setAiResponse(assistantMessages[assistantMessages.length - 1].content);
    }
  }, [messages]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  if (noFloatingButton) return null;

  return (
    <>
      {/* Floating voice button */}
      <motion.button
        className="fixed bottom-24 right-4 z-50 bg-primary text-white p-3.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        aria-label="Toggle voice assistant"
      >
        {isPanelOpen ? <MicOff size={20} /> : <Mic size={20} />}
      </motion.button>

      {/* Voice panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-40 right-4 z-50 w-80 bg-background border rounded-lg shadow-lg p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Voice Assistant</h3>
              <Button variant="ghost" size="icon" onClick={togglePanel}>
                <MicOff size={16} />
              </Button>
            </div>
            
            <div className="bg-muted p-3 rounded-md mb-3 min-h-[100px] overflow-auto">
              {isListening ? (
                <>
                  <p className="text-sm font-medium mb-2">Listening...</p>
                  <div className="flex justify-center">
                    <AnimatedBars isActive={true} />
                  </div>
                  {transcript && (
                    <p className="text-sm italic mt-2">{transcript}</p>
                  )}
                </>
              ) : (
                <p className="text-sm">{aiResponse || "Ask me anything with your voice..."}</p>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                className="gap-2"
              >
                {isListening ? (
                  <>
                    <MicOff size={16} /> Stop Listening
                  </>
                ) : (
                  <>
                    <Mic size={16} /> Start Listening
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
