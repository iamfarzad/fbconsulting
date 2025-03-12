
import { useCallback } from 'react';
import { trackEvent } from '@/services/analyticsService';

/**
 * Hook for tracking message-related analytics events
 */
export const useMessageTracking = () => {
  // Generic function to track message-related events
  const trackMessageEvent = useCallback((
    action: string,
    category: string,
    label: string,
    additionalProps: Record<string, any> = {}
  ) => {
    trackEvent({
      action,
      category,
      label,
      ...additionalProps
    });
  }, []);
  
  return { trackMessageEvent };
};
