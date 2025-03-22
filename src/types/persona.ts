import { PersonaType } from '@/mcp/protocols/personaManagement/types';

export interface PersonaDefinition {
  name: string;
  description: string;
  tone: string;
  focusAreas: string[];
  samplePhrases: string[];
}

export interface PersonaData {
  personaDefinitions: {
    strategist: PersonaDefinition;
    technical: PersonaDefinition;
    consultant: PersonaDefinition;
    general: PersonaDefinition;
  };
  currentPersona: PersonaType;
  userRole?: string;
  userIndustry?: string;
  userTechnicalLevel?: 'beginner' | 'intermediate' | 'expert';
  currentPage?: string;
}
