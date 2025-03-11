
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import BulletPoint from './BulletPoint';
import SocialProof from './SocialProof';

interface ExpertiseCardProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType; // Changed from React.ReactNode to React.ElementType
  iconBgClass: string;
  iconColor: string;
  accentColor: string;
  description: string;
  bulletPoints: string[];
  additionalDetails?: string;
  bulletPointIcon: React.ReactNode;
  index: number;
  contactLink?: {
    text: string;
    url: string;
  };
  customClass?: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  title,
  subtitle,
  icon: IconComponent, // Renamed to IconComponent to clarify it's a component
  iconBgClass,
  iconColor,
  accentColor,
  description,
  bulletPoints,
  additionalDetails,
  bulletPointIcon,
  index,
  contactLink,
  customClass,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Calculate animation delay based on card index
  const animationDelay = 0.2 + (index * 0.15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
        `hover:border-${accentColor}/20 hover:-translate-y-1`,
        customClass
      )}>
        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-${accentColor}/40 to-${accentColor}/10`}></div>
        <CardContent className="p-6">
          <div className="flex items-start mb-4">
            <div className={`mr-4 p-2 rounded-full ${iconBgClass} ${iconColor}`}>
              {/* Render the IconComponent properly */}
              <IconComponent size={24} />
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-1 group-hover:text-${accentColor} transition-colors duration-300`}>
                {title}
              </h3>
              <div className={`h-1 w-16 bg-${accentColor}/20 rounded-full mb-3 group-hover:w-32 transition-all duration-500`}></div>
              {subtitle && (
                <p className="mb-3 font-medium group-hover:text-foreground/90 transition-colors">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <p className="mb-4">{description}</p>
          
          <div className="mb-4">
            <ul className="space-y-2">
              {bulletPoints.map((item, idx) => (
                <BulletPoint 
                  key={idx}
                  item={item}
                  index={idx}
                  bulletPointIcon={bulletPointIcon}
                  accentColor={accentColor}
                />
              ))}
            </ul>
          </div>
          
          {additionalDetails && (
            <>
              <Button 
                variant="ghost" 
                className={`text-${accentColor} mb-3 w-full justify-between`}
                onClick={toggleExpand}
              >
                Learn More
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-3 bg-muted/30 rounded-md"
                >
                  <p className="text-sm">{additionalDetails}</p>
                  
                  {/* Social proof numbers */}
                  <SocialProof accentColor={accentColor} />
                </motion.div>
              )}
            </>
          )}
          
          {contactLink && (
            <motion.div 
              className="mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className={`w-full text-${accentColor} border-${accentColor}/30 hover:bg-${accentColor}/10`}
                onClick={() => window.location.href = contactLink.url}
              >
                {contactLink.text}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpertiseCard;
