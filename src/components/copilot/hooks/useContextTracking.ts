
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SpatialContext } from '@/services/copilot/types';

/**
 * Hook to track user behavior and page context
 */
export function useContextTracking(
  setCurrentPage: (page: string) => void,
  setSpatialContext: (context: SpatialContext | ((prev: SpatialContext | null) => SpatialContext)) => void
) {
  const location = useLocation();

  // Track user behavior (mouse movements, clicks, keyboard input)
  useEffect(() => {
    let lastInteractionTime = Date.now();
    let inactivityTimeout: NodeJS.Timeout;

    const trackUserBehavior = (event: MouseEvent | KeyboardEvent) => {
      const currentTime = Date.now();
      lastInteractionTime = currentTime;

      // Clear any existing inactivity timeout
      clearTimeout(inactivityTimeout);

      // Set new inactivity timeout
      inactivityTimeout = setTimeout(() => {
        setSpatialContext(prev => ({
          ...prev!,
          userBehavior: 'inactive',
          timestamp: Date.now()
        }));
      }, 30000); // 30 seconds of inactivity

      // Determine interaction type
      let interactionType = 'unknown';
      if (event instanceof MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName === 'BUTTON') {
          interactionType = 'button_click';
        } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          interactionType = 'form_interaction';
        } else if (target.tagName === 'A') {
          interactionType = 'link_click';
        } else {
          interactionType = 'mouse_movement';
        }
      } else if (event instanceof KeyboardEvent) {
        interactionType = 'keyboard_input';
      }
      
      setSpatialContext(prev => ({
        ...prev!,
        userBehavior: 'active',
        interactionType,
        elementType: (event.target as HTMLElement)?.tagName.toLowerCase() || 'unknown',
        timestamp: currentTime
      }));
    };

    window.addEventListener('mousemove', trackUserBehavior);
    window.addEventListener('click', trackUserBehavior);
    window.addEventListener('keypress', trackUserBehavior);

    return () => {
      window.removeEventListener('mousemove', trackUserBehavior);
      window.removeEventListener('click', trackUserBehavior);
      window.removeEventListener('keypress', trackUserBehavior);
      clearTimeout(inactivityTimeout);
    };
  }, [setSpatialContext]);

  // Initialize spatial context on route change
  useEffect(() => {
    const currentPath = location.pathname;
    const pageName = currentPath === '/' ? 'home' : currentPath.substring(1);
    setCurrentPage(pageName);

    // Initialize spatial context
    setSpatialContext({
      pageSection: pageName,
      elementType: 'page',
      interactionType: 'navigation',
      userBehavior: 'active',
      timestamp: Date.now()
    });
  }, [location.pathname, setCurrentPage, setSpatialContext]);

  // Update spatial context on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setSpatialContext(prev => ({
            ...prev!,
            pageSection: section.id || 'unknown',
            elementType: 'section',
            interactionType: 'scroll',
            timestamp: Date.now()
          }));
          break; // Exit after finding the first matching section
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setSpatialContext]);
}
