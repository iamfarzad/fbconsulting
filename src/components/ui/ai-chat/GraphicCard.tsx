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
        return '/about#ai-journey'; // Corrected anchor for Timeline section
      case 'booking':
        return '/contact#booking-calendar'; // Corrected anchor for Booking section
      case 'newsletter':
        return '/#newsletter-signup'; // Corrected anchor for Newsletter section
      case 'skills':
        return '/about#skills-technologies'; // Corrected anchor for Skills section
      case 'testimonials':
        return '/#testimonials-section'; // Corrected anchor for Testimonials section
      default:
        return '/';
    }
  };
  
  const handleClick = () => {
    const path = getPath();
    
    // Check if this is a hash link on the same page
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      const currentPath = window.location.pathname;
      
      // If we're already on the right page, just scroll to the element
      if (basePath === '' || currentPath === basePath) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }
    
    // Otherwise navigate to the new page
    navigate(getPath());
  };

  // Get card styles based on variant with updated color scheme
  const getCardStyles = () => {
    const baseStyles = "overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300 mb-2 max-w-xs";
    
    switch (variant) {
      case 'bordered':
        return `${baseStyles} bg-black text-white border-2 border-white/30 hover:border-[#fe5a1d]/30 hover:shadow-[0_0_15px_rgba(254,90,29,0.1)]`;
      case 'minimal':
        return `${baseStyles} bg-white/5 backdrop-blur-sm text-white border border-white/10 hover:border-[#fe5a1d]/20`;
      default:
        return `${baseStyles} bg-black text-white border border-white/20 hover:border-[#fe5a1d]/20 hover:shadow-xl`;
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
          <div className="p-1.5 bg-white/5 rounded-full group-hover:bg-[#fe5a1d]/5 transition-colors">
            {getIcon()}
          </div>
          <h3 className="font-medium text-white/90">{title}</h3>
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
