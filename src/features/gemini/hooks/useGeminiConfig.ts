import { useState, useEffect } from 'react';

export interface GeminiConfig {
  apiKey: string | null;
  modelName: string;
}

/**
 * Hook to manage Gemini API configuration from both environment variables and local storage
 */
export function useGeminiConfig() {
  const [config, setConfig] = useState<GeminiConfig>({
    apiKey: null,
    modelName: 'gemini-2.0-flash'
  });

  useEffect(() => {
    const loadConfig = () => {
      // First check environment variable
      const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      let apiKey = envApiKey || null;
      let modelName = 'gemini-2.0-flash';
      
      try {
        // Then check localStorage (user-provided key takes precedence)
        const storedConfig = localStorage.getItem('GEMINI_CONFIG');
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          // User-provided key takes precedence
          apiKey = parsedConfig.apiKey || apiKey;
          modelName = parsedConfig.modelName || modelName;
          
          console.log("useGeminiConfig - Local storage config:", 
            parsedConfig.apiKey ? "✅ Found key" : "❌ No key");
        }
      } catch (error) {
        console.error('Error parsing Gemini config:', error);
      }
      
      if (apiKey) {
        console.log(`useGeminiConfig - Using ${apiKey === envApiKey ? 'environment' : 'localStorage'} API key with model: ${modelName}`);
      } else {
        console.log("useGeminiConfig - No API key found");
      }
      
      setConfig({ apiKey, modelName });
    };

    loadConfig();
  }, []);

  return config;
}

export default useGeminiConfig;
