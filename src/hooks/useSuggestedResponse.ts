
import { useState, useEffect } from 'react';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { generateSuggestedResponse } from '@/services/chat/responseGenerator';

export function useSuggestedResponse(leadInfo: LeadInfo): string | null {
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate a suggestion based on lead info
    if (leadInfo && leadInfo.interests && leadInfo.interests.length > 0) {
      const suggestion = generateSuggestedResponse(leadInfo);
      setSuggestedResponse(suggestion);
    } else {
      setSuggestedResponse(null);
    }
  }, [leadInfo]);
  
  return suggestedResponse;
}
