
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, BookOpen, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';
import AnimatedText from './AnimatedText';

interface NorwegianPainPointsProps {
  isVisible: boolean;
}

const NorwegianPainPoints: React.FC<NorwegianPainPointsProps> = ({ isVisible }) => {
  const navigate = useNavigate();
  
  if (!isVisible) return null;
  
  const handleGetAuditClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'norwegian_ai_audit',
      cta_location: 'norwegian_pain_points_section',
      country: 'Norway'
    });
    
    navigate('/contact');
  };

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-background to-deep-purple/5 relative z-10 border-t border-white/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <AnimatedText
            text="AI Solutions for Norwegian Businesses"
            tag="h2"
            className="text-2xl md:text-3xl font-bold mb-3 text-foreground"
          />
          <AnimatedText
            text="Addressing unique challenges in the Norwegian market"
            tag="p"
            delay={200}
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-teal-500" />
              <h3 className="text-lg font-semibold">Regulatory Compliance</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Navigate complex GDPR, EU AI Act, and Norwegian data privacy requirements with compliant AI solutions.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px]">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-teal-500" />
              <h3 className="text-lg font-semibold">AI Expertise Gap</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Bridge the AI knowledge gap with tailored consulting for Norwegian industries like energy, manufacturing and finance.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px]">
            <div className="flex items-center gap-3 mb-4">
              <Workflow className="h-6 w-6 text-teal-500" />
              <h3 className="text-lg font-semibold">Workflow Automation</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Optimize operations with AI automation tailored to Norwegian business processes and compliance needs.
            </p>
          </div>
        </div>
        
        {/* Norwegian-specific CTA button */}
        <div className="mt-10 flex justify-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <Button 
              size="lg" 
              className="rounded-full px-8 neo-button group"
              onClick={handleGetAuditClick}
            >
              Get a Free AI Compliance Audit
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NorwegianPainPoints;
