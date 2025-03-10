
import { useState, useEffect } from 'react';
import { LeadInfo } from '@/services/copilotService';

export const useSuggestedResponse = (leadInfo: LeadInfo): string | null => {
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  
  useEffect(() => {
    // Simple suggestion generation based on lead info
    const generateSuggestion = (info: LeadInfo): string => {
      if (info.type === 'prospect') {
        return "Would you like to learn more about our services?";
      }
      return "How can I assist you today?";
    };
    
    const suggestion = generateSuggestion(leadInfo);
    setSuggestedResponse(suggestion);
  }, [leadInfo]);
  
  return suggestedResponse;
};
