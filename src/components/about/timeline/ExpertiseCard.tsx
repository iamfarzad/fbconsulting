
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ExpertiseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  points: string[];
  index: number;
  isInView: boolean;
  gradientFrom: string;
  gradientTo: string;
  iconBgClass: string;
  iconTextClass: string;
}

const ExpertiseCard = ({
  title,
  description,
  icon,
  points,
  index,
  isInView,
  gradientFrom,
  gradientTo,
  iconBgClass,
  iconTextClass
}: ExpertiseCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { toast } = useToast();

  const handleCopyPoint = (point: string) => {
    navigator.clipboard.writeText(point);
    toast({
      description: "Copied to clipboard!",
      duration: 2000
    });
  };

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
        "hover:border-primary/20 hover:-translate-y-1",
        isInView ? "animate-fade-in-up" : "opacity-0"
      )}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${gradientFrom} ${gradientTo}`}></div>
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <div className={`mr-4 p-2 rounded-full ${iconBgClass} ${iconTextClass}`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-1 group-hover:${iconTextClass} transition-colors duration-300`}>
              {title}
            </h3>
            <motion.div 
              className="h-1 w-16 bg-primary/20 rounded-full mb-3"
              animate={{ width: isInView ? "8rem" : "4rem" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            />
          </div>
        </div>
        <p className="mb-3 group-hover:text-foreground/90 transition-colors">{description}</p>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : "auto" }}
          className="space-y-2"
        >
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              className="flex items-start group/item hover:bg-muted/50 p-2 rounded-md transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 + index * 0.2 }}
            >
              {icon.type({ className: `w-4 h-4 ${iconTextClass} mr-2 mt-1 shrink-0` })}
              <span className="text-sm flex-1">{point}</span>
              <button
                onClick={() => handleCopyPoint(point)}
                className="opacity-0 group-hover/item:opacity-100 transition-opacity ml-2"
                aria-label="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ExpertiseCard;
