
interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  page?: string;
  [key: string]: any;
}

// Simple analytics tracking function
export function trackEvent(event: AnalyticsEvent): void {
  // In a real implementation, this would send events to an analytics service
  console.log('[Analytics]', event);
  
  // Send to a real analytics service in the future
  try {
    // Check if window object exists (for SSR compatibility)
    if (typeof window !== 'undefined') {
      // If Google Analytics exists
      if (window.gtag) {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value
        });
      }
      
      // If custom analytics object exists
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track(event.action, {
          category: event.category,
          label: event.label,
          value: event.value,
          page: event.page
        });
      }
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export default { trackEvent };
