
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { skillsData } from '@/data/skillsData';

const SkillsTechnologies = () => {
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div 
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#fe5a1d]/10 text-[#fe5a1d] text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isNorwegian ? 'TEKNISK EKSPERTISE' : 'TECHNICAL EXPERTISE'}
          </motion.div>
          
          <AnimatedText
            text={isNorwegian ? 'Ferdigheter & Teknologier' : 'Skills & Technologies'}
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
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              {isNorwegian
                ? 'Jeg holder meg oppdatert på de nyeste AI-teknologiene for å sikre at mine klienter alltid får de mest effektive løsningene.'
                : 'I stay current with the latest AI technologies to ensure my clients always get the most effective solutions.'}
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:shadow-xl hover:border-[#fe5a1d]/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-3 text-2xl"><Icon className="w-5 h-5" /></span>
                  {isNorwegian ? category.nameNo : category.name}
                </h3>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/80">
                          {isNorwegian && skill.nameNo ? skill.nameNo : skill.name}
                        </span>
                        <span className="text-sm text-[#fe5a1d]">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-[#fe5a1d] to-[#fe5a1d]/70 h-2 rounded-full"
                          style={{ width: '0%' }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.3 + skillIndex * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsTechnologies;
