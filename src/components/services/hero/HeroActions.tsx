
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/services/analyticsService';
import { motion } from 'framer-motion';

const HeroActions = () => {
  const navigate = useNavigate();
  
  const handleExploreServices = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'explore_services',
      cta_location: 'services_hero',
      cta_text: 'Explore Our Services'
    });
    
    const servicesSection = document.getElementById('ai-strategy');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleScheduleConsultation = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'schedule_consultation',
      cta_location: 'services_hero',
      cta_text: 'Schedule Consultation'
    });
    
    navigate('/contact');
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <Button 
        size="lg" 
        className="neo-button rounded-full bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleExploreServices}
      >
        <Workflow className="mr-2 h-5 w-5" />
        Explore Our Services
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        className="neo-button rounded-full border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10 group transition-all duration-300"
        onClick={handleScheduleConsultation}
      >
        <Calendar className="mr-2 h-5 w-5 text-[#fe5a1d] group-hover:scale-110 transition-all duration-300" />
        Schedule Consultation
        <ArrowRight className="ml-2 h-4 w-4 text-[#fe5a1d] group-hover:translate-x-1 transition-transform duration-300" />
      </Button>
    </motion.div>
  );
};

export default HeroActions;
