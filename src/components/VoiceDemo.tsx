
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceUI from './VoiceUI';
import { useToast } from '@/hooks/use-toast';

const VoiceDemo = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    
    toast({
      title: "Voice Command Received",
      description: command,
      duration: 3000,
    });
    
    // You can add specific command handling here
    if (command.toLowerCase().includes('hello') || command.toLowerCase().includes('hi')) {
      toast({
        title: "AI Response",
        description: "Hello there! How can I help you today?",
        variant: "default",
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
        <h2 className="text-2xl font-bold mb-6 text-center">Voice Assistant Demo</h2>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-center text-muted-foreground max-w-lg">
            Click the microphone button below and try saying something. Your voice command will be processed and displayed here.
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
              Try saying "Hello" or ask me a question
            </p>
            <div className="mb-4">
              <VoiceUI onCommand={handleVoiceCommand} noFloatingButton={true} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceDemo;
