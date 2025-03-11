
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

// Define additional information for each bullet point
const additionalInfo: Record<string, string> = {
  // AI Strategy
  "Custom AI roadmap development": "We develop personalized AI implementation plans tailored to your business goals, industry challenges, and technological readiness. Each roadmap includes milestone planning, resource allocation, and ROI projections.",
  "ROI analysis and implementation planning": "Our comprehensive analysis identifies tangible and intangible benefits, cost structures, and expected timelines for AI investment returns, supported by industry benchmarks and case studies.",
  "Technology stack assessment": "We evaluate your existing infrastructure against AI requirements, identifying integration paths, potential bottlenecks, and recommending optimal cloud or on-premise solutions.",
  "Risk assessment and mitigation strategies": "We provide a thorough analysis of technical, ethical, and business risks, with detailed mitigation plans and governance frameworks to ensure AI compliance and security.",
  
  // Workflow Automation
  "Process analysis and optimization": "We map your existing workflows, identify inefficiencies, and redesign processes before implementing automation, reducing costs by up to 40% and increasing throughput.",
  "Custom automation solution development": "Our team builds tailor-made solutions using RPA, AI, and integration technologies to automate complex business processes while maintaining compliance and audit trails.",
  "Integration with existing systems": "Seamlessly connect new automation tools with your CRM, ERP, and legacy systems using API-first architecture and middleware solutions that minimize disruption.",
  "Performance monitoring and optimization": "Deploy continuous monitoring dashboards that track KPIs, alert on issues, and identify further optimization opportunities through ML-powered process mining.",
  
  // Data Analytics
  "Advanced data analytics": "Leverage predictive modeling, cluster analysis, and anomaly detection to uncover hidden patterns and opportunities within your business data.",
  "Predictive modeling": "Build forward-looking models using regression analysis, time series forecasting, and machine learning algorithms trained on your historical data for accurate projections.",
  "Business intelligence dashboards": "Create intuitive, interactive visualizations that transform complex data into actionable insights, customized for different stakeholders and decision-making needs.",
  "Custom reporting solutions": "Develop automated, scheduled reports with drill-down capabilities that deliver the right information to the right people at the right time.",
  
  // Mobile & Web Solutions
  "AI-powered app development": "Create intelligent applications with embedded machine learning capabilities, natural language processing, and computer vision that learn and improve over time.",
  "Progressive web applications": "Build responsive, offline-capable web apps that offer near-native mobile experiences without the friction of app store downloads.",
  "Cross-platform solutions": "Develop once and deploy everywhere with technologies like React Native, ensuring consistent experiences across iOS, Android, and web platforms.",
  "Smart UI/UX design": "Design intuitive, accessible interfaces based on user research, behavioral analytics, and AI-driven personalization to maximize engagement and conversion."
};

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
                {additionalInfo[item] || `Additional details about ${item} will be added soon. This feature provides in-depth information about our expertise in this area.`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
};

export default BulletPoint;
