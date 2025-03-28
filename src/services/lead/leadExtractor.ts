
export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  interests: string[];
  stage: 'discovery' | 'qualification' | 'interested' | 'ready-to-book';
}

export function extractLeadInfo(messages: any[]): LeadInfo {
  // Default lead info
  const leadInfo: LeadInfo = {
    interests: [],
    stage: 'discovery'
  };

  // If no messages, return default
  if (!messages || messages.length === 0) {
    return leadInfo;
  }

  // Combine all message content into a text corpus
  const text = messages
    .map(m => m.content || '')
    .join(' ');

  // Extract name (basic pattern matching)
  const nameMatch = text.match(/my name is ([A-Za-z\s]+)/i);
  if (nameMatch && nameMatch[1]) {
    leadInfo.name = nameMatch[1].trim();
  }

  // Extract email (basic pattern matching)
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  if (emailMatch && emailMatch[1]) {
    leadInfo.email = emailMatch[1];
  }

  // Extract company (basic pattern matching)
  const companyMatch = text.match(/(?:at|from|with) ([A-Za-z0-9\s&]+)(?:company|corporation|inc|llc)?/i);
  if (companyMatch && companyMatch[1]) {
    leadInfo.company = companyMatch[1].trim();
  }

  // Extract interests and determine stage
  const keywords = {
    discovery: ['what', 'how', 'tell me', 'explain', 'service', 'offer'],
    qualification: ['cost', 'price', 'budget', 'timeline', 'when', 'process'],
    interested: ['interested', 'want to', 'looking for', 'need', 'help'],
    readyToBook: ['book', 'schedule', 'appointment', 'meeting', 'call', 'consult']
  };

  // Count keyword occurrences to determine stage
  const stageCounts = {
    discovery: 0,
    qualification: 0,
    interested: 0,
    readyToBook: 0
  };

  for (const stage in keywords) {
    if (Object.prototype.hasOwnProperty.call(keywords, stage)) {
      const stageKeywords = keywords[stage as keyof typeof keywords];
      for (const keyword of stageKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          stageCounts[stage as keyof typeof stageCounts] += matches.length;
        }
      }
    }
  }

  // Determine stage based on keyword count
  if (stageCounts.readyToBook > 0) {
    leadInfo.stage = 'ready-to-book';
  } else if (stageCounts.interested > stageCounts.qualification) {
    leadInfo.stage = 'interested';
  } else if (stageCounts.qualification > stageCounts.discovery) {
    leadInfo.stage = 'qualification';
  } else {
    leadInfo.stage = 'discovery';
  }

  // Extract interests
  leadInfo.interests = messages.map(m => m.content || '');

  return leadInfo;
}

export default extractLeadInfo;
