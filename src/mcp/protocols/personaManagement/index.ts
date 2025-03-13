
/**
 * Persona Management Protocol
 * Protocol for managing AI assistant personas based on user context
 */

import { Protocol, Handler } from '../../core/types';
import { 
  PersonaData, 
  PersonaManagementContext, 
  defaultContext, 
  MessageType,
  defaultPersonaDefinitions
} from './types';

import {
  setCurrentPersonaHandler,
  setUserRoleHandler,
  setUserIndustryHandler,
  setUserTechnicalLevelHandler,
  setConversationContextHandler,
  setCurrentPageHandler,
  resetPersonaHandler
} from './handlers/basicHandlers';

import { determineOptimalPersonaHandler } from './handlers/determinePersonaHandler';

// Export all types and message creators
export * from './types';
export * from './messages';

// Protocol handlers mapping
const handlers: Record<string, Handler<PersonaData, PersonaManagementContext>> = {
  [MessageType.SET_CURRENT_PERSONA]: setCurrentPersonaHandler,
  [MessageType.SET_USER_ROLE]: setUserRoleHandler,
  [MessageType.SET_USER_INDUSTRY]: setUserIndustryHandler,
  [MessageType.SET_USER_TECHNICAL_LEVEL]: setUserTechnicalLevelHandler,
  [MessageType.SET_CONVERSATION_CONTEXT]: setConversationContextHandler,
  [MessageType.SET_CURRENT_PAGE]: setCurrentPageHandler,
  [MessageType.DETERMINE_OPTIMAL_PERSONA]: determineOptimalPersonaHandler,
  [MessageType.RESET_PERSONA]: resetPersonaHandler,
  // Special handler for model updates from async operations
  '__MODEL_UPDATE__': (model, context, message) => message.payload as PersonaData
};

// Create protocol
export function createPersonaManagementProtocol(
  initialData: Partial<PersonaData> = {}
): Protocol<PersonaData, PersonaManagementContext> {
  return {
    initialModel: {
      currentPersona: 'general',
      personaDefinitions: defaultPersonaDefinitions,
      ...initialData,
      lastUpdated: new Date().toISOString()
    } as PersonaData,
    context: defaultContext,
    handlers
  };
}
