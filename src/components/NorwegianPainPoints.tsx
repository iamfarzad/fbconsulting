
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, BookOpen, Workflow, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';
import AnimatedText from './AnimatedText';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface NorwegianPainPointsProps {
  isVisible: boolean;
}

const NorwegianPainPoints: React.FC<NorwegianPainPointsProps> = ({ isVisible }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Only show for Norwegian language
  if (!isVisible && language !== 'no') return null;
  
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-12 px-4 relative z-10 border-t border-white/5">
      {/* Norwegian-themed background with flag colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-red-900/5 pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div 
            animate={{ 
              rotateY: [0, 180, 0],
              transition: { duration: 2, repeat: Infinity, repeatDelay: 5 }
            }}
          >
            <Flag className="h-5 w-5 text-red-600" />
          </motion.div>
          <span className="text-sm font-medium text-foreground/70">{t('norway_focused')}</span>
        </div>
        
        <div className="text-center mb-8">
          <AnimatedText
            text={t('norway_specific_title')}
            tag="h2"
            className="text-2xl md:text-3xl font-bold mb-3 text-foreground"
          />
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-red-600 to-blue-600 rounded-full mb-4" />
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px] hover:bg-white/8 group"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-2.5 rounded-lg text-white">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{t('regulatory_compliance')}</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              {t('regulatory_desc')}
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-red-600/50 to-blue-600/50 rounded-full transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px] hover:bg-white/8 group"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{t('expertise_gap')}</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              {t('expertise_desc')}
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-blue-600/50 to-red-600/50 rounded-full transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:translate-y-[-5px] hover:bg-white/8 group"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-white to-gray-200 p-2.5 rounded-lg text-blue-600">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{t('workflow')}</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              {t('workflow_desc')}
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-white/50 to-blue-600/50 rounded-full transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </motion.div>
        </motion.div>
        
        {/* Norwegian-specific CTA button */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            className="rounded-full px-8 neo-button group relative overflow-hidden"
            onClick={handleGetAuditClick}
          >
            <span className="relative z-10">{t('get_compliance_audit')}</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-white/20 to-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NorwegianPainPoints;
