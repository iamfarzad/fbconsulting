
import { LeadInfo } from "@/services/lead/leadExtractor";

// Function to generate AI responses
export const generateResponse = (userMessage: string, leadInfo: LeadInfo): string => {
  const message = userMessage.toLowerCase();
  
  // Add specific card information based on user query
  if (message.includes('service') || message.includes('what do you offer') || message.includes('help with')) {
    return `I offer several AI automation services that can help your business. Here are the main ones:\n\n[[CARD:services:AI Strategy Consulting:I help businesses identify opportunities for AI integration and develop implementation roadmaps:bordered]]\n\n[[CARD:services:Custom AI Development:Building tailored AI solutions for your specific business needs:minimal]]\n\nIs there a specific service you're interested in?`;
  }
  
  if (message.includes('about') || message.includes('who are you') || message.includes('background')) {
    return `I'm an AI automation consultant with a background in machine learning and business transformation. Learn more about me:\n\n[[CARD:about:My Background:Over 10 years experience in AI and machine learning implementation]]\n\n[[CARD:skills:Technical Skills:Proficient in Python, TensorFlow, and natural language processing]]`;
  }
  
  if (message.includes('contact') || message.includes('book') || message.includes('consultation') || message.includes('meeting')) {
    return `I'd be happy to schedule a consultation with you. Here's how you can book a meeting:\n\n[[CARD:booking:Book a Consultation:Schedule a 30-minute discovery call to discuss your AI needs:bordered]]`;
  }
  
  if (message.includes('newsletter') || message.includes('updates') || message.includes('subscribe')) {
    return `Stay updated with the latest in AI automation by subscribing to my newsletter:\n\n[[CARD:newsletter:AI Insights Newsletter:Monthly updates on AI trends, case studies, and tips:minimal]]`;
  }
  
  if (message.includes('clients') || message.includes('testimonial') || message.includes('worked with')) {
    return `I've worked with various clients across industries. Here's what some of them say:\n\n[[CARD:testimonials:Client Testimonials:Read success stories from businesses I've helped transform with AI]]`;
  }
  
  if (message.includes('timeline') || message.includes('history') || message.includes('journey')) {
    return `My journey in AI has spanned over a decade. Check out my career timeline:\n\n[[CARD:timeline:AI Journey:Explore my professional path and key milestones in AI development]]`;
  }
  
  if (message.includes('email') || message.includes('summary') || message.includes('send me')) {
    return `I'd be happy to email you a summary of our conversation. Please provide your email address:\n\n[[FORM:email-summary]]`;
  }
  
  // Default response if no specific keywords are matched
  return "I'm here to help with your AI automation needs. Feel free to ask about my services, background, or book a consultation.";
};

// Function to determine the AI persona based on lead info and current page
export const determinePersona = (
  leadInfo: LeadInfo, 
  currentPage?: string
): 'strategist' | 'technical' | 'consultant' | 'general' => {
  // Determine persona based on interests if available
  if (leadInfo.interests && leadInfo.interests.length > 0) {
    const interests = leadInfo.interests.join(' ').toLowerCase();
    
    // Check for technical interests
    if (
      interests.includes('code') || 
      interests.includes('development') || 
      interests.includes('programming') ||
      interests.includes('technical') ||
      interests.includes('technology')
    ) {
      return 'technical';
    }
    
    // Check for strategy interests
    if (
      interests.includes('strategy') || 
      interests.includes('planning') || 
      interests.includes('roadmap') ||
      interests.includes('vision') ||
      interests.includes('future')
    ) {
      return 'strategist';
    }
    
    // Check for consulting interests
    if (
      interests.includes('advice') || 
      interests.includes('consulting') || 
      interests.includes('guidance') ||
      interests.includes('recommend') ||
      interests.includes('suggestion')
    ) {
      return 'consultant';
    }
  }
  
  // Fallback to page-based personas
  if (currentPage) {
    switch (currentPage.toLowerCase()) {
      case 'services':
        return 'consultant';
      case 'about':
        return 'strategist';
      case 'contact':
        return 'consultant';
      default:
        return 'general';
    }
  }
  
  // Default to general persona
  return 'general';
};

// Function to generate suggested responses based on lead info
export const generateSuggestedResponse = (leadInfo: LeadInfo): string | null => {
  // If we don't have enough lead info yet, don't suggest anything
  if (!leadInfo || !leadInfo.stage) {
    return null;
  }
  
  // Provide different suggestions based on lead stage
  switch (leadInfo.stage) {
    case 'discovery':
      return "What specific challenges are you facing with AI implementation?";
    case 'qualification':
      return "Would you like to learn more about how our AI solutions could help your business?";
    case 'interested':
      return "Would you like to schedule a consultation to discuss your needs in detail?";
    case 'ready-to-book':
      return "Great! When would be a good time for a consultation?";
    default:
      return "How can I help you with AI automation today?";
  }
};
