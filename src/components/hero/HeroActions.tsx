
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';
import { Button } from '@/components/ui/button';

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
      <Button 
        onClick={handleConsultationClick}
        className="bg-[#fe5a1d] hover:bg-[#e84c08] text-white px-8 py-6 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          <span>Book Free Consultation</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </Button>
    </motion.div>
  );
};
