
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import LocationGreeting from '@/components/LocationGreeting';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { HeroActions } from './HeroActions';
import { HeroVoiceInput } from './HeroVoiceInput';

interface HeroContentProps {
  chatInputValue: string;
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  isTranscribing: boolean;
  useGeminiApi: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  chatInputValue,
  isListening,
  transcript,
  toggleListening,
  isVoiceSupported,
  isTranscribing,
  useGeminiApi
}) => {
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';

  return (
    <div className="container mx-auto max-w-4xl relative z-10 mt-10 md:mt-20">
      <div className="absolute top-0 right-0 md:right-4 flex items-center gap-3">
        <LanguageSwitcher variant="dropdown" />
      </div>
      
      <div className="text-center mb-6">
        <LocationGreeting className="mb-2 text-muted-foreground" />
      </div>
      
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-8">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-foreground dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isNorwegian ? t('norway_title') : "How can AI automation help your business?"}
        </motion.h1>
        
        <motion.p
          className="text-lg text-muted-foreground dark:text-gray-300 text-center max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isNorwegian ? t('hero_subtitle') : "Ask me anything about AI automation, workflow optimization, or how to reduce costs with intelligent systems"}
        </motion.p>
        
        <HeroVoiceInput 
          chatInputValue={chatInputValue}
          isListening={isListening}
          transcript={transcript}
          toggleListening={toggleListening}
          isVoiceSupported={isVoiceSupported}
          isTranscribing={isTranscribing}
          useGeminiApi={useGeminiApi}
        />
        
        <HeroActions />
      </div>
    </div>
  );
};
