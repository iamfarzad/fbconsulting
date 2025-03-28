
import { LeadInfo } from '../lead/leadExtractor';

// Generate a response based on lead info
export const generateResponse = (message: string, leadInfo: LeadInfo): string => {
  // This is a simplified mock implementation
  // In a real application, this would be handled by an AI service
  
  const greeting = leadInfo.name ? `Hi ${leadInfo.name}! ` : "Hello! ";
  
  if (message.toLowerCase().includes('help') || message.toLowerCase().includes('service')) {
    return `${greeting}I'd be happy to help with your AI consultation needs. Our services include chatbot development, process automation, and AI strategy consulting. What specifically are you interested in?`;
  }
  
  if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
    return `${greeting}Our pricing depends on the scope of your project. Basic consulting starts at $200/hour, while full implementation projects typically range from $5,000 to $50,000. Would you like to schedule a call to discuss your specific needs?`;
  }
  
  if (message.toLowerCase().includes('book') || message.toLowerCase().includes('schedule')) {
    return `${greeting}I'd be happy to schedule a consultation. Please provide your preferred date and time, and I'll check availability. Alternatively, you can use our booking calendar link.`;
  }
  
  // Default response based on lead stage
  switch (leadInfo.stage) {
    case 'ready-to-book':
      return `${greeting}I'm excited to move forward with our consultation. Would you prefer a video call or a phone call for our meeting?`;
    case 'interested':
      return `${greeting}Based on what you've shared, I think we can definitely help with your AI needs. Would you like me to explain our process in more detail, or would you prefer to schedule a consultation?`;
    case 'discovery':
      return `${greeting}Thanks for sharing that information. To better understand your needs, could you tell me a bit more about the specific challenges you're hoping to address with AI?`;
    default:
      return `${greeting}Thanks for reaching out! I'm here to help with your AI consultation needs. What specific challenges is your business facing that you'd like to address?`;
  }
};

// Determine which persona to use based on lead info
export const determinePersona = (leadInfo: LeadInfo, currentPage?: string): 'strategist' | 'technical' | 'consultant' => {
  // Simple logic to determine which persona to use
  if (currentPage === 'services' || leadInfo.stage === 'discovery') {
    return 'consultant';
  }
  
  if (leadInfo.interests?.some(i => 
    i.toLowerCase().includes('code') || 
    i.toLowerCase().includes('development') || 
    i.toLowerCase().includes('implementation')
  )) {
    return 'technical';
  }
  
  if (leadInfo.stage === 'decision' || leadInfo.stage === 'evaluation') {
    return 'strategist';
  }
  
  return 'consultant'; // Default persona
};

// Generate a suggested response based on recent conversation
export const generateSuggestedResponse = (recentMessages: string[]): string | null => {
  if (recentMessages.length === 0) return null;
  
  const lastMessage = recentMessages[recentMessages.length - 1].toLowerCase();
  
  if (lastMessage.includes('help')) {
    return 'I need help implementing AI in my business processes.';
  }
  
  if (lastMessage.includes('service') || lastMessage.includes('offer')) {
    return 'Can you tell me more about your AI consultation services?';
  }
  
  if (lastMessage.includes('price') || lastMessage.includes('cost')) {
    return 'What are your rates for AI implementation projects?';
  }
  
  if (lastMessage.includes('book') || lastMessage.includes('schedule')) {
    return 'I'd like to schedule a consultation to discuss my project.';
  }
  
  return null;
};
