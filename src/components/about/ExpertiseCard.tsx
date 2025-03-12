
import React from 'react';
import { LucideIcon } from 'lucide-react';
import BulletPoint from './BulletPoint';
import { motion } from 'framer-motion';

interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bulletPoints: string[];
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  icon,
  title,
  description,
  bulletPoints
}) => {
  return (
    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 h-full 
                   border border-muted hover:border-[#fe5a1d]/20 
                   shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5 
                   transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-[#fe5a1d]/10 p-2 rounded-md mr-3">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <p className="text-muted-foreground mb-4 text-sm">{description}</p>
      
      <ul className="space-y-2">
        {bulletPoints.map((point, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            viewport={{ once: true }}
          >
            <BulletPoint text={point} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ExpertiseCard;
