
import React, { createContext, useContext, ReactNode } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider'; // Import the main context hook

// Define the shape of the context data (subset of GeminiContext)
interface ChatContextType {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    timestamp: number;
    files?: any[]; // Simplified file info if needed
  }>;
  sendMessage: (message: { type: string; text?: string | null; files?: any[] }) => void;
  isConnected: boolean;
  isProcessing: boolean;
  connectionError: string | null;
  clearMessages: () => void;
}

// Create the context with a default value (or null)
const ChatContext = createContext<ChatContextType | null>(null);

// Custom hook to use the ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Define the props for the provider component
interface ChatProviderProps {
  children: ReactNode;
}

// ChatProvider now acts as a wrapper around useGemini,
// potentially adapting the context value if needed, or just passing it through.
// For simplicity, we'll pass through the relevant parts of useGemini.
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Get state and methods from the central GeminiProvider context
  const {
    messages, 
    sendMessage, // Use the context's sendMessage directly
    isConnected, 
    isProcessing, 
    error: connectionError, 
    clearMessages,
    // Add other needed values from useGemini if required
  } = useGemini();

  // Prepare the value for this specific ChatContext
  // Adapt the data structure if ChatContext requires a different shape than GeminiContext
  const chatContextValue: ChatContextType = {
    messages, // Pass messages directly
    // Adapt sendMessage if needed, otherwise pass directly
    // For now, assume the signature matches or components will adapt
    sendMessage: (msg) => sendMessage(msg), 
    isConnected,
    isProcessing,
    connectionError,
    clearMessages,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};
