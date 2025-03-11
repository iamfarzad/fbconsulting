
import { LeadInfo } from '@/services/lead/leadExtractor';
import { determinePersona } from '@/services/chat/responseGenerator';
import { trackEvent } from '@/services/analyticsService';

// Process a message and generate an AI response
export const processMessage = async (
  message: string, 
  leadInfo: LeadInfo,
  currentPage?: string
): Promise<string> => {
  // Track message sent
  trackEvent({
    action: 'chat_message_sent',
    category: 'chatbot',
    label: 'user_message',
    message_length: message.length
  });
  
  try {
    // Determine which persona to use
    const persona = determinePersona(leadInfo, currentPage);
    
    // Simple response generation based on persona and lead stage
    // In a real implementation, this would call an AI model API
    let response = "";
    
    // If we have a name, use it
    const greeting = leadInfo.name ? `Hi ${leadInfo.name}! ` : "";
    
    // Generate a response based on persona
    switch (persona) {
      case 'strategist':
        response = `${greeting}From a strategic perspective, `;
        break;
      case 'technical':
        response = `${greeting}Looking at the technical aspects, `;
        break;
      case 'consultant':
        response = `${greeting}As a consultant, I'd advise that `;
        break;
      default:
        response = `${greeting}`;
    }
    
    // Add content based on lead stage
    switch (leadInfo.stage) {
      case 'discovery':
        response += "I'd like to understand more about your business needs. What specific challenges are you looking to address with AI automation?";
        break;
      case 'qualification':
        response += "Based on what you've shared, our AI solutions could help optimize your workflows. Would you like to know more about our specific services?";
        break;
      case 'interested':
        response += "I'm glad you're interested! Our AI automation services are tailored to your needs and typically start at $2,000 for a basic implementation. Would you like to schedule a consultation to discuss your specific requirements?";
        break;
      case 'ready-to-book':
        response += "Great! Let's schedule a consultation. Would you prefer a video call or phone call? Also, what times work best for you?";
        break;
      default:
        response += "How can I help you with AI automation today?";
    }
    
    // In a real implementation, you would call your AI model API here
    // For now, simulate a delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    
    // Track error
    trackEvent({
      action: 'chat_processing_error',
      category: 'error',
      label: 'message_processing',
      error: String(error)
    });
    
    // Return a generic error message
    return "I'm sorry, I'm having trouble understanding. Could you rephrase your question?";
  }
};
