
import { useState, useEffect } from 'react';

interface LocationData {
  isNorwegian: boolean;
  city?: string;
  country?: string;
  countryCode?: string;
}

export function useLocationDetection(): LocationData {
  const [locationData, setLocationData] = useState<LocationData>({
    isNorwegian: false,
    city: undefined,
    country: undefined,
    countryCode: undefined
  });
  
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try IP-based location first
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setLocationData({
            isNorwegian: data.country === 'NO',
            city: data.city,
            country: data.country_name,
            countryCode: data.country
          });
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
              setLocationData({
                isNorwegian: geoData.countryCode === 'NO' || geoData.countryName === 'Norway',
                city: geoData.city,
                country: geoData.countryName,
                countryCode: geoData.countryCode
              });
            }
          } catch (error) {
            console.log("Geolocation reverse lookup failed", error);
            fallbackToLanguage();
          }
        }, (error) => {
          console.log("Browser geolocation failed", error);
          fallbackToLanguage();
        });
      } catch (error) {
        console.log("Geolocation error", error);
        fallbackToLanguage();
      }
    };
    
    const fallbackToLanguage = () => {
      // Last resort - check browser language
      const userLang = navigator.language || navigator.languages?.[0];
      const isNorwegianLanguage = userLang?.includes('nb') || userLang?.includes('nn') || userLang?.includes('no');
      
      setLocationData({
        isNorwegian: isNorwegianLanguage,
        countryCode: isNorwegianLanguage ? 'NO' : undefined
      });
    };
    
    detectLocation();
  }, []);
  
  return locationData;
}
