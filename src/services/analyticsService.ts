import { AnalyticsEvent, PageViewParams } from '@/types/analytics';

// Initialize Google Analytics
export const initializeAnalytics = (): void => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID is not provided');
    return;
  }

  // Load the Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize the dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false, // We'll handle page views manually for SPA
  });

  console.log('Analytics initialized with ID:', measurementId);
};

// Track page views
export const trackPageView = ({ path, title, search }: PageViewParams): void => {
  if (!window.gtag) {
    console.warn('Analytics not initialized');
    return;
  }

  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
    page_path: path,
    page_search: search || window.location.search,
  });

  console.log('Page view tracked:', path);
};

// Track custom events
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!window.gtag) {
    console.warn('Analytics not initialized');
    return;
  }

  const { action, category, label, value, ...otherParams } = event;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...otherParams,
  });

  console.log('Event tracked:', action, category);
};
