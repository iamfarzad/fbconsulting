
import { useState, useEffect } from 'react';
import { LeadInfo } from '@/services/copilotService';

export const useSuggestedResponse = (leadInfo: LeadInfo): string | null => {
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  
  useEffect(() => {
    // Simple suggestion generation based on lead info
    const generateSuggestion = (info: LeadInfo): string => {
      if (info.stage === 'discovery') {
        return "Would you like to learn more about our services?";
      } else if (info.interests && info.interests.length > 0) {
        return `I see you're interested in ${info.interests[0]}. How can I help with that?`;
      }
      return "How can I assist you today?";
    };
    
    const suggestion = generateSuggestion(leadInfo);
    setSuggestedResponse(suggestion);
  }, [leadInfo]);
  
  return suggestedResponse;
};
