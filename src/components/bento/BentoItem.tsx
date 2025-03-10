
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BentoItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  hoverAnimation?: React.ReactNode;
  className?: string;
}

const BentoItem: React.FC<BentoItemProps> = ({ 
  title, 
  description, 
  icon, 
  hoverAnimation,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`rounded-md border border-border bg-white dark:bg-black p-6 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        
        <p className="text-muted-foreground">{description}</p>
        
        {hoverAnimation && (
          <div className="mt-6 h-16 flex items-center justify-center">
            {isHovered && hoverAnimation}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BentoItem;
