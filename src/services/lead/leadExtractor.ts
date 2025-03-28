
// Type definition for lead information
export interface LeadInfo {
  interests?: string[];
  stage?: 'initial' | 'discovery' | 'evaluation' | 'decision' | 'implementation' | 'retention' | 'qualification' | 'interested' | 'ready-to-book';
  name?: string;
  email?: string;
  company?: string;
}

// Extract lead information from messages
export const extractLeadInfo = (messages: string[]): LeadInfo => {
  // This is a simplified mock implementation
  // In a real app, this would do actual NLP analysis
  const joinedMessages = messages.join(' ').toLowerCase();
  
  // Extract potential name
  let name: string | undefined;
  const nameMatch = joinedMessages.match(/my name is (\w+)|i am (\w+)|i'm (\w+)/i);
  if (nameMatch) {
    name = nameMatch[1] || nameMatch[2] || nameMatch[3];
    name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize first letter
  }
  
  // Extract potential email
  let email: string | undefined;
  const emailMatch = joinedMessages.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    email = emailMatch[0];
  }
  
  // Extract company name
  let company: string | undefined;
  const companyMatch = joinedMessages.match(/work for (\w+)|at (\w+)|company (?:is|called) (\w+)/i);
  if (companyMatch) {
    company = companyMatch[1] || companyMatch[2] || companyMatch[3];
    company = company.charAt(0).toUpperCase() + company.slice(1); // Capitalize first letter
  }
  
  // Determine lead stage based on message content
  let stage: LeadInfo['stage'] = 'initial';
  
  if (joinedMessages.includes('book') || 
      joinedMessages.includes('schedule') || 
      joinedMessages.includes('appointment')) {
    stage = 'ready-to-book';
  } else if (joinedMessages.includes('price') || 
             joinedMessages.includes('cost') || 
             joinedMessages.includes('how much')) {
    stage = 'interested';
  } else if (joinedMessages.includes('help') || 
             joinedMessages.includes('problem') || 
             messages.length > 2) {
    stage = 'discovery';
  }
  
  return {
    interests: messages,
    stage,
    name,
    email,
    company
  };
};

export default extractLeadInfo;
