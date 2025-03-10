
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Mail } from 'lucide-react';
import AnimatedText from './AnimatedText';
import { trackEvent } from '@/services/analyticsService';
import { useNavigate } from 'react-router-dom';
import { useLocationDetection } from '@/hooks/useLocationDetection';

const ContactCTA = () => {
  const navigate = useNavigate();
  const { isNorwegian } = useLocationDetection();

  const handleBookClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'book_consultation',
      cta_location: 'contact_section',
      cta_text: 'Book a Free Consultation',
      is_norwegian: isNorwegian
    });
    navigate('/contact');
  };

  const handleContactClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'contact_me',
      cta_location: 'contact_section',
      cta_text: 'Contact Me',
      is_norwegian: isNorwegian
    });
    navigate('/contact');
  };

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal/5 filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-teal/5 filter blur-3xl"></div>
        <div className="tech-grid absolute inset-0 opacity-30"></div>
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-glass border border-white/20">
          <div className="text-center mb-8">
            <AnimatedText
              text={isNorwegian ? "Ready to Transform Your Norwegian Business?" : "Ready to Automate and Scale?"}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-gradient-teal"
            />
            <AnimatedText
              text={isNorwegian 
                ? "Let's discuss tailored AI solutions that comply with Norwegian regulations"
                : "Let's discuss how AI automation can transform your business operations"
              }
              tag="p"
              delay={200}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg w-full md:w-auto flex items-center gap-2 justify-center bg-teal-600 hover:bg-teal-700 text-white shadow-md"
              onClick={handleBookClick}
            >
              <Calendar size={20} />
              {isNorwegian ? "Book a Free AI Compliance Audit" : "Book a Free Consultation"}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg w-full md:w-auto flex items-center gap-2 justify-center border-teal text-teal hover:bg-teal/10 shadow-sm"
              onClick={handleContactClick}
            >
              <Mail size={20} />
              Contact Me
            </Button>
          </div>
          
          <div className="mt-8 text-center text-muted-foreground">
            <p>
              {isNorwegian 
                ? "No obligations, just a conversation about your Norwegian business needs" 
                : "No obligations, just a conversation about your business needs"
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
