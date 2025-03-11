
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BulletPointProps {
  item: string;
  index: number;
  bulletPointIcon: React.ElementType;
  accentColor: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({
  item,
  index,
  bulletPointIcon: Icon,
  accentColor
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item).then(
      () => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "You can now paste this information elsewhere.",
          duration: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
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

  return (
    <motion.li 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
      className="group"
    >
      <div className="flex items-start">
        <motion.div 
          className={`flex-shrink-0 mt-1 mr-2 text-${accentColor}`}
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Icon size={16} />
        </motion.div>
        <div className="flex-grow cursor-pointer" onClick={toggleExpand}>
          <div className="flex items-center justify-between">
            <motion.span 
              className="text-sm font-medium"
              whileHover={{ color: `var(--${accentColor})` }}
            >
              {item}
            </motion.span>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className={`p-1 rounded-full focus:outline-none text-${accentColor}/70 hover:text-${accentColor} hover:bg-${accentColor}/10`}
                      onClick={copyToClipboard}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <motion.button
                className={`p-1 rounded-full focus:outline-none text-${accentColor}/70 hover:text-${accentColor} hover:bg-${accentColor}/10`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {expanded ? (
                  <ChevronUp size={14} className={`text-${accentColor}`} />
                ) : (
                  <ChevronDown size={14} className={`text-${accentColor}`} />
                )}
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: "auto",
                  transition: {
                    height: {
                      duration: 0.3,
                      ease: "easeOut"
                    },
                    opacity: {
                      duration: 0.2,
                      delay: 0.1
                    }
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: {
                    height: {
                      duration: 0.3,
                      ease: "easeIn"
                    },
                    opacity: {
                      duration: 0.2
                    }
                  }
                }}
                className={`mt-2 text-xs text-muted-foreground bg-${accentColor}/5 p-2 rounded-md border border-${accentColor}/10`}
              >
                This is additional information about "{item}". Click to expand or collapse this section for more details about this specific area of expertise.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
};

export default BulletPoint;
