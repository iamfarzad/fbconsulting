import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoiceUI } from '@/components/VoiceUI';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const VoiceServiceDemo = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [speechText, setSpeechText] = useState('Hello! This is a demonstration of the voice synthesis feature.');
  const [voiceRate, setVoiceRate] = useState(1);
  const [voicePitch, setVoicePitch] = useState(1);
  const { toast } = useToast();
  
  const { 
    sendMessage,
    isProcessing: isSpeaking,
    startRecording,
    stopRecording,
    stopAudio
  } = useGemini();

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);

    toast({
      title: "Voice Command Received",
      description: command,
      duration: 3000
    });

    // Handle specific commands
    if (command.toLowerCase().includes('speak') || command.toLowerCase().includes('say')) {
      const textMatch = command.match(/(?:speak|say)\s+(.+)/i);
      if (textMatch && textMatch[1]) {
        const textToSpeak = textMatch[1];
        setSpeechText(textToSpeak);
        handleSpeak(textToSpeak);
      }
    } else if (command.toLowerCase().includes('hello') || command.toLowerCase().includes('hi')) {
      handleSpeak('Hello there! How can I help you today?');
    }
  };

  const handleSpeak = (text: string = speechText) => {
    if (text.trim()) {
      sendMessage({
        type: 'text_message',
        text,
        enableTTS: true,
        audioOptions: {
          rate: voiceRate,
          pitch: voicePitch
        }
      });
    }
  };

  return (
    <div className="py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-black/5 dark:bg-white/5 backdrop-blur-md p-8 rounded-xl border border-black/10 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Voice Service Demo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Voice Recognition</h3>

            <div className="flex flex-col items-center justify-center space-y-6">
              <p className="text-center text-muted-foreground">
                Click the microphone button and try saying something. Your voice command will be processed and displayed here.
              </p>

              {lastCommand && (
                <motion.div
                  className="bg-black text-white p-4 rounded-lg max-w-md w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-medium">Last command:</p>
                  <p className="text-white/90">"{lastCommand}"</p>
                </motion.div>
              )}

              <div className="relative">
                <p className="text-xs text-muted-foreground mb-3 text-center">
                  Try saying "Hello" or "Say [your message]"
                </p>
                <VoiceUI onCommand={handleVoiceCommand} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Voice Synthesis</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="speechText">Text to speak</Label>
                <Input
                  id="speechText"
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  placeholder="Enter text to speak..."
                />
              </div>

              <div>
                <Label htmlFor="voiceRate">Rate: {voiceRate.toFixed(1)}</Label>
                <Slider
                  id="voiceRate"
                  value={[voiceRate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setVoiceRate(value[0])}
                />
              </div>

              <div>
                <Label htmlFor="voicePitch">Pitch: {voicePitch.toFixed(1)}</Label>
                <Slider
                  id="voicePitch"
                  value={[voicePitch]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setVoicePitch(value[0])}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleSpeak()}
                  disabled={isSpeaking || !speechText.trim()}
                  className="flex-1"
                >
                  {isSpeaking ? 'Speaking...' : 'Speak Text'}
                </Button>

                {isSpeaking && (
                  <Button
                    variant="outline"
                    onClick={stopAudio}
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-500 hover:text-red-600"
                  >
                    Stop
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceServiceDemo;
