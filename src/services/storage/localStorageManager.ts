
import { AIMessage } from '../chat/messageTypes';
import { LeadInfo } from '../lead/leadExtractor';

// Save conversation history to localStorage
export const saveConversationHistory = (messages: AIMessage[]): void => {
  try {
    localStorage.setItem('aiConversationHistory', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save conversation history:', error);
  }
};

// Load conversation history from localStorage
export const loadConversationHistory = (): AIMessage[] => {
  try {
    const saved = localStorage.getItem('aiConversationHistory');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load conversation history:', error);
    return [];
  }
};

// Save lead information to localStorage
export const saveLeadInfo = (leadInfo: LeadInfo): void => {
  try {
    localStorage.setItem('aiLeadInfo', JSON.stringify(leadInfo));
  } catch (error) {
    console.error('Failed to save lead information:', error);
  }
};

// Load lead information from localStorage
export const loadLeadInfo = (): LeadInfo => {
  try {
    const saved = localStorage.getItem('aiLeadInfo');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load lead information:', error);
    return {};
  }
};
