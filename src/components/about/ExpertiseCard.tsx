
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import BulletPoint from './BulletPoint';
import SocialProof from './SocialProof';

interface ExpertiseCardProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType; // Icon component type
  iconBgClass: string;
  iconColor: string;
  accentColor: string;
  description: string;
  bulletPoints: string[];
  additionalDetails?: string;
  bulletPointIcon: React.ElementType; // Changed to ElementType to match BulletPoint
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
  icon: IconComponent,
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
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.3 }
      }}
    >
      <Card className={cn(
        "group hover:shadow-xl transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
        `hover:border-${accentColor}/40 relative`,
        customClass
      )}>
        {/* Glow effect on hover */}
        <motion.div 
          className={`absolute inset-0 bg-${accentColor}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        
        {/* Accent line on left side */}
        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-${accentColor}/70 to-${accentColor}/10`}></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start mb-4">
            <motion.div 
              className={`mr-4 p-2 rounded-full ${iconBgClass} ${iconColor} flex items-center justify-center`}
              whileHover={{ scale: 1.1, rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent size={24} />
            </motion.div>
            <div>
              <motion.h3 
                className={`text-xl font-semibold mb-1 group-hover:text-${accentColor} transition-colors duration-300`}
                initial={{ opacity: 0.9 }}
                whileHover={{ scale: 1.01 }}
              >
                {title}
              </motion.h3>
              <motion.div 
                className={`h-1 w-16 bg-${accentColor}/20 rounded-full mb-3`}
                whileHover={{ width: 150 }}
                transition={{ duration: 0.4 }}
              />
              {subtitle && (
                <p className="mb-3 font-medium group-hover:text-foreground/90 transition-colors">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <p className="mb-4 text-foreground/80 group-hover:text-foreground transition-colors duration-300">{description}</p>
          
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
                className={`text-${accentColor} mb-3 w-full justify-between group-hover:bg-${accentColor}/5 transition-colors duration-300`}
                onClick={toggleExpand}
              >
                {expanded ? "Show Less" : "Learn More"}
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 p-3 bg-muted/30 rounded-md border border-${accentColor}/10`}
                  >
                    <p className="text-sm">{additionalDetails}</p>
                    
                    {/* Social proof numbers */}
                    <SocialProof accentColor={accentColor} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          
          {contactLink && (
            <motion.div 
              className="mt-4"
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
