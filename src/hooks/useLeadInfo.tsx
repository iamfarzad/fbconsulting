
import { useState, useEffect, useCallback } from 'react';
import { extractLeadInfo, saveLeadInfo, loadLeadInfo, LeadInfo } from '@/services/copilotService';
import { AIMessage } from '@/services/chat/messageTypes';

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
