// If this file exists, it likely uses the data

import { useState, useCallback } from 'react';
import { fetchGeminiResponse } from '../services/api';

export const useGeminiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  
  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchGeminiResponse(message);
      
      // Safety check to ensure data is always an array
      if (result && result.data && !Array.isArray(result.data)) {
        result.data = Array.isArray(result.data) ? result.data : [];
      }
      
      setResponse(result);
      return result;
    } catch (err) {
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
  
  return {
    loading,
    error,
    response,
    sendMessage
  };
};

export default useGeminiService;
