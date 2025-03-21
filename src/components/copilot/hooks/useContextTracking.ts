
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SpatialContext } from '@/services/copilot/types';

/**
 * Hook to track user behavior and page context with debouncing to prevent excessive updates
 */
export function useContextTracking(
  setCurrentPage: (page: string) => void,
  setSpatialContext: (context: SpatialContext | ((prev: SpatialContext | null) => SpatialContext)) => void
) {
  const location = useLocation();
  const lastUpdateRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced update function to prevent too many updates
  const debouncedUpdate = useCallback((updateFn: () => void, delay: number = 300) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      // Only update if enough time has passed since last update
      if (now - lastUpdateRef.current > delay) {
        updateFn();
        lastUpdateRef.current = now;
      }
    }, delay);
  }, []);
  
  // Handle user behavior tracking - always run this effect
  useEffect(() => {
    const trackUserBehavior = (event: MouseEvent | KeyboardEvent) => {
      // Debounce the update to prevent excessive renders
      debouncedUpdate(() => {
        const currentTime = Date.now();
        
        // Clear any existing inactivity timeout
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        
        // Set new inactivity timeout
        inactivityTimeoutRef.current = setTimeout(() => {
          setSpatialContext(prev => ({
            ...(prev || { pageSection: '', elementType: '', interactionType: '', userBehavior: '', timestamp: 0 }),
            userBehavior: 'inactive',
            timestamp: Date.now()
          }));
        }, 30000); // 30 seconds of inactivity
        
        // Determine interaction type
        let interactionType = 'unknown';
        if (event instanceof MouseEvent) {
          const target = event.target as HTMLElement;
          if (target?.tagName === 'BUTTON') {
            interactionType = 'button_click';
          } else if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
            interactionType = 'form_interaction';
          } else if (target?.tagName === 'A') {
            interactionType = 'link_click';
          } else {
            interactionType = 'mouse_movement';
          }
        } else if (event instanceof KeyboardEvent) {
          interactionType = 'keyboard_input';
        }
        
        setSpatialContext(prev => ({
          ...(prev || { pageSection: '', elementType: '', interactionType: '', userBehavior: '', timestamp: 0 }),
          userBehavior: 'active',
          interactionType,
          elementType: (event.target as HTMLElement)?.tagName?.toLowerCase() || 'unknown',
          timestamp: currentTime
        }));
      });
    };
    
    window.addEventListener('mousemove', trackUserBehavior, { passive: true });
    window.addEventListener('click', trackUserBehavior, { passive: true });
    window.addEventListener('keypress', trackUserBehavior, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', trackUserBehavior);
      window.removeEventListener('click', trackUserBehavior);
      window.removeEventListener('keypress', trackUserBehavior);
      
      // Clear timeouts on cleanup
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedUpdate, setSpatialContext]);
  
  // Initialize spatial context on route change - always run this effect
  useEffect(() => {
    const currentPath = location.pathname;
    const pageName = currentPath === '/' ? 'home' : currentPath.substring(1);
    
    // Update current page
    setCurrentPage(pageName);
    
    // Initialize spatial context
    if (!initializedRef.current) {
      setSpatialContext({
        pageSection: pageName,
        elementType: 'page',
        interactionType: 'navigation',
        userBehavior: 'active',
        timestamp: Date.now()
      });
      initializedRef.current = true;
    }
  }, [location.pathname, setCurrentPage, setSpatialContext]);
  
  // Update spatial context on scroll - with debouncing
  useEffect(() => {
    const handleScroll = () => {
      debouncedUpdate(() => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;
          
          if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            setSpatialContext(prev => ({
              ...(prev || { pageSection: '', elementType: '', interactionType: '', userBehavior: '', timestamp: 0 }),
              pageSection: section.id || 'unknown',
              elementType: 'section',
              interactionType: 'scroll',
              timestamp: Date.now()
            }));
            break; // Exit after finding the first matching section
          }
        }
      }, 200);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [debouncedUpdate, setSpatialContext]);
}
