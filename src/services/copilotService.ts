
// Re-export all functionality from the new modular structure
// This maintains backward compatibility with existing code

// Lead extraction
export { extractLeadInfo } from './lead/leadExtractor';
export type { LeadInfo } from './lead/leadExtractor';

// Lead stage management
export { determineLeadStage, updateLeadStage } from './lead/leadStageManager';

// Response generation
export { generateSuggestedResponse, determinePersona } from './chat/responseGenerator';

// Message types
export type { AIMessage } from './chat/messageTypes';

// Storage management
export {
  saveConversationHistory,
  loadConversationHistory,
  saveLeadInfo,
  loadLeadInfo
} from './storage/localStorageManager';
