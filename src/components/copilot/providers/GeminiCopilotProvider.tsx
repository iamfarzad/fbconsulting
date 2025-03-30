
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useGemini } from './GeminiProvider'; // Use the main provider context

// Define the context type
interface GeminiCopilotContextType {
  messages: Array<{
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    timestamp?: number;
    id?: string; 
  }>;
  sendMessage: (content: string, files?: Array<{mime_type: string, data: string, filename?: string}>) => void; 
  isLoading: boolean; 
  isListening: boolean; 
  transcript: string; 
  toggleListening: () => void;
  generateAndPlayAudio: (text: string) => void; 
  clearMessages?: () => void; 
  connectionError: string | null; 
  isConnected: boolean; 
}

const GeminiCopilotContext = createContext<GeminiCopilotContextType | null>(null);

export const useGeminiCopilot = () => {
  const context = useContext(GeminiCopilotContext);
  if (!context) throw new Error('useGeminiCopilot must be used within a GeminiCopilotProvider');
  return context;
};

interface GeminiCopilotProviderProps { children: ReactNode; }

export function GeminiCopilotProvider({ children }: GeminiCopilotProviderProps) {
  // Use the main GeminiProvider context hook
  const {
    isConnected, 
    isConnecting, 
    error: connectionError, 
    sendMessage: contextSendMessage, 
    messages: contextMessages, 
    isProcessing: contextIsProcessing,
    clearMessages: contextClearMessages,
    reconnect 
  } = useGemini();

  // Local voice state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    if (!isListening) setTimeout(() => { setTranscript('Simulated...'); setIsListening(false); }, 2000);
    else setTranscript('');
  }, [isListening]);

  const generateAndPlayAudio = useCallback((text: string) => console.log('Mock Playing audio:', text), []);

  // Send message using context
  const sendMessage = useCallback(async (content: string, files?: Array<{mime_type: string, data: string, filename?: string}>) => {
    if (!isConnected) { console.error("Not connected"); reconnect(); return; }
    if (content.trim() || (files && files.length > 0)) {
      let messageToSend: any;
      if (files && files.length > 0) messageToSend = { type: 'multimodal_message', text: content || null, files };
      else messageToSend = { type: 'text_message', text: content };
      try { await contextSendMessage(messageToSend); }
      catch (err) { console.error("Send Error:", err); }
      if (transcript) setTranscript('');
    }
  }, [isConnected, contextSendMessage, transcript, reconnect]);

  const value: GeminiCopilotContextType = {
    messages: contextMessages, 
    sendMessage,
    isLoading: contextIsProcessing || isConnecting, 
    isListening,
    transcript,
    toggleListening,
    generateAndPlayAudio,
    clearMessages: contextClearMessages, 
    connectionError,
    isConnected
  };

  return <GeminiCopilotContext.Provider value={value}>{children}</GeminiCopilotContext.Provider>;
}
