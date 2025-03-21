
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export const HeroActions: React.FC = () => {
  const navigate = useNavigate();
  
  const handleConsultationClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'hero_consultation',
      cta_location: 'hero',
      cta_text: 'Book Free Consultation'
    });
    
    navigate('/contact');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex justify-center mt-4 pt-6"
    >
      <ShimmerButton 
        onClick={handleConsultationClick}
        className="px-8 py-3 text-lg shadow-lg hover:shadow-xl text-white dark:text-white"
        background="#fe5a1d"
        shimmerColor="rgba(255, 255, 255, 0.4)"
        shimmerSize="0.1em"
        shimmerDuration="2.5s"
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-white group-hover:scale-110 transition-all duration-300" />
          <span>Book Free Consultation</span>
          <ArrowRight className="ml-2 h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </ShimmerButton>
    </motion.div>
  );
};
