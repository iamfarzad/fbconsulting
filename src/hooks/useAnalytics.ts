
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  trackPageView, 
  trackEvent, 
  AnalyticsEvent
} from '@/services/analyticsService';

// Custom hook for analytics functionality
export const useAnalytics = () => {
  const location = useLocation();
  
  // Track page views automatically when the route changes
  useEffect(() => {
    trackPageView({
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);
  
  // Memoized event tracking function for better performance
  const trackEventCallback = useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
    
    // Log tracking for development purposes
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event tracked:', event);
    }
  }, []);
  
  // Return event tracking function for components to use
  return {
    trackEvent: trackEventCallback,
  };
};

// This hook is specifically for tracking lead generation activities
export const useLeadTracking = () => {
  const { trackEvent: track } = useAnalytics();
  
  const trackLead = useCallback((
    leadType: 'newsletter' | 'consultation' | 'contact_form', 
    details: Record<string, any> = {}
  ) => {
    track({
      action: 'generate_lead',
      category: 'conversion',
      label: leadType,
      value: leadType === 'consultation' ? 10 : 1,
      lead_type: leadType,
      lead_source: window.location.pathname,
      ...details
    });
    
    console.log(`Lead generated: ${leadType}`, details);
  }, [track]);
  
  return { trackLead };
};

// This hook is specifically for tracking page views
export const usePageViewTracking = (title?: string) => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView({
      path: location.pathname,
      title,
      search: location.search,
    });
  }, [location.pathname, location.search, title]);
};
