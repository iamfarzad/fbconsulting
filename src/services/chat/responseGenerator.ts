
// Generate AI responses and suggestions

import { LeadInfo } from '@/services/lead/leadExtractor';

// Generate a response based on input and lead info
export const generateResponse = (input: string, leadInfo: LeadInfo): string => {
  const inputLower = input.toLowerCase();
  
  // Simple response templates based on input keywords
  if (inputLower.includes('pricing') || inputLower.includes('cost')) {
    return "Our pricing is customized based on your specific needs. For most clients, our AI integration services start at $5,000 for initial consultations and implementation. Would you like to discuss the details of your project to get a more accurate estimate?";
  }
  
  if (inputLower.includes('contact') || inputLower.includes('speak')) {
    return "I'd be happy to connect you with a consultant. You can book a call directly through our calendar or leave your contact information, and someone will reach out within 24 hours. Would you prefer to schedule a call now?";
  }
  
  if (inputLower.includes('service') || inputLower.includes('offer')) {
    return "We offer a range of AI services including custom model development, integration with existing systems, workflow automation, and ongoing support. Based on your interest in " + (leadInfo.interests[0] || "AI"), + ", I'd recommend exploring our consulting services first. Would you like to learn more about that?";
  }
  
  // Default response based on lead stage
  switch (leadInfo.stage) {
    case 'discovery':
      return "Thank you for your interest. To better understand how we can help, could you tell me more about your specific needs or challenges you're facing with AI implementation?";
    case 'evaluation':
      return "Based on what you've shared, I believe our AI consulting services would be a good fit. Would you like to schedule a more detailed discussion with one of our specialists?";
    case 'decision':
      return "We're excited about the possibility of working with you. Would you like to review a proposal or schedule a call with our implementation team?";
    default:
      return "Thank you for your message. How else can I assist you with your AI-related questions today?";
  }
};

// Generate a suggested response for the user
export const generateSuggestedResponse = (leadInfo: LeadInfo): string => {
  const mostRecentInterest = leadInfo.interests.length > 0 
    ? leadInfo.interests[leadInfo.interests.length - 1] 
    : null;
  
  if (!mostRecentInterest) {
    return "Tell me more about your AI needs";
  }
  
  // Simple suggestion based on the most recent interest
  if (mostRecentInterest.toLowerCase().includes('pricing')) {
    return "What factors affect the pricing?";
  }
  
  if (mostRecentInterest.toLowerCase().includes('integration')) {
    return "How long does integration typically take?";
  }
  
  if (mostRecentInterest.toLowerCase().includes('custom')) {
    return "What information do you need to build a custom solution?";
  }
  
  // Default suggestions based on lead stage
  switch (leadInfo.stage) {
    case 'discovery':
      return "I'm interested in improving our customer service with AI";
    case 'evaluation':
      return "Could you provide some case studies?";
    case 'decision':
      return "I'd like to schedule a consultation";
    default:
      return "Tell me more about your services";
  }
};

// Determine AI persona based on context
export const determinePersona = (messages: { role: string; content: string }[]): string => {
  // Count mentions of technical terms
  let technicalTerms = 0;
  const technicalKeywords = ['api', 'integration', 'code', 'development', 'implementation', 'technical'];
  
  // Count mentions of business terms
  let businessTerms = 0;
  const businessKeywords = ['roi', 'cost', 'revenue', 'business', 'strategy', 'market'];
  
  // Analyze user messages
  const userMessages = messages.filter(m => m.role === 'user');
  for (const message of userMessages) {
    const content = message.content.toLowerCase();
    
    for (const keyword of technicalKeywords) {
      if (content.includes(keyword)) technicalTerms++;
    }
    
    for (const keyword of businessKeywords) {
      if (content.includes(keyword)) businessTerms++;
    }
  }
  
  // Determine persona based on term counts
  if (technicalTerms > businessTerms) {
    return 'technical';
  } else if (businessTerms > technicalTerms) {
    return 'business';
  }
  
  // Default persona
  return 'balanced';
};
