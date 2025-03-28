
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SpatialContext } from '@/components/copilot/types';

/**
 * Hook to track user's spatial context within the application
 */
export function useSpatialContext(enabled: boolean) {
  const location = useLocation();
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);

  useEffect(() => {
    if (!enabled) return; // Don't track context if copilot is disabled

    if (!spatialContext) {
      const currentPath = location.pathname;
      const pageName = currentPath === '/' ? 'home' : currentPath.substring(1);
      
      setSpatialContext({
        pageSection: pageName,
        elementType: 'page',
        interactionType: 'navigation',
        userBehavior: 'active',
        timestamp: Date.now()
      });
    }
  }, [location, spatialContext, enabled]);

  return { spatialContext };
}
