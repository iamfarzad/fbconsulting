
import { LeadInfo } from './leadExtractor';

// Determine lead stage based on message content
export const determineLeadStage = (
  messages: string[]
): LeadInfo['stage'] => {
  const joinedMessages = messages.join(' ').toLowerCase();
  
  if (joinedMessages.includes('book') || 
      joinedMessages.includes('schedule') || 
      joinedMessages.includes('appointment')) {
    return 'ready-to-book';
  } 
  
  if (joinedMessages.includes('price') || 
      joinedMessages.includes('cost') || 
      joinedMessages.includes('how much')) {
    return 'interested';
  } 
  
  if (joinedMessages.includes('help') || 
      joinedMessages.includes('problem') || 
      messages.length > 2) {
    return 'discovery';
  }
  
  return 'initial';
};

// Update lead stage based on new information
export const updateLeadStage = (
  currentStage: LeadInfo['stage'],
  newMessages: string[]
): LeadInfo['stage'] => {
  const newStage = determineLeadStage(newMessages);
  
  // Stage progression logic
  const stageProgression: Record<string, number> = {
    'initial': 0,
    'discovery': 1,
    'qualification': 2,
    'interested': 3,
    'evaluation': 4,
    'decision': 5,
    'ready-to-book': 6,
    'implementation': 7,
    'retention': 8
  };
  
  // Only progress to later stages, never go backward
  if (!currentStage || 
      stageProgression[newStage] > stageProgression[currentStage]) {
    return newStage;
  }
  
  return currentStage;
};

export default {
  determineLeadStage,
  updateLeadStage
};
