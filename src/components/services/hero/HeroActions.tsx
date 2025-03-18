
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/services/analyticsService';
import { motion } from 'framer-motion';
import { ShimmerButton } from '@/components/ui/shimmer-button';

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
      <ShimmerButton 
        className="rounded-full py-3 px-8 text-lg"
        background="white"
        shimmerColor="rgba(0, 0, 0, 0.1)"
        onClick={handleExploreServices}
      >
        <div className="flex items-center text-black">
          <Workflow className="mr-2 h-5 w-5 text-[#fe5a1d]" />
          <span>Explore Our Services</span>
        </div>
      </ShimmerButton>
      
      <ShimmerButton 
        onClick={handleScheduleConsultation}
        className="rounded-full py-3 px-8 text-lg border border-white/40"
        background="transparent"
        shimmerColor="rgba(255, 255, 255, 0.2)"
      >
        <div className="flex items-center text-white dark:text-white">
          <Calendar className="mr-2 h-5 w-5 text-[#fe5a1d] group-hover:scale-110 transition-all duration-300" />
          <span>Schedule Consultation</span>
          <ArrowRight className="ml-2 h-4 w-4 text-[#fe5a1d] group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </ShimmerButton>
    </motion.div>
  );
};

export default HeroActions;
