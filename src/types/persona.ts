import { PersonaType } from '@/mcp/protocols/personaManagement/types';

export interface PersonaDefinition {
  name: string;
  tone: string;
  focusAreas: string[];
}

export interface PersonaData {
  personaDefinitions: Record<string, PersonaDefinition>;
  currentPersona?: PersonaType;
  userRole?: string;
  userIndustry?: string;
  userTechnicalLevel?: 'beginner' | 'intermediate' | 'advanced';
  currentPage?: string;
}
