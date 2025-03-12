
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

const BackgroundCTA = () => {
  const navigate = useNavigate();
  
  const handleConsultation = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'background_consultation',
      cta_location: 'background_section'
    });
    
    navigate('/contact');
  };
  
  return (
    <motion.div 
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="p-6 border border-[#fe5a1d]/20 bg-background/80 backdrop-blur-sm hover:shadow-md hover:shadow-[#fe5a1d]/5 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-3">Ready to transform your business with AI?</h3>
        <p className="mb-6 text-muted-foreground">Book a free 30-minute consultation to discuss how AI automation can help your specific business needs.</p>
        <Button
          onClick={handleConsultation}
          className="rounded-full px-6 py-2 group"
        >
          <Calendar className="mr-2 h-5 w-5 text-[#fe5a1d] group-hover:scale-110 transition-all duration-300" />
          Schedule Now
          <ArrowRight className="ml-2 h-4 w-4 text-[#fe5a1d] group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </Card>
    </motion.div>
  );
};

export default BackgroundCTA;
