
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
      className={`bento-card p-6 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-futuristic font-bold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground">{description}</p>
        
        <div className="mt-6 h-16 flex items-center justify-center">
          {isHovered && hoverAnimation}
        </div>
      </div>
    </motion.div>
  );
};

export default BentoItem;
