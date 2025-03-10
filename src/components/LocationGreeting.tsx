
import React from 'react';
import { useLocationDetection } from '@/hooks/useLocationDetection';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface LocationGreetingProps {
  className?: string;
}

const LocationGreeting: React.FC<LocationGreetingProps> = ({ className = "" }) => {
  const { city, country, isNorwegian } = useLocationDetection();
  
  // Create greeting based on location
  const getGreeting = () => {
    if (city) {
      return `Hi ${city} Innovator`;
    }
    
    // Fall back to time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Hi Early Riser";
    } else if (hour < 17) {
      return "Hi Productivity Seeker";
    } else {
      return "Hi Night Owl";
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
            className="text-muted-foreground"
          >
            <MapPin className="h-5 w-5" />
          </motion.div>
        )}
        <h2>{getGreeting()}</h2>
      </motion.div>
      
      {isNorwegian && (
        <motion.p 
          className="text-sm text-accent-foreground mt-2 sm:mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Specialized in AI solutions for Norwegian businesses
        </motion.p>
      )}
    </div>
  );
};

export default LocationGreeting;
