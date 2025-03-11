
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { 
  LeadInfo, 
  extractLeadInfo 
} from '@/services/lead/leadExtractor';
import { determinePersona } from '@/services/chat/responseGenerator';
import {
  saveLeadInfo,
  loadLeadInfo
} from '@/services/storage/localStorageManager';
import { trackEvent } from '@/services/analyticsService';
import { useToast } from './use-toast';
import { useLeadStage } from './useLeadStage';

export const useLeadInfo = (initialLeadInfo?: LeadInfo) => {
  const { toast } = useToast();
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1] || 'home';
  
  // State for lead info
  const [leadInfo, setLeadInfo] = useState<LeadInfo>(() => {
    return initialLeadInfo || loadLeadInfo();
  });
  
  // Use our new hook for lead stage management
  const { processMessageForStage } = useLeadStage(leadInfo);
  
  // State for current persona
  const [currentPersona, setCurrentPersona] = useState<'strategist' | 'technical' | 'consultant' | 'general'>(
    determinePersona(leadInfo, currentPage)
  );
  
  // When the location changes, update the current persona
  useEffect(() => {
    setCurrentPersona(determinePersona(leadInfo, currentPage));
  }, [currentPage, leadInfo]);
  
  // Save lead info when it changes
  useEffect(() => {
    if (Object.keys(leadInfo).length > 0) {
      saveLeadInfo(leadInfo);
    }
  }, [leadInfo]);
  
  // Update lead info based on a message
  const updateLeadInfo = useCallback((message: string) => {
    // First extract basic lead info
    const extractedLeadInfo = extractLeadInfo(message, leadInfo);
    
    // Then process for stage updates
    const updatedLeadInfo = processMessageForStage(message, extractedLeadInfo);
    
    // Only update if there are changes
    if (JSON.stringify(updatedLeadInfo) !== JSON.stringify(leadInfo)) {
      setLeadInfo(updatedLeadInfo);
      
      // If the user is at the ready-to-book stage, suggest they visit the contact page
      if (updatedLeadInfo.stage === 'ready-to-book' && leadInfo.stage !== 'ready-to-book') {
        toast({
          title: "Ready to schedule a consultation?",
          description: "Visit our contact page to book a time that works for you.",
          action: <a href="/contact" className="text-teal underline">Book Now</a>
        });
      }
    }
    
    return updatedLeadInfo;
  }, [leadInfo, processMessageForStage, toast]);
  
  // Clear lead info
  const clearLeadInfo = useCallback(() => {
    setLeadInfo({});
    saveLeadInfo({});
  }, []);
  
  return {
    leadInfo,
    currentPersona,
    updateLeadInfo,
    clearLeadInfo
  };
};
