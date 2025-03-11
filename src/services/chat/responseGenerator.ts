
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

    if (lastInterest.includes('newsletter') || lastInterest.includes('subscribe')) {
      return "I'd like to subscribe to your newsletter.";
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

// Function to check if user is asking to book a meeting
const isAskingToBookMeeting = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    lowercaseMsg.includes('book') ||
    lowercaseMsg.includes('schedule') ||
    lowercaseMsg.includes('appointment') ||
    lowercaseMsg.includes('meeting') ||
    lowercaseMsg.includes('consultation') ||
    lowercaseMsg.includes('call') ||
    (lowercaseMsg.includes('talk') && lowercaseMsg.includes('you'))
  );
};

// Function to check if user wants to sign up for newsletter
const isAskingForNewsletter = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    lowercaseMsg.includes('newsletter') ||
    lowercaseMsg.includes('subscribe') ||
    lowercaseMsg.includes('updates') ||
    lowercaseMsg.includes('email me') ||
    (lowercaseMsg.includes('sign') && lowercaseMsg.includes('up'))
  );
};

// Function to check if user is asking about technologies or skills
const isAskingAboutSkills = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    lowercaseMsg.includes('skills') ||
    lowercaseMsg.includes('technologies') ||
    lowercaseMsg.includes('tech stack') ||
    lowercaseMsg.includes('tools') ||
    lowercaseMsg.includes('what you use') ||
    lowercaseMsg.includes('software') ||
    lowercaseMsg.includes('framework')
  );
};

// Function to check if user is asking about testimonials
const isAskingAboutTestimonials = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    lowercaseMsg.includes('testimonial') ||
    lowercaseMsg.includes('review') ||
    lowercaseMsg.includes('feedback') ||
    lowercaseMsg.includes('client') ||
    lowercaseMsg.includes('customer') ||
    lowercaseMsg.includes('success') ||
    lowercaseMsg.includes('case study')
  );
};

// Function to check if user wants email summary of conversation
const isAskingForEmailSummary = (message: string): boolean => {
  const lowercaseMsg = message.toLowerCase();
  
  return (
    (lowercaseMsg.includes('email') && (
      lowercaseMsg.includes('summary') ||
      lowercaseMsg.includes('conversation') ||
      lowercaseMsg.includes('send') ||
      lowercaseMsg.includes('copy')
    )) ||
    lowercaseMsg.includes('transcript') ||
    lowercaseMsg.includes('record') ||
    (lowercaseMsg.includes('save') && lowercaseMsg.includes('chat'))
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
  
  if (isAskingToBookMeeting(message)) {
    cardContent += '[[CARD:booking:Book a Consultation:Schedule a free 30-minute consultation to discuss your AI needs.]]';
  }
  
  if (isAskingForNewsletter(message)) {
    cardContent += '[[CARD:newsletter:Subscribe to Newsletter:Get the latest AI insights and updates delivered to your inbox.]]';
  }

  if (isAskingAboutSkills(message)) {
    cardContent += '[[CARD:skills:Technologies & Skills:Discover the AI technologies and skills we specialize in.]]';
  }

  if (isAskingAboutTestimonials(message)) {
    cardContent += '[[CARD:testimonials:Client Success Stories:Read what our clients have to say about our AI solutions.]]';
  }
  
  return cardContent;
};

// Generate an AI response based on the user message and lead info
export const generateResponse = (message: string, leadInfo: LeadInfo): string => {
  const lowercaseMsg = message.toLowerCase();
  let response = '';
  
  // Check if user is explicitly asking for information that would benefit from graphic cards
  if (isAskingAboutServices(message) || isAskingAboutBackground(message) || isAskingAboutTimeline(message) || 
      isAskingToBookMeeting(message) || isAskingForNewsletter(message) || isAskingAboutSkills(message) || 
      isAskingAboutTestimonials(message)) {
    
    const cardContent = generateGraphicCards(message);
    
    if (isAskingAboutServices(message)) {
      response = "I'd be happy to tell you about our services. We offer AI automation, chatbot development, data analysis, and custom AI solutions. You can explore more details by clicking the card below:";
    } else if (isAskingAboutBackground(message)) {
      response = "We're a team of AI specialists with expertise in creating custom solutions for businesses. You can learn more about us by clicking the card below:";
    } else if (isAskingAboutTimeline(message)) {
      response = "Our team has over 10 years of combined experience in AI development. You can view our journey and key milestones by clicking the card below:";
    } else if (isAskingToBookMeeting(message)) {
      response = "I'd be happy to help you schedule a consultation with our team. You can book a time by clicking the card below:";
    } else if (isAskingForNewsletter(message)) {
      response = "Great! You can subscribe to our newsletter to receive the latest AI trends and insights. Just click the card below to sign up:";
    } else if (isAskingAboutSkills(message)) {
      response = "Our team specializes in various AI technologies including natural language processing, machine learning, and data analytics. You can learn more about our skills by clicking the card below:";
    } else if (isAskingAboutTestimonials(message)) {
      response = "We've had the pleasure of working with many satisfied clients. You can read some of their success stories by clicking the card below:";
    } else {
      response = "Here's some information that might help you:";
    }
    
    return response + "\n\n" + cardContent;
  }

  if (isAskingForEmailSummary(message)) {
    return "I'd be happy to email you a summary of our conversation. Please provide your email address, and I'll send it right over. [[FORM:email-summary]]";
  }
  
  // Default responses for common queries
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi ')) {
    return "Hello! I'm your AI assistant. How can I help you today? I can tell you about our services, our background, schedule a meeting, or help you subscribe to our newsletter.";
  }
  
  if (lowercaseMsg.includes('thank')) {
    return "You're welcome! Is there anything else you'd like to know about our AI services or expertise? I can also help you book a consultation or send you a summary of our conversation via email.";
  }
  
  // General fallback response
  return "Thank you for your message. I'd be happy to help you with that. Is there anything specific about our AI services, booking a consultation, or subscribing to our newsletter that you'd like to know more about?";
};
