
import React from 'react';
import { ArrowRight, BriefcaseIcon, UserRound, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export type CardType = 'services' | 'about' | 'timeline';

interface GraphicCardProps {
  type: CardType;
  title: string;
  description: string;
}

export const GraphicCard: React.FC<GraphicCardProps> = ({ type, title, description }) => {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (type) {
      case 'services':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'about':
        return <UserRound className="h-5 w-5" />;
      case 'timeline':
        return <Clock className="h-5 w-5" />;
      default:
        return <BriefcaseIcon className="h-5 w-5" />;
    }
  };
  
  const getPath = () => {
    switch (type) {
      case 'services':
        return '/services';
      case 'about':
        return '/about';
      case 'timeline':
        return '/about'; // Timeline is usually in the About page
      default:
        return '/';
    }
  };
  
  const handleClick = () => {
    navigate(getPath());
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-black text-white overflow-hidden rounded-lg border border-white/20 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 mb-2 max-w-xs"
      onClick={handleClick}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-white/10 rounded-full">
            {getIcon()}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <p className="text-sm text-white/70 mb-2">{description}</p>
        
        <div className="flex items-center justify-end text-xs text-white/60 hover:text-white transition-colors">
          <span className="mr-1">View</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </motion.div>
  );
};
