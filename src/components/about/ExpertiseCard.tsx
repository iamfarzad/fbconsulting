
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import BulletPoint from './BulletPoint';

export interface ExpertiseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bulletPoints?: string[];
  bulletPointIcon?: LucideIcon;
  learnMore?: string;
  stats?: {
    [key: string]: number | string;
  };
  accentColor?: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  title,
  description,
  icon: Icon,
  bulletPoints,
  bulletPointIcon,
  learnMore,
  stats,
  accentColor = "primary"
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)"
      }}
      className="group relative p-6 rounded-xl border border-primary/10 bg-white/5 backdrop-blur-md transition-all duration-300 overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${accentColor}/5 via-transparent to-${accentColor}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-${accentColor}/20 via-${accentColor}/5 to-${accentColor}/20 rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-500 group-hover:duration-200 animate-gradient-shift`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br from-${accentColor}/20 to-${accentColor}/5`}>
            <Icon className={`w-6 h-6 text-${accentColor}`} />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">{description}</p>
        
        {bulletPoints && bulletPointIcon && (
          <ul className="space-y-3 mb-6">
            {bulletPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BulletPoint 
                  item={point}
                  index={index}
                  bulletPointIcon={bulletPointIcon}
                  accentColor={accentColor}
                />
              </motion.li>
            ))}
          </ul>
        )}
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            {Object.entries(stats).map(([key, value], index) => (
              <div key={index} className="text-center">
                <div className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-${accentColor} to-${accentColor}/70`}>{value}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {learnMore && (
          <button className={`mt-4 group/btn flex items-center text-sm font-medium text-${accentColor} hover:text-${accentColor}/80 transition-colors`}>
            <span>{learnMore}</span>
            <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ExpertiseCard;
