
import React from 'react';
import { motion } from 'framer-motion';

const DataInsightsAnimation: React.FC = () => {
  return (
    <div className="flex items-end h-14 space-x-2">
      {[40, 80, 50, 70, 90, 60].map((height, i) => (
        <motion.div
          key={i}
          className="w-3 bg-gradient-to-t from-teal to-retro-pink rounded-t"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ 
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default DataInsightsAnimation;
