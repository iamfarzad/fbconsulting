
import React, { useState, useEffect } from 'react';

interface LocationGreetingProps {
  className?: string;
}

const LocationGreeting: React.FC<LocationGreetingProps> = ({ className = "" }) => {
  const [greeting, setGreeting] = useState("Hi Visionary");
  
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
    };
    
    getLocation();
  }, []);
  
  return (
    <h2 className={`text-2xl md:text-3xl font-futuristic ${className}`}>
      {greeting}
    </h2>
  );
};

export default LocationGreeting;
