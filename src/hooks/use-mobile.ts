
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Run the check once
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
