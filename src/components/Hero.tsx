
import { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGeminiSpeechRecognition } from '@/hooks/useGeminiSpeechRecognition';
// import { useGeminiInitialization } from '@/hooks/gemini'; // Temporarily commented out
import { HeroContent } from './hero/HeroContent';
import { HeroBackground } from './hero/HeroBackground';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  // const { language } = useLanguage(); // Keep if HeroContent uses it, but HeroContent props are empty now
  // const [chatInputValue, setChatInputValue] = useState(''); // Related to HeroVoiceInput
  // const { hasApiKey, getApiKey } = useGeminiInitialization(); // Keep if needed by HeroContent or HeroBackground
  
  // const useGeminiApi = hasApiKey(); // Related to HeroVoiceInput
  
  // Log API key information for debugging
  // if (useGeminiApi) {
  //   console.log('✅ Google Gemini API Key Ready');
  // } else {
  //   console.warn('⚠️ No Gemini API Key found');
  // }
  
  // const { 
  //   isListening, 
  //   transcript, 
  //   toggleListening, 
  //   isVoiceSupported,
  //   isTranscribing 
  // } = useGeminiSpeechRecognition(getApiKey(), (command) => {
  //   if (command.trim()) {
  //     console.log('Command received from speech recognition:', command);
  //     setChatInputValue(command);
  //   }
  // });

  // const handleInputChange = (value: string) => {
  //   setChatInputValue(value);
  // };
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
    >
      <HeroBackground />
      
      <HeroContent />
    </section>
  );
};

export default Hero;
