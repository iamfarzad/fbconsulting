
import { useMemo } from 'react';

interface PersonaData {
  personaDefinitions?: Record<string, {
    name: string;
    tone: string;
    focusAreas: string[];
  }>;
  currentPersona?: string;
  userRole?: string;
  userIndustry?: string;
  userTechnicalLevel?: string;
  currentPage?: string;
}

/**
 * Hook to generate a system message based on persona data
 */
export function useSystemMessage(personaData: PersonaData | undefined) {
  const systemMessage = useMemo(() => {
    if (!personaData?.personaDefinitions || !personaData.currentPersona) {
      return '';
    }

    const personaDetails = personaData.personaDefinitions[personaData.currentPersona];
    if (!personaDetails) return '';

    return `You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. 
      Currently using the "${personaDetails.name}" persona. 
      
      Tone: ${personaDetails.tone} 
      
      Focus Areas: 
      ${personaDetails.focusAreas.map(area => `- ${area}`).join('\n')} 
      
      Additional Context:
      - User Role: ${personaData.userRole || 'Unknown'}
      - User Industry: ${personaData.userIndustry || 'Unknown'}
      - User Technical Level: ${personaData.userTechnicalLevel || 'beginner'}
      - Current Page: ${personaData.currentPage || '/'}
      
      Remember to adjust your responses based on the user's technical level and industry context.
    `;
  }, [personaData]);

  return systemMessage;
}
