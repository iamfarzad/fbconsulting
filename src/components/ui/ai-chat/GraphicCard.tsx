
import React from 'react';
import { ArrowRight, BriefcaseIcon, UserRound, Clock, Calendar, Mail, Code, MessageSquareQuote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export type CardType = 'services' | 'about' | 'timeline' | 'booking' | 'newsletter' | 'skills' | 'testimonials';

interface GraphicCardProps {
  type: CardType;
  title: string;
  description: string;
  variant?: 'default' | 'bordered' | 'minimal';
}

export const GraphicCard: React.FC<GraphicCardProps> = ({ 
  type, 
  title, 
  description, 
  variant = 'default' 
}) => {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (type) {
      case 'services':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'about':
        return <UserRound className="h-5 w-5" />;
      case 'timeline':
        return <Clock className="h-5 w-5" />;
      case 'booking':
        return <Calendar className="h-5 w-5" />;
      case 'newsletter':
        return <Mail className="h-5 w-5" />;
      case 'skills':
        return <Code className="h-5 w-5" />;
      case 'testimonials':
        return <MessageSquareQuote className="h-5 w-5" />;
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
        return '/about#timeline'; // Timeline section in About page
      case 'booking':
        return '/contact#booking'; // Booking section in Contact page
      case 'newsletter':
        return '/#newsletter'; // Newsletter section in Home page
      case 'skills':
        return '/about#skills'; // Skills section in About page
      case 'testimonials':
        return '/#testimonials'; // Testimonials section in Home page
      default:
        return '/';
    }
  };
  
  const handleClick = () => {
    navigate(getPath());
  };

  // Get card styles based on variant
  const getCardStyles = () => {
    const baseStyles = "overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300 mb-2 max-w-xs";
    
    switch (variant) {
      case 'bordered':
        return `${baseStyles} bg-black text-white border-2 border-white/30 hover:border-[#fe5a1d]/70`;
      case 'minimal':
        return `${baseStyles} bg-white/5 backdrop-blur-sm text-white border border-white/10 hover:border-[#fe5a1d]/50`;
      default:
        return `${baseStyles} bg-black text-white border border-white/20 hover:shadow-xl hover:border-[#fe5a1d]/40`;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={getCardStyles()}
      onClick={handleClick}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-white/10 rounded-full group-hover:bg-[#fe5a1d]/10">
            {getIcon()}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <p className="text-sm text-white/70 mb-2">{description}</p>
        
        <div className="flex items-center justify-end text-xs text-white/60 hover:text-[#fe5a1d] transition-colors group">
          <span className="mr-1">View</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
