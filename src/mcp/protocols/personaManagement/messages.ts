
/**
 * Persona Management Protocol Messages
 * Message creators for persona management operations
 */

import { Message } from '../../core/types';
import { 
  MessageType, 
  SetCurrentPersonaPayload,
  SetUserRolePayload,
  SetUserIndustryPayload,
  SetUserTechnicalLevelPayload,
  SetConversationContextPayload,
  SetCurrentPagePayload,
  PersonaType
} from './types';

// Create a message to set the current persona
export function createSetCurrentPersonaMessage(persona: PersonaType): Message<SetCurrentPersonaPayload> {
  return {
    type: MessageType.SET_CURRENT_PERSONA,
    payload: { persona }
  };
}

// Create a message to set the user role
export function createSetUserRoleMessage(role: string): Message<SetUserRolePayload> {
  return {
    type: MessageType.SET_USER_ROLE,
    payload: { role }
  };
}

// Create a message to set the user industry
export function createSetUserIndustryMessage(industry: string): Message<SetUserIndustryPayload> {
  return {
    type: MessageType.SET_USER_INDUSTRY,
    payload: { industry }
  };
}

// Create a message to set the user technical level
export function createSetUserTechnicalLevelMessage(
  level: 'beginner' | 'intermediate' | 'expert'
): Message<SetUserTechnicalLevelPayload> {
  return {
    type: MessageType.SET_USER_TECHNICAL_LEVEL,
    payload: { level }
  };
}

// Create a message to set the conversation context
export function createSetConversationContextMessage(context: string): Message<SetConversationContextPayload> {
  return {
    type: MessageType.SET_CONVERSATION_CONTEXT,
    payload: { context }
  };
}

// Create a message to set the current page
export function createSetCurrentPageMessage(page: string): Message<SetCurrentPagePayload> {
  return {
    type: MessageType.SET_CURRENT_PAGE,
    payload: { page }
  };
}

// Create a message to determine the optimal persona based on current data
export function createDetermineOptimalPersonaMessage(): Message {
  return {
    type: MessageType.DETERMINE_OPTIMAL_PERSONA
  };
}

// Create a message to reset the persona to default
export function createResetPersonaMessage(): Message {
  return {
    type: MessageType.RESET_PERSONA
  };
}
