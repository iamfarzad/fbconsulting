
import { useState, useEffect } from 'react';

interface LocationData {
  isNorwegian: boolean;
  city?: string;
  country?: string;
  countryCode?: string;
  isLoading: boolean;
  error?: string;
}

export function useLocationDetection(): LocationData {
  const [locationData, setLocationData] = useState<LocationData>({
    isNorwegian: false,
    city: undefined,
    country: undefined,
    countryCode: undefined,
    isLoading: true
  });
  
  useEffect(() => {
    let isMounted = true;
    const detectionTimeout = setTimeout(() => {
      if (isMounted && locationData.isLoading) {
        // If taking too long, fall back to default
        fallbackToLanguage();
      }
    }, 5000); // 5 second timeout for detection
    
    const detectLocation = async () => {
      try {
        // Try IP-based location first
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setLocationData({
              isNorwegian: data.country === 'NO',
              city: data.city,
              country: data.country_name,
              countryCode: data.country,
              isLoading: false
            });
            
            // Log successful location detection
            console.log("Location detected via IP API:", data.city, data.country_name);
          }
          return;
        }
      } catch (error) {
        console.log("IP location detection failed, trying geolocation", error);
      }
      
      // Try browser geolocation as fallback
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (isMounted) {
                setLocationData({
                  isNorwegian: geoData.countryCode === 'NO' || geoData.countryName === 'Norway',
                  city: geoData.city,
                  country: geoData.countryName,
                  countryCode: geoData.countryCode,
                  isLoading: false
                });
                
                // Log successful geolocation
                console.log("Location detected via geolocation:", geoData.city, geoData.countryName);
              }
            }
          } catch (error) {
            console.log("Geolocation reverse lookup failed", error);
            if (isMounted) fallbackToLanguage();
          }
        }, (error) => {
          console.log("Browser geolocation failed", error);
          if (isMounted) fallbackToLanguage();
        });
      } catch (error) {
        console.log("Geolocation error", error);
        if (isMounted) fallbackToLanguage();
      }
    };
    
    const fallbackToLanguage = () => {
      // Last resort - check browser language
      const userLang = navigator.language || navigator.languages?.[0];
      const isNorwegianLanguage = userLang?.includes('nb') || userLang?.includes('nn') || userLang?.includes('no');
      
      setLocationData({
        isNorwegian: isNorwegianLanguage,
        countryCode: isNorwegianLanguage ? 'NO' : undefined,
        country: isNorwegianLanguage ? 'Norway' : undefined,
        isLoading: false
      });
      
      // Log language-based detection
      console.log("Location detection fell back to language:", userLang, isNorwegianLanguage ? "Norwegian" : "Non-Norwegian");
    };
    
    detectLocation();
    
    return () => {
      isMounted = false;
      clearTimeout(detectionTimeout);
    };
  }, []);
  
  return locationData;
}
