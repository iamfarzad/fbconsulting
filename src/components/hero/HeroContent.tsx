
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
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
  onInputChange?: (value: string) => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  chatInputValue,
  isListening,
  transcript,
  toggleListening,
  isVoiceSupported,
  isTranscribing,
  useGeminiApi,
  onInputChange
}) => {
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';

  return (
    <div className="container mx-auto max-w-4xl relative z-10 mt-10 md:mt-0">
      <div className="absolute top-0 right-0 md:right-4 flex items-center gap-3">
        <LanguageSwitcher variant="dropdown" />
      </div>
      
      <div className="text-center mb-6">
        <LocationGreeting className="mb-2 text-muted-foreground" />
      </div>
      
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-8">
        {isNorwegian && (
          <motion.div 
            className="bg-gradient-to-r from-red-600/10 to-blue-600/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 animate-flag-wave"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Flag className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-foreground dark:text-white">{t('norway_focused')}</span>
          </motion.div>
        )}
        
        <motion.h1 
          className="text-4xl md:text-5xl font-semibold text-foreground dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isNorwegian ? (
            <span className="relative">
              {t('norway_title')}
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-600 opacity-80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              ></motion.span>
            </span>
          ) : "How can AI automation help your business?"}
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
          onInputChange={onInputChange}
        />
        
        <HeroActions />
      </div>
    </div>
  );
};
