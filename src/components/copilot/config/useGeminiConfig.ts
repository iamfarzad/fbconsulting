import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import useGeminiAPI from '@/hooks/useGeminiAPI';

/**
 * Hook for managing Gemini API configuration
 */
export const useGeminiConfig = () => {
  const { apiKey: contextApiKey } = useGeminiAPI();
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-2.0-flash'); // Updated to correct model name
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [envKeyValue, setEnvKeyValue] = useState('');
  
  // Load saved API key from localStorage if available
  useEffect(() => {
    // Check for environment variable
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setHasEnvKey(!!envApiKey);
    if (envApiKey) {
      setEnvKeyValue(envApiKey);
      console.log("Environment API key detected:", envApiKey.substring(0, 5) + "..." + envApiKey.substring(envApiKey.length - 4));
    }
    
    // Check localStorage
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.apiKey) {
          setApiKey(config.apiKey);
          setHasSavedKey(true);
          console.log("Local storage API key detected");
        }
        if (config.modelName) {
          setModelName(config.modelName);
        }
      } catch (error) {
        console.error('Error parsing saved configuration:', error);
      }
    } else if (contextApiKey) {
      setApiKey(contextApiKey);
      setHasSavedKey(true);
    }
  }, [contextApiKey]);
  
  const testGeminiConnection = async (key: string, model: string): Promise<boolean> => {
    if (!key) return false;
    
    try {
      setIsLoading(true);
      console.log(`Testing Gemini connection with model: ${model}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: 'Hello, this is a test message.' }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            }
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Test response:", data.candidates ? "Success" : "No candidates in response");
      return Boolean(data.candidates);
    } catch (error) {
      console.error('Error testing Gemini API:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveConfig = async () => {
    try {
      // Test connection
      const isConnected = await testGeminiConnection(apiKey, modelName);
      
      if (isConnected) {
        // Save configuration to localStorage - store the full API key securely
        localStorage.setItem('GEMINI_CONFIG', JSON.stringify({
          apiKey: apiKey,
          modelName: modelName,
          timestamp: Date.now()
        }));
        
        setHasSavedKey(true);
        toast.success('Gemini API configuration saved successfully!');
        
        // Reload the page to apply the new API key
        window.location.reload();
      } else {
        toast.error('Failed to connect to Gemini API', {
          description: 'Please check your API key and model selection and try again.'
        });
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    }
  };
  
  const handleClearConfig = () => {
    localStorage.removeItem('GEMINI_CONFIG');
    setApiKey('');
    setModelName('gemini-2.0-flash');
    setHasSavedKey(false);
    toast.success('API configuration cleared');
  };
  
  return {
    apiKey,
    setApiKey,
    modelName,
    setModelName,
    isLoading,
    hasSavedKey,
    hasEnvKey,
    envKeyValue,
    handleSaveConfig,
    handleClearConfig
  };
};
