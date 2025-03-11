
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import BulletPoint from './BulletPoint';

export interface ExpertiseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bulletPoints: string[];
  bulletPointIcon: LucideIcon;
  learnMore: string;
  stats?: {
    [key: string]: number | string;
  };
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  title,
  description,
  icon: Icon,
  bulletPoints,
  bulletPointIcon: BulletIcon,
  learnMore,
  stats
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      className="group relative p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <ul className="space-y-3 mb-6">
          {bulletPoints.map((point, index) => (
            <BulletPoint 
              key={index}
              item={point}
              index={index}
              bulletPointIcon={BulletIcon}
              accentColor="primary"
            />
          ))}
        </ul>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
            {Object.entries(stats).map(([key, value], index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button className="text-sm text-primary hover:text-primary/80 mt-4 transition-colors">
          {learnMore} →
        </button>
      </div>
    </motion.div>
  );
};

export default ExpertiseCard;
