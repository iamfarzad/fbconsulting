import { useGeminiMessageSubmission, useGeminiInitialization } from '@/features/gemini';
import { useState, useEffect } from 'react';
import { Message } from '@/features/gemini/types';

export function UnifiedChatMessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { submitMessage } = useGeminiMessageSubmission();
  const { isReady } = useGeminiInitialization();

  useEffect(() => {
    if (!isReady) return;
    
    // Initial setup if needed
    console.log('Gemini chat initialized');
  }, [isReady]);

  const handleNewMessage = async (content: string) => {
    const newMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    const response = await submitMessage(content);
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}
