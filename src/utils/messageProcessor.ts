
import { LeadInfo, determinePersona, generateSuggestedResponse } from '@/services/copilotService';
import { trackEvent } from '@/services/analyticsService';

// Process and generate AI responses based on user messages
export const processMessage = async (
  content: string, 
  leadInfo: LeadInfo, 
  currentPage: string
): Promise<string> => {
  // This is where we would normally call CopilotKit API
  // For now, we're using a simple mock response to demonstrate the flow
  
  // Track this interaction
  const persona = determinePersona(leadInfo, currentPage);
  trackEvent({
    action: 'chat_message_sent',
    category: 'chatbot',
    label: 'user_message',
    page: currentPage,
    persona: persona,
    lead_stage: leadInfo.stage
  });
  
  // For demo purposes, generate a simple response based on the detected interests
  let response = '';
  
  if (leadInfo.name && !leadInfo.name) {
    // We just learned their name
    response = `Nice to meet you, ${leadInfo.name}! `;
  }
  
  if (leadInfo.interests?.length && (!leadInfo.interests || leadInfo.interests.length > leadInfo.interests.length)) {
    // We just learned about a new interest
    const newInterests = leadInfo.interests.filter(i => !leadInfo.interests?.includes(i));
    if (newInterests.length > 0) {
      response += `I see you're interested in ${newInterests.join(', ')}. That's one of our specialties! `;
    }
  }
  
  if (leadInfo.challenges?.length && (!leadInfo.challenges || leadInfo.challenges.length > leadInfo.challenges.length)) {
    // We just learned about a new challenge
    const newChallenges = leadInfo.challenges.filter(c => !leadInfo.challenges?.includes(c));
    if (newChallenges.length > 0) {
      response += `Many businesses struggle with ${newChallenges.join(', ')}. AI automation can help address these challenges. `;
    }
  }
  
  // Add more dynamic content based on the page they're on
  if (currentPage === 'services') {
    response += "Our services are designed to transform your business operations through AI. ";
  } else if (currentPage === 'about') {
    response += "I specialize in bringing AI automation to businesses of all sizes. ";
  } else if (currentPage === 'blog') {
    response += "Our case studies show how AI has transformed businesses just like yours. ";
  }
  
  // Add a suggestion based on their lead stage if we don't have a response yet
  if (!response) {
    const suggestion = generateSuggestedResponse(leadInfo);
    if (suggestion) {
      response = suggestion;
    } else {
      // Fallback generic response
      response = "Thanks for your message. How can I help you automate your business processes with AI today?";
    }
  }
  
  // Simulate a delay for a more natural conversation flow
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return response;
};
