import { useState, useEffect } from 'react';

interface LocationDetection {
  isNorwegian: boolean;
}

export const useLocationDetection = (): LocationDetection => {
  const [isNorwegian, setIsNorwegian] = useState(false);

  useEffect(() => {
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Consider Norwegian if browser language is Norwegian or timezone is Europe/Oslo
    const isNorwegianLanguage = browserLang.startsWith('nb') || browserLang.startsWith('nn') || browserLang === 'no';
    const isNorwegianTimezone = userTimezone === 'Europe/Oslo';
    
    setIsNorwegian(isNorwegianLanguage || isNorwegianTimezone);
  }, []);

  return { isNorwegian };
};
