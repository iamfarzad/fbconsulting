
// Lead extraction service

import { AIMessage, LeadStage } from '../chat/messageTypes';

// Lead information interface
export interface LeadInfo {
  interests: string[];
  stage: LeadStage;
  name?: string;
  email?: string;
  company?: string;
  position?: string;
  source?: string;
  notes?: string;
  phone?: string; // Added to fix missing property error
}

// Extract lead information from chat messages
export const extractLeadInfo = (messages: AIMessage[]): LeadInfo => {
  // Default lead info with minimal required properties
  let leadInfo: LeadInfo = {
    interests: [],
    stage: 'discovery'
  };

  // Skip if there are no messages
  if (!messages || messages.length === 0) {
    return leadInfo;
  }

  // Extract interests from user messages
  const userMessages = messages.filter(m => m.role === 'user');
  leadInfo.interests = userMessages.map(m => m.content);

  // Use a basic approach to determine lead stage based on message count
  if (userMessages.length >= 10) {
    leadInfo.stage = 'decision';
  } else if (userMessages.length >= 5) {
    leadInfo.stage = 'evaluation';
  } else if (userMessages.length >= 2) {
    leadInfo.stage = 'discovery';
  } else {
    leadInfo.stage = 'initial';
  }

  // Look for potential contact information in the messages
  const content = messages.map(m => m.content.toLowerCase()).join(' ');
  
  // Simple email detection
  const emailMatch = content.match(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    leadInfo.email = emailMatch[0];
  }

  // Simple name detection (very basic)
  const nameMatch = content.match(/my name is (\w+)/i);
  if (nameMatch && nameMatch[1]) {
    leadInfo.name = nameMatch[1];
  }

  // Simple company detection
  const companyMatch = content.match(/work (?:for|at) ([^,.]+)/i);
  if (companyMatch && companyMatch[1]) {
    leadInfo.company = companyMatch[1].trim();
  }

  return leadInfo;
};

// Helper function to categorize lead readiness
export const categorizeLeadReadiness = (leadInfo: LeadInfo): 'cold' | 'warm' | 'hot' => {
  if (leadInfo.stage === 'decision' || leadInfo.stage === 'implementation') {
    return 'hot';
  } else if (leadInfo.stage === 'evaluation') {
    return 'warm';
  } else {
    return 'cold';
  }
};
