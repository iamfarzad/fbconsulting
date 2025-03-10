
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocationDetection } from '@/hooks/useLocationDetection';

// Define supported languages
export type Language = 'en' | 'no';

// Interface for the context value
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'switch_language': 'Norsk',
    'language_code': 'NO',
    
    // Hero section
    'greeting_morning': 'Hi Early Riser',
    'greeting_afternoon': 'Hi Productivity Seeker',
    'greeting_evening': 'Hi Night Owl',
    'greeting_city': 'Hi {{city}} Innovator',
    'hero_subtitle': 'Transform your business with intelligent automation',
    'hero_title': 'AI Automation Solutions',
    
    // Norwegian specific content
    'norway_focused': 'AI Solutions',
    'norway_title': 'AI Automation for Businesses',
    'norway_subtitle': 'Transform your business with intelligent automation',
    
    // Pain points section
    'challenges_title': 'From Challenge to Solution',
    'challenges_subtitle': 'Common business challenges solved with AI automation',
    
    // Service cards
    'service_ai_strategy': 'AI Strategy',
    'service_ai_strategy_desc': 'Custom roadmaps for your business',
    'service_chatbots': 'AI Chatbots',
    'service_chatbots_desc': '24/7 Customer Support',
    'service_workflow': 'Workflow Automation',
    'service_workflow_desc': 'Streamline your business processes',
    
    // Norwegian pain points
    'norway_specific_title': 'Challenges We Solve',
    'regulatory_compliance': 'Regulatory Compliance',
    'regulatory_desc': 'Navigate complex GDPR, EU AI Act, and data privacy requirements with compliant AI solutions.',
    'expertise_gap': 'AI Expertise Gap',
    'expertise_desc': 'Bridge the AI knowledge gap with tailored consulting for industries like energy, manufacturing and finance.',
    'workflow': 'Workflow Automation',
    'workflow_desc': 'Optimize operations with AI automation tailored to business processes and compliance needs.',
    
    // CTAs
    'get_audit': 'Get a Free AI Audit',
    'get_compliance_audit': 'Get a Free AI Compliance Audit',
    'book_consultation': 'Book a Free Consultation',
    'contact_me': 'Contact Me',
    'no_obligation': 'No obligations, just a conversation about your business needs'
  },
  no: {
    // Common
    'switch_language': 'English',
    'language_code': 'EN',
    
    // Hero section
    'greeting_morning': 'God Morgen',
    'greeting_afternoon': 'God Dag',
    'greeting_evening': 'God Kveld',
    'greeting_city': 'Hei fra {{city}}',
    'hero_subtitle': 'GDPR-compliant AI løsninger for norske bedrifter',
    'hero_title': 'AI Automatisering for Norske Bedrifter',
    
    // Norwegian specific content
    'norway_focused': 'Norge-Fokuserte Løsninger',
    'norway_title': 'AI Automatisering for Norske Bedrifter',
    'norway_subtitle': 'GDPR-compliant AI løsninger bygget for norske forskrifter og forretningsbehov',
    
    // Pain points section
    'challenges_title': 'Fra Utfordring til Løsning',
    'challenges_subtitle': 'Vanlige forretningsutfordringer løst med AI-automatisering',
    
    // Service cards
    'service_ai_strategy': 'AI Strategi',
    'service_ai_strategy_desc': 'Tilpassede veikart for norske bedrifter',
    'service_chatbots': 'AI Chatbots',
    'service_chatbots_desc': '24/7 Kundesupport',
    'service_workflow': 'Arbeidsflytautomatisering',
    'service_workflow_desc': 'Effektiviser prosesser med fokus på samsvar',
    
    // Norwegian pain points
    'norway_specific_title': 'Norsk-Spesifikke Utfordringer Vi Løser',
    'regulatory_compliance': 'Regulatorisk Samsvar',
    'regulatory_desc': 'Naviger komplekse GDPR, EU AI Act og norske datapersonvernkrav med samsvarende AI-løsninger.',
    'expertise_gap': 'AI Kompetansegap',
    'expertise_desc': 'Bygg bro over AI-kunnskapsgapet med skreddersydd rådgivning for norske bransjer som energi, produksjon og finans.',
    'workflow': 'Arbeidsflytautomatisering',
    'workflow_desc': 'Optimaliser operasjoner med AI-automatisering skreddersydd for norske forretningsprosesser og samsvarsbehov.',
    
    // CTAs
    'get_audit': 'Få en Gratis AI-vurdering',
    'get_compliance_audit': 'Få en Gratis AI-samsvarsvurdering',
    'book_consultation': 'Book en Gratis Konsultasjon',
    'contact_me': 'Kontakt Meg',
    'no_obligation': 'Ingen forpliktelser, bare en samtale om dine forretningsbehov'
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isNorwegian } = useLocationDetection();
  const [language, setLanguage] = useState<Language>('en');
  
  // Function to translate keys
  const t = (key: string): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return translation;
  };
  
  // Set initial language based on location detection
  useEffect(() => {
    if (isNorwegian) {
      setLanguage('no');
    }
  }, [isNorwegian]);
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);
  
  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'no')) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
