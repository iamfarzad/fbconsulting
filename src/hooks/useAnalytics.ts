
import { useEffect } from 'react';
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
  
  // Return event tracking function for components to use
  return {
    trackEvent: (event: AnalyticsEvent) => trackEvent(event),
  };
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
