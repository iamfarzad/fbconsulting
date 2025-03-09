
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LeadInfo, 
  extractLeadInfo,
  determinePersona,
  saveLeadInfo,
  loadLeadInfo
} from '@/services/copilotService';
import { trackEvent } from '@/services/analyticsService';
import { useToast } from './use-toast';

export const useLeadInfo = (initialLeadInfo?: LeadInfo) => {
  const { toast } = useToast();
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1] || 'home';
  
  // State for lead info
  const [leadInfo, setLeadInfo] = useState<LeadInfo>(() => {
    return initialLeadInfo || loadLeadInfo();
  });
  
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
    const updatedLeadInfo = extractLeadInfo(message, leadInfo);
    
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
  }, [leadInfo, toast]);
  
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
