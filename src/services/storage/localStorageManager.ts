
import { AIMessage } from '../chat/messageTypes';
import { LeadInfo } from '../lead/leadExtractor';

// Save conversation history to localStorage
export const saveConversationHistory = (messages: AIMessage[]): boolean => {
  try {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
    return false;
  }
};

// Load conversation history from localStorage
export const loadConversationHistory = (): AIMessage[] => {
  try {
    const stored = localStorage.getItem('chatHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat history from localStorage:', error);
    return [];
  }
};

// Save lead information to localStorage
export const saveLeadInfo = (info: LeadInfo): boolean => {
  try {
    localStorage.setItem('leadInfo', JSON.stringify(info));
    return true;
  } catch (error) {
    console.error('Error saving lead info to localStorage:', error);
    return false;
  }
};

// Load lead information from localStorage
export const loadLeadInfo = (): LeadInfo => {
  try {
    const stored = localStorage.getItem('leadInfo');
    return stored ? JSON.parse(stored) : { interests: [], stage: 'initial' };
  } catch (error) {
    console.error('Error loading lead info from localStorage:', error);
    return { interests: [], stage: 'initial' };
  }
};

// Clear all stored data
export const clearStoredData = (): boolean => {
  try {
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('leadInfo');
    return true;
  } catch (error) {
    console.error('Error clearing stored data from localStorage:', error);
    return false;
  }
};

export default {
  saveConversationHistory,
  loadConversationHistory,
  saveLeadInfo,
  loadLeadInfo,
  clearStoredData
};
