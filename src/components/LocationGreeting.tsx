
import React from 'react';
import { useLocationDetection } from '@/hooks/useLocationDetection';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationGreetingProps {
  className?: string;
}

const LocationGreeting: React.FC<LocationGreetingProps> = ({ className = "" }) => {
  const { city, isLoading } = useLocationDetection();
  const { t, language } = useLanguage();
  
  // Create greeting based on location and language
  const getGreeting = () => {
    if (city) {
      return t('greeting_city').replace('{{city}}', city);
    }
    
    // Fall back to time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('greeting_morning');
    } else if (hour < 17) {
      return t('greeting_afternoon');
    } else {
      return t('greeting_evening');
    }
  };

  return (
    <div className={`${className}`}>
      <motion.div 
        className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-futuristic"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {city && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className={`text-muted-foreground ${language === 'no' ? "text-red-500" : ""}`}
          >
            <MapPin className="h-5 w-5" />
          </motion.div>
        )}
        <h2>{getGreeting()}</h2>
      </motion.div>
      
      {language === 'no' && (
        <motion.p 
          className="text-sm text-accent-foreground mt-2 sm:mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {isLoading ? "Oppdager plassering..." : "AI-løsninger for norske bedrifter"}
        </motion.p>
      )}
    </div>
  );
};

export default LocationGreeting;
