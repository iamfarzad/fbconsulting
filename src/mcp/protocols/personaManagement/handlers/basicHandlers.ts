
/**
 * Basic Persona Management Protocol Handlers
 * Handlers for simple persona management operations
 */

import { Model } from '../../../core/types';
import { 
  PersonaData, 
  PersonaManagementContext,
  SetCurrentPersonaPayload,
  SetUserRolePayload,
  SetUserIndustryPayload,
  SetUserTechnicalLevelPayload,
  SetConversationContextPayload,
  SetCurrentPagePayload,
  MessageType
} from '../types';

// Handler to set the current persona
export const setCurrentPersonaHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: { type: string; payload?: SetCurrentPersonaPayload }
): PersonaData => {
  if (!message.payload) return model;
  
  return {
    ...model,
    currentPersona: message.payload.persona,
    lastUpdated: new Date().toISOString()
  };
};

// Handler to set the user role
export const setUserRoleHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: { type: string; payload?: SetUserRolePayload }
): PersonaData => {
  if (!message.payload) return model;
  
  return {
    ...model,
    userRole: message.payload.role,
    lastUpdated: new Date().toISOString()
  };
};

// Handler to set the user industry
export const setUserIndustryHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: { type: string; payload?: SetUserIndustryPayload }
): PersonaData => {
  if (!message.payload) return model;
  
  return {
    ...model,
    userIndustry: message.payload.industry,
    lastUpdated: new Date().toISOString()
  };
};

// Handler to set the user technical level
export const setUserTechnicalLevelHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: { type: string; payload?: SetUserTechnicalLevelPayload }
): PersonaData => {
  if (!message.payload) return model;
  
  return {
    ...model,
    userTechnicalLevel: message.payload.level,
    lastUpdated: new Date().toISOString()
  };
};

// Handler to set the conversation context
export const setConversationContextHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: { type: string; payload?: SetConversationContextPayload }
): PersonaData => {
  if (!message.payload) return model;
  
  return {
    ...model,
    conversationContext: message.payload.context,
    lastUpdated: new Date().toISOString()
  };
};

// Handler to set the current page
export const setCurrentPageHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: { type: string; payload?: SetCurrentPagePayload }
): PersonaData => {
  if (!message.payload) return model;
  
  return {
    ...model,
    currentPage: message.payload.page,
    lastUpdated: new Date().toISOString()
  };
};

// Handler to reset the persona to default (general)
export const resetPersonaHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext
): PersonaData => {
  return {
    ...model,
    currentPersona: 'general',
    lastUpdated: new Date().toISOString()
  };
};
