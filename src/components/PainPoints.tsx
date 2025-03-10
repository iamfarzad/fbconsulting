
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedText from './AnimatedText';
import { TiltedScroll, TiltedScrollItem } from './ui/tilted-scroll';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';
import { useLanguage } from '@/contexts/LanguageContext';

const PainPoints = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Combined pain points and solutions for more concise presentation
  const businessChallenges: TiltedScrollItem[] = [
    { id: "1", text: language === 'no' ? 
      "Tid tapt på repetitive oppgaver → Automatiser for å spare 20+ timer/uke" : 
      "Time lost on repetitive tasks → Automate to save 20+ hrs/week" },
    { id: "2", text: language === 'no' ? 
      "Skaleringsproblemer → AI-drevne operasjoner uten proporsjonale kostnader" : 
      "Scaling issues → AI-powered operations without proportional costs" },
    { id: "3", text: language === 'no' ? 
      "Manuelle prosesser → Reduser svartid med 80%" : 
      "Manual processes → Reduce response times by 80%" },
    { id: "4", text: language === 'no' ? 
      "Tapte datainnsikter → AI-drevet forretningsintelligens" : 
      "Missed data insights → AI-powered business intelligence" },
    { id: "5", text: language === 'no' ? 
      "Kommunikasjonssiloer → Effektiviserte automatiserte systemer" : 
      "Communication silos → Streamlined automated systems" },
    { id: "6", text: language === 'no' ? 
      "Tapte muligheter → AI-drevet leadhåndtering" : 
      "Lost opportunities → AI-driven lead tracking" },
  ];

  const handleGetAuditClick = () => {
    // Track this CTA click
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'get_ai_audit',
      cta_location: 'pain_points_section'
    });
    
    navigate('/contact');
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-deep-purple/5 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <AnimatedText
            text={t('challenges_title')}
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          />
          <AnimatedText
            text={t('challenges_subtitle')}
            tag="p"
            delay={200}
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
          />
        </div>

        <div className="backdrop-blur-sm p-6 rounded-xl">
          <TiltedScroll 
            items={businessChallenges} 
            className="mx-auto max-w-md"
          />
        </div>
        
        {/* Centered CTA button */}
        <div className="mt-10 flex justify-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Button 
              size="lg" 
              className="rounded-full px-8 neo-button group"
              onClick={handleGetAuditClick}
            >
              {t('get_audit')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
