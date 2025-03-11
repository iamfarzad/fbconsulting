
import { LeadInfo } from '../lead/leadExtractor';

// Generate a response based on the current lead information and conversation
export const generateSuggestedResponse = (leadInfo: LeadInfo): string | null => {
  // If we reached the booking stage, suggest booking a call
  if (leadInfo.stage === 'ready-to-book') {
    return 'Would you like to schedule a consultation call where we can discuss your needs in more detail?';
  }
  
  // If we're at the interested stage, suggest a service
  if (leadInfo.stage === 'interested' && leadInfo.interests?.length) {
    return `Based on your interest in ${leadInfo.interests[0]}, I'd recommend starting with a consultation to see how we can customize this service for your specific needs.`;
  }
  
  // If we're at qualification and know a challenge but don't have interests yet
  if (leadInfo.stage === 'qualification' && leadInfo.challenges?.length && !leadInfo.interests?.length) {
    return `I see you're facing challenges with ${leadInfo.challenges[0]}. Would you like to know how our AI automation solutions can help address this?`;
  }
  
  // If we're at discovery and don't know much yet
  if (leadInfo.stage === 'discovery' && !leadInfo.name) {
    return "To better understand how I can help you, could you tell me a bit about yourself and your business?";
  }
  
  // No suggestion needed
  return null;
};

// Determine the persona to use based on the user's interests and page
export const determinePersona = (
  leadInfo: LeadInfo,
  currentPage?: string
): 'strategist' | 'technical' | 'consultant' | 'general' => {
  // If on a specific page, use that persona
  if (currentPage === 'services') {
    return 'consultant';
  }
  
  if (currentPage === 'blog') {
    return 'strategist';
  }
  
  // Based on detected interests
  if (leadInfo.interests?.includes('AI Strategy')) {
    return 'strategist';
  }
  
  if (leadInfo.interests?.some(i => 
    i === 'Workflow Automation' || 
    i === 'AI Chatbots' || 
    i === 'Data Analysis'
  )) {
    return 'technical';
  }
  
  // Default to general
  return 'general';
};
