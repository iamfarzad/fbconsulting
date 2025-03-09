
import { useState, useEffect } from 'react';
import { LeadInfo, generateSuggestedResponse } from '@/services/copilotService';

export const useSuggestedResponse = (leadInfo: LeadInfo) => {
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  
  // When lead info changes, update suggested responses
  useEffect(() => {
    const suggestion = generateSuggestedResponse(leadInfo);
    setSuggestedResponse(suggestion);
  }, [leadInfo]);
  
  return suggestedResponse;
};
