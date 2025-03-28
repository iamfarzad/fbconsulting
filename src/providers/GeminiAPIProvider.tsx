import React, { useState, useEffect, createContext, useContext } from "react";

// Create a Context for Gemini API
const GeminiAPIContext = createContext<{ apiKey: string | null }>({ apiKey: null });

// Custom hook to access the Gemini API Key
export const useGeminiAPI = () => {
  const context = useContext(GeminiAPIContext);
  if (context === undefined) {
    throw new Error('useGeminiAPI must be used within a GeminiAPIProvider');
  }
  return context;
};

interface GeminiAPIProviderProps {
  children: React.ReactNode;
}

export const GeminiAPIProvider: React.FC<GeminiAPIProviderProps> = ({ children }) => {
  const [apiKeyValue, setApiKeyValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Note: Use environment variables for sensitive information
      throw new Error('VITE_GEMINI_API_KEY is not set in environment');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading API key';
      console.error('⚠️ API Key Error:', errorMessage);
      setError(errorMessage);
      setApiKeyValue(null);
    }
  }, []);

  // Show error in UI if API key is missing in development
  if (error && import.meta.env.DEV) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
        <p>Error: {error}</p>
        <p className="text-sm">Please check your .env file and ensure VITE_GEMINI_API_KEY is set correctly.</p>
      </div>
    );
  }

  return (
    <GeminiAPIContext.Provider value={{ apiKey: apiKeyValue }}>
      {children}
    </GeminiAPIContext.Provider>
  );
};
