
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulletPointProps {
  item: string;
  index: number;
  bulletPointIcon: React.ReactNode;
  accentColor: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({
  item,
  index,
  bulletPointIcon,
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
      className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out"
      style={{ transitionDelay: `${index * 50}ms` }}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1 mr-2">
          {bulletPointIcon}
        </div>
        <div className="flex-grow cursor-pointer" onClick={toggleExpand}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{item}</span>
            <div className="flex items-center space-x-1">
              <motion.button
                className={`p-1 rounded-full focus:outline-none text-${accentColor}/70 hover:text-${accentColor}`}
                onClick={copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </motion.button>
              {expanded ? (
                <ChevronUp size={14} className={`text-${accentColor}`} />
              ) : (
                <ChevronDown size={14} className={`text-${accentColor}`} />
              )}
            </div>
          </div>
          {expanded && (
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
  );
};

export default BulletPoint;
