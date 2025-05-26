import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
  message: string | null;
  setMessage: (message: string | null) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}

interface MessageProviderProps {
  children: ReactNode;
}

export function MessageProvider({ children }: MessageProviderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleAudio = () => setAudioEnabled(prev => !prev);

  const value: MessageContextType = {
    message,
    setMessage,
    audioEnabled,
    toggleAudio,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}
