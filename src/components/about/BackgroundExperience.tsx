
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import ExpertiseCard from './ExpertiseCard';
import { expertiseData } from './expertiseData';
import { useLanguage } from '@/contexts/LanguageContext';
import BulletPoint from './BulletPoint';

const BackgroundExperience = () => {
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';
  
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div 
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#fe5a1d]/10 text-[#fe5a1d] text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isNorwegian ? 'MIN BAKGRUNN' : 'MY BACKGROUND'}
          </motion.div>
          
          <AnimatedText
            text={isNorwegian ? 'Hva Jeg Gjør' : 'What I Do'}
            className="text-4xl md:text-5xl font-bold mb-6"
            tag="h2"
          />
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-[#fe5a1d] to-[#fe5a1d]/30 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          />
          
          <motion.div 
            className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              {isNorwegian
                ? 'Jeg kombinerer dyp teknisk ekspertise med en praktisk forretningsforståelse for å levere AI-løsninger som gir målbare resultater.'
                : 'I combine deep technical expertise with practical business understanding to deliver AI solutions that drive measurable results.'}
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {expertiseData.map((expertise, index) => (
            <motion.div
              key={expertise.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex"
            >
              <ExpertiseCard 
                title={isNorwegian ? expertise.titleNo : expertise.title}
                description={isNorwegian ? expertise.descriptionNo : expertise.description}
                icon={expertise.icon}
                accentColor="#fe5a1d"
              />
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-[#fe5a1d]/10 text-[#fe5a1d] w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                {isNorwegian ? 'Min Tilnærming' : 'My Approach'}
              </h3>
              <ul className="space-y-4">
                <BulletPoint>
                  {isNorwegian
                    ? 'Grundig forståelse av din virksomhet og utfordringer'
                    : 'Deep understanding of your business and challenges'}
                </BulletPoint>
                <BulletPoint>
                  {isNorwegian
                    ? 'Skreddersydde løsninger som adresserer spesifikke behov'
                    : 'Tailored solutions that address specific needs'}
                </BulletPoint>
                <BulletPoint>
                  {isNorwegian
                    ? 'Fokus på målbare resultater og ROI'
                    : 'Focus on measurable results and ROI'}
                </BulletPoint>
                <BulletPoint>
                  {isNorwegian
                    ? 'Kontinuerlig optimalisering og støtte'
                    : 'Continuous optimization and support'}
                </BulletPoint>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-[#fe5a1d]/10 text-[#fe5a1d] w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                {isNorwegian ? 'Hvorfor AI-Automatisering?' : 'Why AI Automation?'}
              </h3>
              <ul className="space-y-4">
                <BulletPoint>
                  {isNorwegian
                    ? 'Reduserer manuelle, repetitive oppgaver med opptil 80%'
                    : 'Reduces manual, repetitive tasks by up to 80%'}
                </BulletPoint>
                <BulletPoint>
                  {isNorwegian
                    ? 'Forbedrer beslutningsprosesser med datadrevet innsikt'
                    : 'Improves decision-making with data-driven insights'}
                </BulletPoint>
                <BulletPoint>
                  {isNorwegian
                    ? 'Skalerer operasjoner uten tilsvarende økning i kostnader'
                    : 'Scales operations without proportional cost increases'}
                </BulletPoint>
                <BulletPoint>
                  {isNorwegian
                    ? 'Frigjør menneskelige ressurser til mer strategisk arbeid'
                    : 'Frees human resources for more strategic work'}
                </BulletPoint>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
