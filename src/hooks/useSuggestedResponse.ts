
import { useState, useEffect } from 'react';
import { LeadInfo } from '@/services/lead/leadExtractor';

export function useSuggestedResponse(leadInfo: LeadInfo): string | null {
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);

  useEffect(() => {
    // This is a very simple suggested response generator
    const generateSuggestion = () => {
      if (!leadInfo || !leadInfo.interests || leadInfo.interests.length === 0) {
        return null;
      }

      // Combine all interests into a text corpus
      const text = leadInfo.interests.join(' ').toLowerCase();

      // Look for keywords and provide suggestions
      if (text.includes('ai') || text.includes('automation')) {
        return "Tell me more about how AI automation can benefit my business";
      }

      if (text.includes('cost') || text.includes('price') || text.includes('pricing')) {
        return "What are the costs associated with implementing your solution?";
      }

      if (text.includes('example') || text.includes('case study')) {
        return "Can you provide an example of a successful implementation?";
      }

      if (text.includes('help') || text.includes('need')) {
        return "I'd like to discuss my specific business needs";
      }

      if (leadInfo.stage === 'discovery') {
        return "What services do you offer?";
      }

      if (leadInfo.stage === 'qualification') {
        return "How do you typically work with clients?";
      }

      if (leadInfo.stage === 'interested') {
        return "I'd like to schedule a consultation";
      }

      // Default response
      return "Tell me more about your services";
    };

    setSuggestedResponse(generateSuggestion());
  }, [leadInfo]);

  return suggestedResponse;
}

export default useSuggestedResponse;
