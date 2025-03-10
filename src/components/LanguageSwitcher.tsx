
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'flag';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = "", 
  variant = 'default' 
}) => {
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'no' : 'en');
  };
  
  if (variant === 'minimal') {
    return (
      <button 
        onClick={toggleLanguage}
        className={cn("text-sm font-medium hover:underline", className)}
      >
        {t('language_code')}
      </button>
    );
  }
  
  if (variant === 'flag') {
    return (
      <button 
        onClick={toggleLanguage}
        className={cn("flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2", 
          language === 'no' 
            ? "border-red-600 hover:border-blue-600" 
            : "border-blue-600 hover:border-red-600", 
          className
        )}
        aria-label={`Switch to ${language === 'en' ? 'Norwegian' : 'English'}`}
      >
        <span className="text-xs font-bold">
          {t('language_code')}
        </span>
      </button>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn("rounded-full px-3 text-sm", className)}
    >
      {t('switch_language')}
    </Button>
  );
};

export default LanguageSwitcher;
