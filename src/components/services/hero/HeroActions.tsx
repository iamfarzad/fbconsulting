
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/services/analyticsService';

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
    <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" 
         style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
      <Button 
        size="lg" 
        className="neo-button rounded-full bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        onClick={handleExploreServices}
      >
        <Workflow className="mr-2 h-5 w-5" />
        Explore Our Services
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        className="neo-button rounded-full border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10"
        onClick={handleScheduleConsultation}
      >
        Schedule Consultation
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default HeroActions;
