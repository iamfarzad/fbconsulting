
import React from 'react';
import { AnimatedChatInput } from '@/components/ui/ai-chat/AnimatedChatInput';
import { useCopilot } from '@/hooks/useCopilot';
import { ChatMessageList } from '@/components/ui/ai-chat/ChatMessageList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DotPattern from '@/components/ui/dot-pattern';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import ChatbotAnimation from "@/components/bento/animations/ChatbotAnimation";

const AnimatedChatDemo = () => {
  const { 
    messages, 
    sendMessage, 
    clearMessages, 
    isLoading, 
    suggestedResponse,
    currentPersona,
    leadInfo
  } = useCopilot();
  
  const [value, setValue] = React.useState("");
  const [showMessages, setShowMessages] = React.useState(false);
  
  const handleSendMessage = async () => {
    if (!value.trim() || isLoading) return;
    
    const message = value.trim();
    setValue("");
    setShowMessages(true);
    
    await sendMessage(message);
  };
  
  // Define the persona-based placeholder texts
  const placeholdersByPersona = {
    strategist: "Ask about AI strategy and transformation...",
    technical: "Ask about technical implementation and integration...",
    consultant: "Ask about specific services and solutions...",
    general: "Ask about AI automation for your business..."
  };

  const currentPlaceholder = placeholdersByPersona[currentPersona] || "Ask about AI automation for your business...";
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16 relative">
        <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
        
        <div className="container mx-auto px-4 relative z-10">
          <PageHeader
            title="Enhanced AI Chat Experience"
            subtitle="Try our new animated chat interface"
          />
          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center md:text-left max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-deep-purple dark:text-neon-white">
                  Experience our new particle animation
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Type your message and watch it transform into particles as you send it.
                  Our AI will respond with helpful information about automation and business solutions.
                </p>
              </div>
              
              <motion.div 
                className="w-40 h-40 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                <ChatbotAnimation />
              </motion.div>
            </div>
          
            <div className="rounded-xl shadow-lg overflow-hidden bg-deep-purple/10 p-4">
              {(showMessages || messages.length > 0) && (
                <ChatMessageList 
                  messages={messages}
                  showMessages={showMessages}
                />
              )}
              
              <AnimatedChatInput
                value={value}
                setValue={setValue}
                onSend={handleSendMessage}
                onClear={clearMessages}
                isLoading={isLoading}
                showMessages={showMessages}
                hasMessages={messages.length > 0}
                suggestedResponse={suggestedResponse}
                placeholder={currentPlaceholder}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimatedChatDemo;
