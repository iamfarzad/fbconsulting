
import { trackEvent } from './analyticsService';

// Types for lead information extracted from conversations
export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  interests?: string[];
  challenges?: string[];
  budget?: string;
  timeframe?: string;
  stage?: 'discovery' | 'qualification' | 'interested' | 'ready-to-book';
  notes?: string;
}

// Types for AI message history
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Helper function to extract potential lead information from message content
export const extractLeadInfo = (message: string, currentInfo: LeadInfo = {}): LeadInfo => {
  const newInfo: LeadInfo = { ...currentInfo };
  
  // Basic email extraction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emailMatch = message.match(emailRegex);
  if (emailMatch && !newInfo.email) {
    newInfo.email = emailMatch[0].toLowerCase();
  }
  
  // Name extraction (look for common patterns like "I'm [Name]" or "my name is [Name]")
  const namePatterns = [
    /(?:I am|I'm|my name is|this is|call me) ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)?) here/i
  ];
  
  for (const pattern of namePatterns) {
    const nameMatch = message.match(pattern);
    if (nameMatch && nameMatch[1] && !newInfo.name) {
      newInfo.name = nameMatch[1].trim();
      break;
    }
  }
  
  // Company extraction
  const companyPatterns = [
    /(?:I work for|I work at|employed by|my company is|with) ([A-Za-z0-9][\w\s&.,-]+)/i,
    /([A-Za-z0-9][\w\s&.,-]+) (?:company|business|firm|agency|corporation)/i
  ];
  
  for (const pattern of companyPatterns) {
    const companyMatch = message.match(pattern);
    if (companyMatch && companyMatch[1] && !newInfo.company) {
      newInfo.company = companyMatch[1].trim();
      break;
    }
  }
  
  // Role/position extraction
  const rolePatterns = [
    /(?:I am|I'm|as) (?:an|a|the) ([A-Za-z][\w\s-]+) (?:at|for|of)/i,
    /(?:my role is|my position is|I work as) (?:an|a|the) ([A-Za-z][\w\s-]+)/i
  ];
  
  for (const pattern of rolePatterns) {
    const roleMatch = message.match(pattern);
    if (roleMatch && roleMatch[1] && !newInfo.role) {
      newInfo.role = roleMatch[1].trim();
      break;
    }
  }
  
  // Interest detection
  const interestKeywords = {
    'chatbot': 'AI Chatbots',
    'chat': 'AI Chatbots',
    'automate': 'Workflow Automation',
    'automation': 'Workflow Automation',
    'workflow': 'Workflow Automation',
    'strategy': 'AI Strategy',
    'planning': 'AI Strategy',
    'roadmap': 'AI Strategy',
    'content': 'Content Generation',
    'generate': 'Content Generation',
    'writing': 'Content Generation',
    'data': 'Data Analysis',
    'analytics': 'Data Analysis',
    'analysis': 'Data Analysis'
  };
  
  const interests = new Set(newInfo.interests || []);
  
  Object.entries(interestKeywords).forEach(([keyword, service]) => {
    if (message.toLowerCase().includes(keyword.toLowerCase())) {
      interests.add(service);
    }
  });
  
  if (interests.size > 0) {
    newInfo.interests = Array.from(interests);
  }
  
  // Challenge detection
  const challengeKeywords = {
    'slow': 'Process Efficiency',
    'inefficient': 'Process Efficiency',
    'manual': 'Manual Processes',
    'time consuming': 'Time Management',
    'expensive': 'Cost Reduction',
    'cost': 'Cost Reduction',
    'error': 'Error Reduction',
    'mistake': 'Error Reduction',
    'customer service': 'Customer Experience',
    'customer experience': 'Customer Experience',
    'scale': 'Scaling Operations',
    'growing': 'Scaling Operations',
    'expansion': 'Scaling Operations'
  };
  
  const challenges = new Set(newInfo.challenges || []);
  
  Object.entries(challengeKeywords).forEach(([keyword, challenge]) => {
    if (message.toLowerCase().includes(keyword.toLowerCase())) {
      challenges.add(challenge);
    }
  });
  
  if (challenges.size > 0) {
    newInfo.challenges = Array.from(challenges);
  }
  
  // Determine lead stage
  if (!newInfo.stage) {
    // Start at discovery by default
    newInfo.stage = 'discovery';
  } else if (newInfo.stage === 'discovery' && 
    (newInfo.interests?.length || newInfo.challenges?.length)) {
    // Move to qualification when we know their interests or challenges
    newInfo.stage = 'qualification';
  } else if (newInfo.stage === 'qualification' && 
    (message.toLowerCase().includes('price') || 
     message.toLowerCase().includes('cost') || 
     message.toLowerCase().includes('how much') ||
     message.toLowerCase().includes('interested'))) {
    // Move to interested when they ask about pricing or express interest
    newInfo.stage = 'interested';
  } else if (newInfo.stage === 'interested' && 
    (message.toLowerCase().includes('book') || 
     message.toLowerCase().includes('schedule') || 
     message.toLowerCase().includes('appointment') ||
     message.toLowerCase().includes('call') ||
     message.toLowerCase().includes('meet'))) {
    // Move to ready-to-book when they want to schedule something
    newInfo.stage = 'ready-to-book';
  }
  
  // Track if we gathered new lead information
  const hadChanges = JSON.stringify(currentInfo) !== JSON.stringify(newInfo);
  if (hadChanges) {
    trackEvent({
      action: 'lead_information_updated',
      category: 'chatbot',
      label: 'lead_data',
      lead_stage: newInfo.stage,
      has_name: !!newInfo.name,
      has_email: !!newInfo.email,
      has_company: !!newInfo.company,
      interest_count: newInfo.interests?.length || 0,
      challenge_count: newInfo.challenges?.length || 0
    });
  }
  
  return newInfo;
};

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

// Save conversation history to localStorage
export const saveConversationHistory = (messages: AIMessage[]): void => {
  try {
    localStorage.setItem('aiConversationHistory', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save conversation history:', error);
  }
};

// Load conversation history from localStorage
export const loadConversationHistory = (): AIMessage[] => {
  try {
    const saved = localStorage.getItem('aiConversationHistory');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load conversation history:', error);
    return [];
  }
};

// Save lead information to localStorage
export const saveLeadInfo = (leadInfo: LeadInfo): void => {
  try {
    localStorage.setItem('aiLeadInfo', JSON.stringify(leadInfo));
  } catch (error) {
    console.error('Failed to save lead information:', error);
  }
};

// Load lead information from localStorage
export const loadLeadInfo = (): LeadInfo => {
  try {
    const saved = localStorage.getItem('aiLeadInfo');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load lead information:', error);
    return {};
  }
};

