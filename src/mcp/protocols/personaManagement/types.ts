
/**
 * Persona Management Protocol Types
 * Type definitions for AI persona customization based on user role
 */

import { Context } from '../../core/types';

// Available persona types
export type PersonaType = 'strategist' | 'technical' | 'consultant' | 'general';

// Persona data model
export interface PersonaData {
  // Current active persona
  currentPersona: PersonaType;
  
  // User information influencing persona selection
  userRole?: string;
  userIndustry?: string;
  userTechnicalLevel?: 'beginner' | 'intermediate' | 'expert';
  
  // Context of interaction
  currentPage?: string;
  conversationContext?: string;
  
  // Persona definitions and characteristics
  personaDefinitions: {
    [key in PersonaType]: {
      name: string;
      description: string;
      tone: string;
      focusAreas: string[];
      samplePhrases: string[];
    }
  };
  
  // Technical metadata
  lastUpdated?: string;
  error?: string;
}

// Context for persona operations
export interface PersonaManagementContext extends Context {
  // Could include services for tone analysis, etc.
}

// Default context 
export const defaultContext: PersonaManagementContext = {};

// Message types for the protocol
export enum MessageType {
  SET_CURRENT_PERSONA = 'SET_CURRENT_PERSONA',
  SET_USER_ROLE = 'SET_USER_ROLE',
  SET_USER_INDUSTRY = 'SET_USER_INDUSTRY',
  SET_USER_TECHNICAL_LEVEL = 'SET_USER_TECHNICAL_LEVEL',
  SET_CONVERSATION_CONTEXT = 'SET_CONVERSATION_CONTEXT',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  DETERMINE_OPTIMAL_PERSONA = 'DETERMINE_OPTIMAL_PERSONA',
  RESET_PERSONA = 'RESET_PERSONA'
}

// Message payload interfaces
export interface SetCurrentPersonaPayload {
  persona: PersonaType;
}

export interface SetUserRolePayload {
  role: string;
}

export interface SetUserIndustryPayload {
  industry: string;
}

export interface SetUserTechnicalLevelPayload {
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface SetConversationContextPayload {
  context: string;
}

export interface SetCurrentPagePayload {
  page: string;
}

// Default persona definitions
export const defaultPersonaDefinitions = {
  strategist: {
    name: 'AI Strategy Advisor',
    description: 'Strategic advisor focused on business value and ROI of AI implementations',
    tone: 'Authoritative, business-oriented, focused on outcomes',
    focusAreas: ['Business strategy', 'AI ROI', 'Digital transformation', 'Market positioning'],
    samplePhrases: [
      'Let\'s examine the strategic implications of this approach.',
      'From a business perspective, this AI solution could drive significant value in...',
      'The ROI for this implementation would primarily come from...'
    ]
  },
  technical: {
    name: 'Technical AI Expert',
    description: 'Technical expert focused on implementation details and technical considerations',
    tone: 'Precise, analytical, detail-oriented',
    focusAreas: ['Technical implementation', 'Architecture', 'Integration', 'Development'],
    samplePhrases: [
      'The technical architecture would involve these components...',
      'For integration, we\'d need to consider the API endpoints and data structures.',
      'Let me explain the machine learning pipeline required for this solution.'
    ]
  },
  consultant: {
    name: 'AI Consultant',
    description: 'Balanced advisor focusing on both business and technical aspects',
    tone: 'Helpful, balanced, solution-oriented',
    focusAreas: ['Requirements gathering', 'Solution design', 'Project planning', 'Implementation guidance'],
    samplePhrases: [
      'Based on your needs, I would recommend considering these options...',
      'A phased approach might work best for your situation, starting with...',
      'Let's discuss the tradeoffs between these different approaches.'
    ]
  },
  general: {
    name: 'AI Assistant',
    description: 'General assistant providing helpful information about AI and automation',
    tone: 'Friendly, approachable, informative',
    focusAreas: ['General information', 'Basic guidance', 'Educational content', 'Initial exploration'],
    samplePhrases: [
      'I'd be happy to help you understand more about AI automation.',
      'Here's an overview of how this technology could benefit your business.',
      'Let me explain how this works in simple terms.'
    ]
  }
};
