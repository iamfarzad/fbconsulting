import { LeadInfo, LeadStage } from "../chat/messageTypes";

// Define progression of lead stages
const LEAD_STAGE_PROGRESSION: LeadStage[] = [
  'initial',
  'discovery',
  'evaluation',
  'decision',
  'implementation',
  'retention',
  // Alternative stages used in some components
  'qualification',
  'interested',
  'ready-to-book'
];

/**
 * Determine the lead stage based on message content and interaction history
 */
export const determineLeadStage = (messages: string[]): LeadStage => {
  if (!messages || messages.length === 0) {
    return 'initial';
  }
  
  // Very simple determination based on message count
  if (messages.length > 15) {
    return 'decision';
  } else if (messages.length > 10) {
    return 'evaluation';
  } else if (messages.length > 5) {
    return 'discovery';
  } else if (messages.length > 3) {
    return 'qualification';
  } else if (messages.length > 1) {
    return 'interested';
  }
  
  return 'initial';
};

/**
 * Update the lead stage based on new information
 */
export const updateLeadStage = (
  currentInfo: LeadInfo, 
  newStage?: LeadStage,
  bookingRequested?: boolean
): LeadInfo => {
  // Create a copy of the lead info
  const updatedInfo = { ...currentInfo };
  
  // If booking is requested, move to ready-to-book stage
  if (bookingRequested) {
    updatedInfo.stage = 'ready-to-book';
    return updatedInfo;
  }
  
  // If a specific stage is provided, use it
  if (newStage) {
    updatedInfo.stage = newStage;
    return updatedInfo;
  }
  
  // Otherwise, attempt to progress to the next stage
  const currentIndex = LEAD_STAGE_PROGRESSION.indexOf(currentInfo.stage);
  if (currentIndex >= 0 && currentIndex < LEAD_STAGE_PROGRESSION.length - 1) {
    updatedInfo.stage = LEAD_STAGE_PROGRESSION[currentIndex + 1];
  }
  
  return updatedInfo;
};
