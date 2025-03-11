
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { Button } from '@/components/ui/button';
import DotPattern from '@/components/ui/dot-pattern';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutHero = () => {
  const navigate = useNavigate();
  
  const handleBookConsultation = () => {
    navigate('/contact');
  };
  
  return (
    <section className="py-20 px-4 relative">
      <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <AnimatedText 
              text="About Me" 
              tag="h1" 
              className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80" 
            />
            <AnimatedText 
              text="Helping Businesses Cut Costs, Automate Workflows & Scale with AI" 
              tag="h2" 
              delay={200} 
              className="text-xl text-primary mb-8" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <p className="mb-4 text-foreground/80 leading-relaxed">
                I specialize in <span className="text-primary font-medium">AI automation</span>, <span className="text-blue-500 font-medium">workflow optimization</span>, and <span className="text-orange-500 font-medium">intelligent process design</span>—helping businesses reduce manual work, increase efficiency, and drive revenue growth with AI-powered solutions.
              </p>
              <p className="mb-6 text-foreground/80 leading-relaxed">
                My approach combines deep technical expertise with business acumen, ensuring that AI solutions deliver measurable ROI and solve real business problems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:gap-3 bg-gradient-to-r from-primary to-primary/90 group"
                  onClick={handleBookConsultation}
                >
                  <Calendar size={20} />
                  Book a Free Consultation
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0" />
                </Button>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500">
                <img alt="AI Automation Consultant" src="/lovable-uploads/5acb6ca9-27a4-40f0-b32d-65655787eaaa.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm font-medium">AI Automation Consultant & Strategist</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
