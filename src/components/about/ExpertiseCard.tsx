
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExpertiseCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
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
  icon,
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
  const [expandedBullets, setExpandedBullets] = useState<number[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleBullet = (index: number) => {
    if (expandedBullets.includes(index)) {
      setExpandedBullets(expandedBullets.filter(i => i !== index));
    } else {
      setExpandedBullets([...expandedBullets, index]);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index);
        toast({
          title: "Copied to clipboard",
          description: "You can now paste this information elsewhere.",
          duration: 2000,
        });
        setTimeout(() => setCopiedIndex(null), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Please try again",
        });
      }
    );
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
              {icon}
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
                <motion.li 
                  key={idx}
                  className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-2">
                      {bulletPointIcon}
                    </div>
                    <div className="flex-grow cursor-pointer" onClick={() => toggleBullet(idx)}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <div className="flex items-center space-x-1">
                          <motion.button
                            className={`p-1 rounded-full focus:outline-none text-${accentColor}/70 hover:text-${accentColor}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item, idx);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                          </motion.button>
                          {expandedBullets.includes(idx) ? (
                            <ChevronUp size={14} className={`text-${accentColor}`} />
                          ) : (
                            <ChevronDown size={14} className={`text-${accentColor}`} />
                          )}
                        </div>
                      </div>
                      {expandedBullets.includes(idx) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded"
                        >
                          This is additional information about "{item}". Click to expand or collapse this section for more details about this specific area of expertise.
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.li>
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
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <motion.div 
                      className="p-2 bg-background rounded-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.p 
                        className={`text-xl font-bold text-${accentColor}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        <CountUp end={7} duration={2} />+
                      </motion.p>
                      <p className="text-xs">Years Experience</p>
                    </motion.div>
                    
                    <motion.div 
                      className="p-2 bg-background rounded-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.p 
                        className={`text-xl font-bold text-${accentColor}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <CountUp end={30} duration={2} />+
                      </motion.p>
                      <p className="text-xs">Projects</p>
                    </motion.div>
                    
                    <motion.div 
                      className="p-2 bg-background rounded-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.p 
                        className={`text-xl font-bold text-${accentColor}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <CountUp end={95} duration={2} />%
                      </motion.p>
                      <p className="text-xs">Success Rate</p>
                    </motion.div>
                  </div>
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

// Simple CountUp component for animating numbers
const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  
  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <>{count}</>;
};

export default ExpertiseCard;
