
import { useState, useEffect, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to manage API key logic
 */
export function useApiKeyManagement(
  propApiKey?: string, 
  contextApiKey?: string
) {
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Determine which API key to use (prop > context > env)
  const apiKey = useMemo(() => {
    const key = propApiKey || contextApiKey || envApiKey || '';
    return key;
  }, [propApiKey, contextApiKey, envApiKey]);

  // Initialize API key
  useEffect(() => {
    if (!apiKey) {
      toast({
        title: 'AI Configuration Error',
        description: 'API key not found. Please check your configuration.',
        variant: 'destructive'
      });
    }
  }, [apiKey]);

  return { apiKey };
}
