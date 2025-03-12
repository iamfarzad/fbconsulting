
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import TimelineProgress from './TimelineProgress';
import { useLanguage } from '@/contexts/LanguageContext';

// Timeline data
const timelineItems = [
  {
    year: '2010',
    title: 'First AI Project',
    description: 'Launched my first machine learning project automating data analysis for a financial services company.',
    icon: '💼'
  },
  {
    year: '2013',
    title: 'Natural Language Processing',
    description: 'Developed an NLP system for a major retail company to analyze customer feedback at scale.',
    icon: '🔍'
  },
  {
    year: '2015',
    title: 'AI Consulting Firm',
    description: 'Founded a specialized AI consulting practice focused on business process automation.',
    icon: '🚀'
  },
  {
    year: '2018',
    title: 'Voice AI Systems',
    description: 'Pioneered voice-controlled AI systems for healthcare providers, reducing documentation time by 60%.',
    icon: '🎤'
  },
  {
    year: '2020',
    title: 'GPT Integration',
    description: 'Early adopter of GPT technology for business applications, creating custom virtual assistants.',
    icon: '🤖'
  },
  {
    year: '2023',
    title: 'AI Automation Platform',
    description: 'Launched a comprehensive AI automation platform serving clients across multiple industries.',
    icon: '✨'
  }
];

// Norwegian timeline data
const timelineItemsNO = [
  {
    year: '2010',
    title: 'Første AI-prosjekt',
    description: 'Lanserte mitt første maskinlæringsprosjekt som automatiserte dataanalyse for et finansselskap.',
    icon: '💼'
  },
  {
    year: '2013',
    title: 'Naturlig språkbehandling',
    description: 'Utviklet et NLP-system for en stor detaljhandelsvirksomhet for å analysere kundetilbakemeldinger i stor skala.',
    icon: '🔍'
  },
  {
    year: '2015',
    title: 'AI-konsulentfirma',
    description: 'Grunnla en spesialisert AI-konsulentpraksis fokusert på automatisering av forretningsprosesser.',
    icon: '🚀'
  },
  {
    year: '2018',
    title: 'Stemme-AI-systemer',
    description: 'Pionerte stemmestyrte AI-systemer for helsetjenester, reduserte dokumentasjonstid med 60%.',
    icon: '🎤'
  },
  {
    year: '2020',
    title: 'GPT-integrasjon',
    description: 'Tidlig bruker av GPT-teknologi for forretningsapplikasjoner, skapte tilpassede virtuelle assistenter.',
    icon: '🤖'
  },
  {
    year: '2023',
    title: 'AI-automatiseringsplattform',
    description: 'Lanserte en omfattende AI-automatiseringsplattform som betjener kunder på tvers av flere bransjer.',
    icon: '✨'
  }
];

const AIJourney = () => {
  const { language } = useLanguage();
  const isNorwegian = language === 'no';
  const items = isNorwegian ? timelineItemsNO : timelineItems;
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/80 pointer-events-none" />
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
            {isNorwegian ? 'MIN REISE' : 'MY JOURNEY'}
          </motion.div>
          
          <AnimatedText
            text={isNorwegian ? 'AI-Drevne Prosjekter & Milepæler' : 'AI-Driven Startups & Projects Timeline'}
            className="text-4xl md:text-5xl font-bold mb-6"
            tag="h2"
          />
          
          <motion.div 
            className="max-w-2xl mx-auto text-lg text-white/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              {isNorwegian
                ? 'Se utviklingen av min karriere innen AI-automatisering og hvordan jeg har hjulpet virksomheter med å transformere deres operasjoner.'
                : 'Track the evolution of my AI automation career and how I\'ve helped businesses transform their operations.'}
            </p>
          </motion.div>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Progress Component */}
          <TimelineProgress timelinePoints={items.map(item => ({ 
            year: item.year,
            label: item.title
          }))} accentColor="[#fe5a1d]" />
        </div>
      </div>
    </section>
  );
};

export default AIJourney;
