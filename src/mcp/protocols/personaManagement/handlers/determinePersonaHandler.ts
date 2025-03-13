
/**
 * Determine Persona Handler
 * Logic for determining the optimal persona based on user context
 */

import { Model, Message } from '../../../core/types';
import { PersonaData, PersonaManagementContext, PersonaType } from '../types';

// Technical keywords that suggest technical background
const TECHNICAL_KEYWORDS = [
  'code', 'programming', 'development', 'api', 'integration',
  'javascript', 'python', 'react', 'angular', 'vue', 'typescript',
  'backend', 'frontend', 'fullstack', 'developer', 'engineer',
  'software', 'architecture', 'database', 'cloud', 'devops',
  'algorithm', 'machine learning', 'ai implementation', 'data science'
];

// Strategy keywords that suggest strategic interests
const STRATEGY_KEYWORDS = [
  'strategy', 'business', 'executive', 'ceo', 'cto', 'coo', 'c-suite',
  'roi', 'revenue', 'growth', 'market', 'vision', 'roadmap', 'leadership',
  'transformation', 'innovation', 'strategic', 'competitive', 'advantage',
  'objectives', 'goals', 'kpi', 'metrics', 'performance', 'planning',
  'budget', 'investment', 'stakeholder'
];

// Consulting keywords that suggest consulting needs
const CONSULTING_KEYWORDS = [
  'advice', 'recommend', 'consult', 'guidance', 'help', 'support',
  'options', 'alternatives', 'suggestions', 'review', 'assessment',
  'evaluation', 'analysis', 'compare', 'pros and cons', 'tradeoffs',
  'consideration', 'decision', 'approach', 'methodology', 'best practices'
];

// Role mapping to persona types
const ROLE_TO_PERSONA: Record<string, PersonaType> = {
  'ceo': 'strategist',
  'cto': 'technical',
  'cio': 'strategist',
  'coo': 'strategist',
  'vp': 'strategist',
  'director': 'strategist',
  'manager': 'consultant',
  'lead': 'consultant',
  'developer': 'technical',
  'engineer': 'technical',
  'architect': 'technical',
  'data scientist': 'technical',
  'product manager': 'consultant',
  'project manager': 'consultant',
  'analyst': 'consultant',
  'consultant': 'consultant'
};

// Page mapping to persona types
const PAGE_TO_PERSONA: Record<string, PersonaType> = {
  'home': 'general',
  'services': 'consultant',
  'about': 'general',
  'contact': 'consultant',
  'blog': 'general'
};

// Handler to determine the optimal persona based on all available data
export const determineOptimalPersonaHandler = (
  model: Model<PersonaData>,
  context: PersonaManagementContext,
  message: Message
): PersonaData => {
  const {
    userRole,
    userIndustry,
    userTechnicalLevel,
    conversationContext,
    currentPage
  } = model;
  
  let determinedPersona: PersonaType = 'general'; // Default
  let confidenceScore = 0;
  let personaReasons: string[] = [];
  
  // 1. Check for explicit role matches (highest priority)
  if (userRole) {
    const lowerRole = userRole.toLowerCase();
    for (const [roleKeyword, persona] of Object.entries(ROLE_TO_PERSONA)) {
      if (lowerRole.includes(roleKeyword)) {
        determinedPersona = persona;
        confidenceScore += 0.4;
        personaReasons.push(`Role "${userRole}" matches "${roleKeyword}"`);
        break;
      }
    }
  }
  
  // 2. Check for technical level indicator
  if (userTechnicalLevel) {
    if (userTechnicalLevel === 'expert') {
      // If user is an expert, lean toward technical persona
      if (determinedPersona === 'general') {
        determinedPersona = 'technical';
        confidenceScore += 0.3;
        personaReasons.push('User has expert technical level');
      } else {
        confidenceScore += 0.1;
      }
    } else if (userTechnicalLevel === 'beginner') {
      // If user is a beginner, avoid technical persona
      if (determinedPersona === 'technical') {
        determinedPersona = 'consultant';
        confidenceScore += 0.2;
        personaReasons.push('Adjusted from technical to consultant due to beginner level');
      }
    }
  }
  
  // 3. Check conversation context for keywords
  if (conversationContext) {
    const lowerContext = conversationContext.toLowerCase();
    
    // Check for technical keywords
    let technicalMatches = 0;
    for (const keyword of TECHNICAL_KEYWORDS) {
      if (lowerContext.includes(keyword)) {
        technicalMatches++;
      }
    }
    
    // Check for strategy keywords
    let strategyMatches = 0;
    for (const keyword of STRATEGY_KEYWORDS) {
      if (lowerContext.includes(keyword)) {
        strategyMatches++;
      }
    }
    
    // Check for consulting keywords
    let consultingMatches = 0;
    for (const keyword of CONSULTING_KEYWORDS) {
      if (lowerContext.includes(keyword)) {
        consultingMatches++;
      }
    }
    
    // Determine the dominant theme from keyword matches
    const maxMatches = Math.max(technicalMatches, strategyMatches, consultingMatches);
    if (maxMatches > 0) {
      let newPersona: PersonaType = determinedPersona;
      
      if (technicalMatches === maxMatches) {
        newPersona = 'technical';
        personaReasons.push(`Found ${technicalMatches} technical keywords in conversation`);
      } else if (strategyMatches === maxMatches) {
        newPersona = 'strategist';
        personaReasons.push(`Found ${strategyMatches} strategy keywords in conversation`);
      } else if (consultingMatches === maxMatches) {
        newPersona = 'consultant';
        personaReasons.push(`Found ${consultingMatches} consulting keywords in conversation`);
      }
      
      // Only change persona if we don't already have a strong determination
      if (confidenceScore < 0.3 || (newPersona !== determinedPersona && maxMatches > 3)) {
        determinedPersona = newPersona;
        confidenceScore += 0.2 + (0.1 * Math.min(maxMatches, 5) / 5);
      } else {
        confidenceScore += 0.1;
      }
    }
  }
  
  // 4. Check current page as a fallback
  if (confidenceScore < 0.3 && currentPage) {
    const pageName = currentPage.toLowerCase().replace('/', '');
    if (PAGE_TO_PERSONA[pageName]) {
      determinedPersona = PAGE_TO_PERSONA[pageName];
      confidenceScore += 0.2;
      personaReasons.push(`Determined from current page: ${currentPage}`);
    }
  }
  
  // Ensure minimum confidence
  confidenceScore = Math.min(1.0, confidenceScore);
  
  // Return updated model with determined persona
  const updatedModel: PersonaData = {
    ...model,
    currentPersona: determinedPersona,
    lastUpdated: new Date().toISOString()
  };
  
  console.log('Persona determination:', {
    determinedPersona,
    confidenceScore,
    reasons: personaReasons
  });
  
  return updatedModel;
};
