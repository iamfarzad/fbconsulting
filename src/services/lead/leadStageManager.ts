
import { LeadStage } from '../chat/messageTypes';
import { LeadInfo } from './leadExtractor';

/**
 * Determines a lead stage based on message content and patterns
 * @param messages Array of message contents (strings)
 * @returns A lead stage identifier
 */
export const determineLeadStage = (messages: string[]): LeadStage => {
  // Join all messages for analysis
  const allText = messages.join(' ').toLowerCase();
  
  // Check for booking/consultation signals
  if (allText.includes('schedule') || 
      allText.includes('book a') || 
      allText.includes('consultation') ||
      allText.includes('appointment') ||
      allText.includes('let\'s talk') ||
      allText.includes('meet with you')) {
    return 'ready-to-book';
  }
  
  // Check for high interest signals
  if (allText.includes('pricing') || 
      allText.includes('cost') || 
      allText.includes('how much') ||
      allText.includes('interested in') ||
      allText.includes('consider')) {
    return 'interested';
  }
  
  // Check for qualification signals
  if (allText.includes('my company') || 
      allText.includes('our business') || 
      allText.includes('we need') ||
      allText.includes('specific requirements') ||
      allText.includes('our project')) {
    return 'qualification';
  }
  
  // Check for evaluation signals
  if (allText.includes('compare') || 
      allText.includes('versus') || 
      allText.includes('vs') ||
      allText.includes('alternatives') ||
      allText.includes('different options')) {
    return 'evaluation';
  }
  
  // Check for discovery signals
  if (allText.includes('how does') || 
      allText.includes('what is') || 
      allText.includes('tell me about') ||
      allText.includes('explain') ||
      allText.includes('example')) {
    return 'discovery';
  }
  
  // Default to initial stage
  return 'initial';
};

/**
 * Updates a lead's stage based on current information
 * @param leadInfo Current lead information
 * @returns Updated lead stage
 */
export const updateLeadStage = (leadInfo: LeadInfo): LeadStage => {
  // Use the interests to determine stage
  const currentStage = leadInfo.stage as LeadStage;
  const interests = leadInfo.interests || [];
  
  // If no interests, return current stage
  if (interests.length === 0) {
    return currentStage;
  }
  
  // Determine a new stage based on interests
  const newStage = determineLeadStage(interests);
  
  // Progressive stage advancement (never go backward in the funnel)
  const stages: LeadStage[] = ['initial', 'discovery', 'qualification', 'evaluation', 'interested', 'ready-to-book'];
  const currentIndex = stages.indexOf(currentStage);
  const newIndex = stages.indexOf(newStage);
  
  // Only advance stage, never go back
  return newIndex > currentIndex ? newStage : currentStage;
};
