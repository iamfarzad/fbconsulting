
import { useState, useEffect } from 'react';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { generateSuggestedResponse } from '@/services/chat/responseGenerator';

export const useSuggestedResponse = (leadInfo: LeadInfo): string | null => {
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  
  useEffect(() => {
    const suggestion = generateSuggestedResponse(leadInfo);
    setSuggestedResponse(suggestion);
  }, [leadInfo]);
  
  return suggestedResponse;
};
