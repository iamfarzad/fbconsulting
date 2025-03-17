
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';
import { useGeminiAPI } from '../../App';

// Create a context for Gemini-specific functionality
interface GeminiContextType {
  isInitialized: boolean;
  personaData: any;
}

const GeminiContext = createContext<GeminiContextType>({
  isInitialized: false,
  personaData: null
});

// Custom hook to access the Gemini context
export const useGemini = () => useContext(GeminiContext);

interface GeminiProviderProps {
  children: React.ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const { personaData } = usePersonaManagement();
  const { apiKey } = useGeminiAPI();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (apiKey) {
      try {
        if (personaData) {
          console.log("Gemini initialized with persona data:", personaData.currentPersona);
        } else {
          console.log("Gemini initialized but no persona data available");
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing Gemini:", error);
      }
    } else {
      console.warn("No Gemini API key found");
    }
  }, [apiKey, personaData]);
  
  return (
    <GeminiContext.Provider value={{ 
      isInitialized, 
      personaData: personaData || {
        currentPersona: 'default',
        personaDefinitions: {
          default: {
            name: 'Default Assistant',
            welcomeMessage: 'Hello! How can I help you today?',
            systemInstructions: 'You are a helpful AI assistant.'
          }
        }
      } 
    }}>
      {children}
    </GeminiContext.Provider>
  );
};
