
import { useState, useEffect, useCallback } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';

// Define LeadInfo type
export interface LeadInfo {
  interests?: string[];
  stage?: 'initial' | 'discovery' | 'evaluation' | 'decision' | 'implementation' | 'retention' | 'qualification' | 'interested' | 'ready-to-book';
  name?: string;
  email?: string;
  company?: string;
}

// Mock functions for lead info extraction and storage
export const extractLeadInfo = (messages: string[]): LeadInfo => {
  // This is a simplified mock implementation
  // In a real app, this would do actual NLP analysis
  const hasScheduleMention = messages.some(m => 
    m.toLowerCase().includes('schedule') || 
    m.toLowerCase().includes('book') || 
    m.toLowerCase().includes('appointment')
  );
  
  const hasDetailsMention = messages.some(m => 
    m.toLowerCase().includes('details') || 
    m.toLowerCase().includes('more info') || 
    m.toLowerCase().includes('pricing')
  );
  
  let stage: LeadInfo['stage'] = 'initial';
  
  if (hasScheduleMention) {
    stage = 'ready-to-book';
  } else if (hasDetailsMention) {
    stage = 'interested';
  } else if (messages.length > 2) {
    stage = 'discovery';
  }
  
  return { interests: messages, stage };
};

export const saveLeadInfo = (info: LeadInfo): void => {
  try {
    localStorage.setItem('leadInfo', JSON.stringify(info));
  } catch (error) {
    console.error('Error saving lead info to localStorage:', error);
  }
};

export const loadLeadInfo = (): LeadInfo => {
  try {
    const stored = localStorage.getItem('leadInfo');
    return stored ? JSON.parse(stored) : { interests: [], stage: 'initial' };
  } catch (error) {
    console.error('Error loading lead info from localStorage:', error);
    return { interests: [], stage: 'initial' };
  }
};

export function useLeadInfo(messages: AIMessage[] = []) {
  const [leadInfo, setLeadInfo] = useState<LeadInfo>(() => {
    // Initialize with saved lead info or default empty state
    return loadLeadInfo();
  });

  // Update lead info when messages change
  useEffect(() => {
    if (messages.length > 0) {
      updateLeadInfo();
    }
  }, [messages]);

  // Extract and update lead info from messages
  const updateLeadInfo = useCallback(() => {
    if (messages.length === 0) return;

    try {
      // Extract contents from user messages only
      const userMessages = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content);

      // Skip if no user messages
      if (userMessages.length === 0) return;

      // Extract lead info from user messages
      const extractedInfo = extractLeadInfo(userMessages);
      
      // Merge with existing info to preserve any details not in current messages
      const updatedInfo: LeadInfo = {
        ...leadInfo,
        interests: [...(leadInfo.interests || []), ...userMessages],
        stage: extractedInfo.stage || leadInfo.stage || 'initial',
      };
      
      // Only update state if something changed
      if (
        updatedInfo.interests?.length !== leadInfo.interests?.length ||
        updatedInfo.stage !== leadInfo.stage
      ) {
        setLeadInfo(updatedInfo);
        saveLeadInfo(updatedInfo);
      }
    } catch (error) {
      console.error('Error updating lead info:', error);
    }
  }, [messages, leadInfo]);

  // Reset lead info
  const resetLeadInfo = useCallback(() => {
    const defaultLeadInfo: LeadInfo = {
      interests: [],
      stage: 'initial'
    };
    setLeadInfo(defaultLeadInfo);
    saveLeadInfo(defaultLeadInfo);
  }, []);

  return {
    leadInfo,
    updateLeadInfo,
    resetLeadInfo,
  };
}

export default useLeadInfo;
