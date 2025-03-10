
import React from 'react';
import { motion } from 'framer-motion';

const ScrollIndicator = () => {
  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
        <div className="w-1 h-3 rounded-full bg-white/40"></div>
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;
