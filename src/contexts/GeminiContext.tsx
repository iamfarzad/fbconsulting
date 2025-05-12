import { type ReactNode, createContext, useContext, useState, useCallback } from 'react';
import type { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiContextType {
  client: GoogleGenerativeAI | null;
  setApiKey: (key: string) => void;
}

const GeminiContext = createContext<GeminiContextType>({
  client: null,
  setApiKey: () => {},
});

export function GeminiClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<GoogleGenerativeAI | null>(null);

  const setApiKey = useCallback((apiKey: string) => {
    // Dynamic import to avoid loading Gemini SDK on the server
    import('@google/generative-ai').then(({ GoogleGenerativeAI }) => {
      const newClient = new GoogleGenerativeAI(apiKey);
      setClient(newClient);
    });
  }, []);

  return (
    <GeminiContext.Provider value={{ client, setApiKey }}>
      {children}
    </GeminiContext.Provider>
  );
}

export const useGeminiClient = () => useContext(GeminiContext);