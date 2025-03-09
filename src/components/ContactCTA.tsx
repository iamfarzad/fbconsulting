
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Mail } from 'lucide-react';
import AnimatedText from './AnimatedText';

const ContactCTA = () => {
  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-400/5 filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="glassmorphism rounded-2xl p-8 md:p-12 shadow-glass">
          <div className="text-center mb-8">
            <AnimatedText
              text="Ready to Automate and Scale?"
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <AnimatedText
              text="Let's discuss how AI automation can transform your business operations"
              tag="p"
              delay={200}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto flex items-center gap-2 justify-center"
            >
              <Calendar size={20} />
              Book a Free Consultation
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg w-full md:w-auto flex items-center gap-2 justify-center"
            >
              <Mail size={20} />
              Contact Me
            </Button>
          </div>
          
          <div className="mt-8 text-center text-muted-foreground">
            <p>No obligations, just a conversation about your business needs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
