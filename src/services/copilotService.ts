// Re-export functionality from the Gemini service module

// Core Gemini functionality
export { 
  initializeGemini,
  sendGeminiChatRequest,
  streamGeminiChat,
  sendMultimodalRequest,
  convertToGeminiMessages,
  DEFAULT_CONFIG,
  DEFAULT_SAFETY_SETTINGS
} from './gemini';

// Re-export types with the 'type' keyword
export type { GeminiMessage, GeminiConfig } from './gemini';

// Message types (keeping backward compatibility)
export type { AIMessage } from './chat/messageTypes';

// Storage management (keeping backward compatibility)
export {
  saveConversationHistory,
  loadConversationHistory,
  saveLeadInfo,
  loadLeadInfo
} from './storage/localStorageManager';

// Lead extraction (keeping backward compatibility)
export { extractLeadInfo } from './lead/leadExtractor';
export type { LeadInfo } from './lead/leadExtractor';

// Lead stage management (keeping backward compatibility)
export { determineLeadStage, updateLeadStage } from './lead/leadStageManager';

// Response generation (keeping backward compatibility)
export { generateSuggestedResponse, determinePersona } from './chat/responseGenerator';
