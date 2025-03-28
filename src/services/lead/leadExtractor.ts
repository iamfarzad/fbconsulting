
// Lead information extraction utilities

export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  position?: string;
  interests: string[];
  stage: 'initial' | 'discovery' | 'evaluation' | 'decision' | 'implementation' | 'retention';
  source?: string;
  notes?: string;
}

// Extract lead information from chat messages
export const extractLeadInfo = (messages: { role: string; content: string }[]): LeadInfo => {
  // Very basic extraction for now
  const interests: string[] = [];
  
  // Extract interests from user messages
  for (const message of messages) {
    if (message.role === 'user') {
      interests.push(message.content);
    }
  }
  
  // Default lead info
  return {
    interests,
    stage: 'discovery' // Default stage
  };
};

// Extract specific fields from messages
export const extractField = (
  messages: { role: string; content: string }[],
  fieldNames: string[]
): string | null => {
  const patterns = fieldNames.map(name => new RegExp(`${name}\\s*[:=]\\s*([^,;\\n]+)`, 'i'));
  
  for (const message of messages) {
    for (const pattern of patterns) {
      const match = message.content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  
  return null;
};

// Determine if chat contains contact information
export const hasContactInfo = (messages: { role: string; content: string }[]): boolean => {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/;
  
  for (const message of messages) {
    if (emailPattern.test(message.content) || phonePattern.test(message.content)) {
      return true;
    }
  }
  
  return false;
};
