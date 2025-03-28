
import { useState, useEffect } from 'react';
import { LeadStage } from '@/services/chat/messageTypes';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { determineLeadStage, updateLeadStage } from '@/services/lead/leadStageManager';

export function useLeadStage(messages: string[] = []) {
  const [stage, setStage] = useState<LeadStage>('initial');

  useEffect(() => {
    if (messages.length > 0) {
      // Determine the stage based on message content
      const newStage = determineLeadStage(messages);
      setStage(newStage);
    }
  }, [messages]);

  const updateWithLeadInfo = (leadInfo: LeadInfo) => {
    const interests = leadInfo.interests || [];
    const currentStage = leadInfo.stage as LeadStage;
    
    // Only update if we have interests
    if (interests.length > 0) {
      const updatedStage = determineLeadStage(interests);
      setStage(updatedStage);
      return updatedStage;
    }
    
    return currentStage;
  };

  return {
    stage,
    updateWithLeadInfo
  };
}
