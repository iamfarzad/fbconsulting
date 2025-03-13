// Re-export all functionality from the new modular structure
// This maintains backward compatibility with existing code

// Core functionality
export { 
  initializeAzureAI, 
  testAzureConnection, 
  getDefaultSystemInstructions 
} from './copilot/azureService';

export type { AzureAIConfig } from './copilot/azureService';

// Deployment tracking
export {
  getDeploymentStatus,
  updateDeploymentStatus,
  isModelReady,
  getAllDeploymentStatuses
} from './copilot/deploymentService';

export type { DeploymentStatus } from './copilot/deploymentService';

// Lead extraction (keeping backward compatibility)
export { extractLeadInfo } from './lead/leadExtractor';
export type { LeadInfo } from './lead/leadExtractor';

// Lead stage management (keeping backward compatibility)
export { determineLeadStage, updateLeadStage } from './lead/leadStageManager';

// Response generation (keeping backward compatibility)
export { generateSuggestedResponse, determinePersona } from './chat/responseGenerator';

// Message types (keeping backward compatibility)
export type { AIMessage } from './chat/messageTypes';

// Storage management (keeping backward compatibility)
export {
  saveConversationHistory,
  loadConversationHistory,
  saveLeadInfo,
  loadLeadInfo
} from './storage/localStorageManager';
