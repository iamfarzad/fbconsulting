
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

const BusinessChallenges = () => {
  const navigate = useNavigate();
  
  const challenges = [
    { problem: "Wasting time on manual tasks?", solution: "Automate to save 20+ hours per week" },
    { problem: "Struggling to scale?", solution: "AI optimizes operations without increasing costs" },
    { problem: "Slow processes?", solution: "Reduce response times by 80%" },
    { problem: "Lack of data insights?", solution: "AI-powered analytics for smarter decisions" },
    { problem: "Siloed communication?", solution: "AI-driven systems for seamless workflows" },
    { problem: "Missed opportunities?", solution: "AI automation for lead tracking and sales growth" }
  ];

  const handleGetAuditClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'get_ai_audit',
      cta_location: 'business_challenges_section'
    });
    
    navigate('/contact');
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-deep-purple/5 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <AnimatedText
            text="Common Business Challenges Solved with AI"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {challenges.map((challenge, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 opacity-0 animate-fade-in-up" 
              style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <Check className="min-w-5 h-5 text-teal mt-1.5" />
              <div>
                <span className="font-medium">{challenge.problem}</span>
                <span className="text-muted-foreground"> → </span>
                <span>{challenge.solution}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Centered CTA button */}
        <div className="mt-10 flex justify-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Button 
              size="lg" 
              className="rounded-full px-8 neo-button group"
              onClick={handleGetAuditClick}
            >
              Get a Free AI Audit – Identify automation opportunities in your business
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessChallenges;
