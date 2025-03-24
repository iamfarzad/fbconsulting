// If this file exists, it likely uses the data

import { useState, useCallback } from 'react';
import { fetchGeminiResponse } from '../services/api';

export const useGeminiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState([]); // Ensure this is initialized as an array
  
  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchGeminiResponse(message);
      
      // Super defensive check for data structure
      if (result) {
        // Ensure result.data is always an array
        if (!result.data) {
          result.data = [];
        } else if (!Array.isArray(result.data)) {
          result.data = [result.data];
        }
        
        // Ensure messages are properly formatted
        const formattedMessages = Array.isArray(result.data) 
          ? result.data.map(msg => {
              // Ensure each message has required properties
              return {
                role: msg.role || 'assistant',
                content: msg.content || msg.text || JSON.stringify(msg)
              };
            })
          : [];
        
        // Update messages with safe array
        setMessages(prevMessages => {
          // Ensure prevMessages is an array
          const safeMessages = Array.isArray(prevMessages) ? prevMessages : [];
          return [...safeMessages, ...formattedMessages];
        });
      }
      
      setResponse(result);
      return result;
    } catch (err) {
      console.error("Error in useGeminiService:", err);
      setError(err.message || 'Error fetching response');
      return {
        status: 'error',
        error: err.message,
        data: [] // Always return an array
      };
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Reset function to clear messages
  const resetMessages = useCallback(() => {
    setMessages([]);
    setResponse(null);
    setError(null);
  }, []);
  
  return {
    loading,
    error,
    response,
    messages, // Make sure we expose the messages array
    sendMessage,
    resetMessages
  };
};

export default useGeminiService;
