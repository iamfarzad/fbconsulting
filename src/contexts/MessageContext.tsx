import React, { createContext, useContext, useState } from 'react';

interface MessageContextType {
  message: string | null;
  setMessage: (msg: string | null) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <MessageContext.Provider
      value={{
        message,
        setMessage,
        audioEnabled,
        setAudioEnabled,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}
