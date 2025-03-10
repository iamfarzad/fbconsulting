
import React, { useState } from 'react';
import { AnimatedChatInput } from '@/components/ui/ai-chat/AnimatedChatInput';
import { useCopilot } from '@/hooks/useCopilot';
import { ChatMessageList } from '@/components/ui/ai-chat/ChatMessageList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DotPattern from '@/components/ui/dot-pattern';
import { QuickActions } from '@/components/ui/ai-chat/QuickActions';

const AnimatedChatDemo = () => {
  const { 
    messages, 
    sendMessage, 
    clearMessages, 
    isLoading, 
    suggestedResponse,
    currentPersona,
  } = useCopilot();
  
  const [value, setValue] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  
  const handleSendMessage = async () => {
    if (!value.trim() || isLoading) return;
    
    const message = value.trim();
    setValue("");
    setShowMessages(true);
    
    await sendMessage(message);
  };

  const handleQuickAction = (topic: string) => {
    setValue(topic);
  };
  
  const currentPlaceholder = "How can I help automate your business today?";
  
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-16 relative">
        <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-4xl mt-12">
          <div className="rounded-xl shadow-lg overflow-hidden p-4">
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

            <QuickActions onActionClick={handleQuickAction} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimatedChatDemo;
