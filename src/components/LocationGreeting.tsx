
import React, { useState, useEffect } from 'react';

interface LocationGreetingProps {
  className?: string;
}

const LocationGreeting: React.FC<LocationGreetingProps> = ({ className = "" }) => {
  const [greeting, setGreeting] = useState("Hi Visionary");
  const [isNorwegian, setIsNorwegian] = useState(false);
  
  useEffect(() => {
    // Try to get location from browser
    const getLocation = async () => {
      try {
        // First try to get location from IP lookup
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (data.city) {
            setGreeting(`Hi ${data.city} Innovator`);
            
            // Check if location is in Norway by country code
            if (data.country === 'NO') {
              setIsNorwegian(true);
            }
            return;
          }
        }
        
        // Fall back to browser geolocation API
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (geoData.city) {
                setGreeting(`Hi ${geoData.city} Innovator`);
                
                // Check if location is in Norway
                if (geoData.countryCode === 'NO' || geoData.countryName === 'Norway') {
                  setIsNorwegian(true);
                }
              }
            }
          } catch (error) {
            console.log("Geocoding failed", error);
          }
        }, (error) => {
          console.log("Geolocation failed", error);
          // Try to detect user characteristics from user agent
          detectUserType();
        });
      } catch (error) {
        console.log("Location detection failed", error);
        detectUserType();
      }
    };
    
    const detectUserType = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Hi Early Riser");
      } else if (hour < 17) {
        setGreeting("Hi Productivity Seeker");
      } else {
        setGreeting("Hi Night Owl");
      }
      
      // Try to detect Norway from browser language
      const userLang = navigator.language || navigator.languages?.[0];
      if (userLang?.includes('nb') || userLang?.includes('nn') || userLang?.includes('no')) {
        setIsNorwegian(true);
      }
    };
    
    getLocation();
  }, []);
  
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl md:text-3xl font-futuristic">
        {greeting}
      </h2>
      {isNorwegian && (
        <p className="text-sm text-accent-foreground mt-1 animate-fade-in-up">
          Specialized in AI solutions for Norwegian businesses
        </p>
      )}
    </div>
  );
};

export default LocationGreeting;
