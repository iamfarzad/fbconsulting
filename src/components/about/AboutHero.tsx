
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { Button } from '@/components/ui/button';
import DotPattern from '@/components/ui/dot-pattern';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <AnimatedText text="About Me" tag="h1" className="text-3xl md:text-5xl font-bold mb-6" />
            <AnimatedText text="Helping Businesses Cut Costs, Automate Workflows & Scale with AI" tag="h2" delay={200} className="text-xl text-muted-foreground mb-8" />
            <div className="opacity-0 animate-fade-in-up" style={{
            animationDelay: '400ms',
            animationFillMode: 'forwards'
          }}>
              <p className="mb-4">
                I specialize in AI automation, workflow optimization, and intelligent process design—helping businesses reduce manual work, increase efficiency, and drive revenue growth with AI-powered solutions.
              </p>
              <p className="mb-6">
                My approach combines deep technical expertise with business acumen, ensuring that AI solutions deliver measurable ROI and solve real business problems.
              </p>
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                onClick={handleBookConsultation}
              >
                <Calendar size={20} />
                Book a Free Consultation
              </Button>
            </div>
          </div>
          
          <div className="flex-1 opacity-0 animate-fade-in-up" style={{
          animationDelay: '300ms',
          animationFillMode: 'forwards'
        }}>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img alt="AI Automation Consultant" src="/lovable-uploads/5acb6ca9-27a4-40f0-b32d-65655787eaaa.jpg" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
