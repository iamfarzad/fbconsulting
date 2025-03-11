
import { useState, useCallback } from 'react';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { determineLeadStage, updateLeadStage } from '@/services/lead/leadStageManager';
import { saveLeadInfo } from '@/services/storage/localStorageManager';

export const useLeadStage = (initialLeadInfo: LeadInfo) => {
  const [stage, setStage] = useState<LeadInfo['stage']>(initialLeadInfo.stage || 'discovery');
  
  // Update stage based on a new message
  const processMessageForStage = useCallback((message: string, leadInfo: LeadInfo): LeadInfo => {
    const updatedLeadInfo = updateLeadStage(message, leadInfo);
    
    // Update local state if stage changed
    if (updatedLeadInfo.stage !== stage) {
      setStage(updatedLeadInfo.stage);
    }
    
    return updatedLeadInfo;
  }, [stage]);
  
  // Manually set the stage
  const setLeadStage = useCallback((newStage: 'discovery' | 'qualification' | 'interested' | 'ready-to-book', leadInfo: LeadInfo): LeadInfo => {
    const updatedLeadInfo = { ...leadInfo, stage: newStage };
    setStage(newStage);
    saveLeadInfo(updatedLeadInfo);
    return updatedLeadInfo;
  }, []);
  
  return {
    stage,
    processMessageForStage,
    setLeadStage
  };
};
