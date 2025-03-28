import { trackEvent } from '../analyticsService';

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

// Note: Use environment variables for sensitive information
