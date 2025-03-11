
import { LeadInfo } from '../lead/leadExtractor';

// Function to determine the persona based on conversation and lead data
export const determinePersona = (leadInfo: LeadInfo, currentPage?: string): 'strategist' | 'technical' | 'consultant' | 'general' => {
  // Default to helper persona
  if (currentPage === 'services') {
    return 'consultant';
  } else if (currentPage === 'about') {
    return 'strategist';
  } else if (currentPage?.includes('blog')) {
    return 'technical';
  }
  
  return 'general';
};

// Function to generate a suggested response based on lead info
export const generateSuggestedResponse = (leadInfo: LeadInfo): string | null => {
  // If we have interests, suggest a response based on the first interest
  if (leadInfo.interests && leadInfo.interests.length > 0) {
    const lastInterest = leadInfo.interests[leadInfo.interests.length - 1].toLowerCase();
    
    if (lastInterest.includes('service') || lastInterest.includes('help') || lastInterest.includes('offer')) {
      return "I'm interested in learning more about your services.";
    }
    
    if (lastInterest.includes('cost') || lastInterest.includes('price')) {
      return "Can you tell me about your pricing options?";
    }
    
    if (lastInterest.includes('contact') || lastInterest.includes('talk')) {
      return "I'd like to schedule a consultation.";
    }
  }
  
  // Default suggestion
  return "Can you tell me more about how your AI solutions work?";
};

// Function to check if message contains information request keywords
const containsInfoRequest = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    lowercaseMsg.includes('service') || 
    lowercaseMsg.includes('about you') || 
    lowercaseMsg.includes('experience') ||
    lowercaseMsg.includes('timeline') ||
    lowercaseMsg.includes('background') ||
    lowercaseMsg.includes('what do you do')
  );
};

// Function to check if user is explicitly asking about services
const isAskingAboutServices = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    (lowercaseMsg.includes('service') && (
      lowercaseMsg.includes('what') || 
      lowercaseMsg.includes('tell me about') || 
      lowercaseMsg.includes('show me') ||
      lowercaseMsg.includes('list') ||
      lowercaseMsg.includes('explain')
    )) ||
    lowercaseMsg.includes('what do you offer') ||
    lowercaseMsg.includes('what services do you') ||
    lowercaseMsg.includes('what do you do')
  );
};

// Function to check if user is explicitly asking about background/about
const isAskingAboutBackground = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    (lowercaseMsg.includes('about') && (
      lowercaseMsg.includes('you') || 
      lowercaseMsg.includes('your') || 
      lowercaseMsg.includes('tell me')
    )) ||
    lowercaseMsg.includes('who are you') ||
    lowercaseMsg.includes('background') ||
    lowercaseMsg.includes('experience') ||
    lowercaseMsg.includes('tell me about yourself')
  );
};

// Function to check if user is explicitly asking about timeline/history
const isAskingAboutTimeline = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    lowercaseMsg.includes('timeline') ||
    lowercaseMsg.includes('history') ||
    (lowercaseMsg.includes('experience') && (
      lowercaseMsg.includes('how much') || 
      lowercaseMsg.includes('how long') || 
      lowercaseMsg.includes('years')
    )) ||
    lowercaseMsg.includes('journey') ||
    lowercaseMsg.includes('career path')
  );
};

// Function to generate graphic cards based on user query
export const generateGraphicCards = (message: string): string => {
  let cardContent = '';
  
  if (isAskingAboutServices(message)) {
    cardContent += '[[CARD:services:AI Automation Services:Explore our range of AI solutions for business automation and growth.]]';
  }
  
  if (isAskingAboutBackground(message)) {
    cardContent += '[[CARD:about:About Us:Learn about our experience and expertise in AI development.]]';
  }
  
  if (isAskingAboutTimeline(message)) {
    cardContent += '[[CARD:timeline:Our Journey:View our professional timeline and key achievements over the years.]]';
  }
  
  return cardContent;
};

// Generate an AI response based on the user message and lead info
export const generateResponse = (message: string, leadInfo: LeadInfo): string => {
  const lowercaseMsg = message.toLowerCase();
  let response = '';
  
  // Check if user is explicitly asking for information that would benefit from graphic cards
  if (isAskingAboutServices(message) || isAskingAboutBackground(message) || isAskingAboutTimeline(message)) {
    const cardContent = generateGraphicCards(message);
    
    if (isAskingAboutServices(message)) {
      response = "I'd be happy to tell you about our services. We offer AI automation, chatbot development, data analysis, and custom AI solutions. You can explore more details by clicking the card below:";
    } else if (isAskingAboutBackground(message)) {
      response = "We're a team of AI specialists with expertise in creating custom solutions for businesses. You can learn more about us by clicking the card below:";
    } else if (isAskingAboutTimeline(message)) {
      response = "Our team has over 10 years of combined experience in AI development. You can view our journey and key milestones by clicking the card below:";
    } else {
      response = "Here's some information that might help you:";
    }
    
    return response + "\n\n" + cardContent;
  }
  
  // Default responses for common queries
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi ')) {
    return "Hello! I'm your AI assistant. How can I help you today? I can tell you about our services, our background, or how we can help your business grow with AI.";
  }
  
  if (lowercaseMsg.includes('thank')) {
    return "You're welcome! Is there anything else you'd like to know about our AI services or expertise?";
  }
  
  // General fallback response
  return "Thank you for your message. I'd be happy to help you with that. Is there anything specific about our AI services or expertise you'd like to know more about?";
};
