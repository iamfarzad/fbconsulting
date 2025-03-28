
import { LeadInfo } from '../lead/leadExtractor';

// Generate a mock response based on the lead info
export const generateResponse = (message: string, leadInfo: LeadInfo): string => {
  const responses = [
    "I understand your interest in AI solutions. How can I help you further with implementing these technologies in your business?",
    "That's a great question about automation. Many businesses are looking to streamline their workflows just like you're describing.",
    "Based on what you've shared, I think our consulting services could be really valuable for your situation. Would you like to know more?",
    "I'd be happy to provide more details about our AI implementation process. Is there a specific aspect you'd like to explore?",
    "Many clients in similar situations have found success with our personalized approach. What specific challenges are you facing?"
  ];
  
  // Generate a deterministic but seemingly random index based on message
  const messageLength = message.length;
  const index = messageLength % responses.length;
  
  return responses[index];
};

// Determine the persona best suited for this lead
export const determinePersona = (leadInfo: LeadInfo): 'strategist' | 'technical' | 'consultant' | 'general' => {
  // Simple logic to determine the most appropriate persona
  const interestsText = leadInfo.interests.join(' ').toLowerCase();
  
  if (interestsText.includes('strategy') || 
      interestsText.includes('planning') || 
      interestsText.includes('future')) {
    return 'strategist';
  }
  
  if (interestsText.includes('code') || 
      interestsText.includes('development') || 
      interestsText.includes('programming') || 
      interestsText.includes('technical')) {
    return 'technical';
  }
  
  if (interestsText.includes('advice') || 
      interestsText.includes('guidance') || 
      interestsText.includes('help')) {
    return 'consultant';
  }
  
  return 'general';
};

// Generate a suggested response for quick replies
export const generateSuggestedResponse = (leadInfo: LeadInfo): string => {
  const suggestions = [
    "Tell me more about how AI could help my specific business needs.",
    "What's the typical timeline for implementing these solutions?",
    "Could you share a case study of similar work you've done?",
    "I'd like to schedule a consultation to discuss this further.",
    "What are the costs involved for a business of my size?"
  ];
  
  // Use the lead stage to choose an appropriate suggestion
  if (leadInfo.stage === 'initial' || leadInfo.stage === 'discovery') {
    return suggestions[0];
  }
  if (leadInfo.stage === 'evaluation') {
    return suggestions[2];
  }
  if (leadInfo.stage === 'decision') {
    return suggestions[3];
  }
  
  // Default suggestion
  return suggestions[1];
};
