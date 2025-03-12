
import { AIMessage } from './chat/messageTypes';

export interface EmailSummaryOptions {
  includeTimestamps?: boolean;
  includeMetadata?: boolean;
  format?: 'plain' | 'html';
}

export interface EmailSummaryPreference {
  email: string;
  lastUsed: string;
  options: EmailSummaryOptions;
}

// Save email preferences to localStorage
export const saveEmailPreference = (preference: EmailSummaryPreference): void => {
  try {
    localStorage.setItem('emailSummaryPreference', JSON.stringify(preference));
  } catch (error) {
    console.error('Failed to save email preference:', error);
  }
};

// Load email preferences from localStorage
export const loadEmailPreference = (): EmailSummaryPreference | null => {
  try {
    const saved = localStorage.getItem('emailSummaryPreference');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load email preference:', error);
    return null;
  }
};

// Format messages based on options
export const formatSummary = (messages: AIMessage[], options: EmailSummaryOptions = {}): string => {
  const { includeTimestamps = false, format = 'plain' } = options;
  
  return messages
    .map((msg) => {
      const timestamp = includeTimestamps ? `[${new Date(msg.timestamp || Date.now()).toLocaleString()}] ` : '';
      const role = msg.role === 'user' ? 'You' : 'AI';
      const content = msg.content.replace(/\[\[CARD:[^\]]+\]\]/g, '');
      
      if (format === 'html') {
        return `<p><strong>${timestamp}${role}:</strong> ${content}</p>`;
      }
      return `${timestamp}${role}: ${content}`;
    })
    .join(format === 'html' ? '\n' : '\n\n');
};

// Send email summary (mock implementation - replace with actual email service)
export const sendEmailSummary = async (
  email: string,
  summary: string,
  options: EmailSummaryOptions = {}
): Promise<{ success: boolean; error?: string }> => {
  // Validate email with a more thorough check
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Please enter a valid email address in the format: example@domain.com'
    };
  }

  // Mock API call - replace with actual email service integration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Save preference
  saveEmailPreference({
    email,
    lastUsed: new Date().toISOString(),
    options
  });

  return { success: true };
};
