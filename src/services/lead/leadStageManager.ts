import { LeadInfo } from './leadExtractor';

// Determine lead stage based on message content and current stage
export const determineLeadStage = (message: string, currentStage?: 'discovery' | 'qualification' | 'interested' | 'ready-to-book'): 'discovery' | 'qualification' | 'interested' | 'ready-to-book' => {
  // Start at discovery by default
  if (!currentStage) {
    return 'discovery';
  }
  
  // Move to qualification when we know their interests or challenges
  if (currentStage === 'discovery' && 
    (message.toLowerCase().includes('interest') || 
     message.toLowerCase().includes('challenge') ||
     message.toLowerCase().includes('problem') ||
     message.toLowerCase().includes('issue'))) {
    return 'qualification';
  }
  
  // Move to interested when they ask about pricing or express interest
  if (currentStage === 'qualification' && 
    (message.toLowerCase().includes('price') || 
     message.toLowerCase().includes('cost') || 
     message.toLowerCase().includes('how much') ||
     message.toLowerCase().includes('interested'))) {
    return 'interested';
  }
  
  // Move to ready-to-book when they want to schedule something
  if (currentStage === 'interested' && 
    (message.toLowerCase().includes('book') || 
     message.toLowerCase().includes('schedule') || 
     message.toLowerCase().includes('appointment') ||
     message.toLowerCase().includes('call') ||
     message.toLowerCase().includes('meet'))) {
    return 'ready-to-book';
  }
  
  // Keep current stage if no transition is triggered
  return currentStage;
};

// Update lead stage based on message content
export const updateLeadStage = (message: string, leadInfo: LeadInfo): LeadInfo => {
  const newStage = determineLeadStage(message, leadInfo.stage);
  if (newStage !== leadInfo.stage) {
    return { ...leadInfo, stage: newStage };
  }
  return leadInfo;
};

// Note: Use environment variables for sensitive information
