
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'flag' | 'dropdown';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = "", 
  variant = 'default',
  showLabel = true
}) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'no' : 'en');
  };
  
  const getLanguageName = (code: string) => {
    return code === 'en' ? 'English' : 'Norsk';
  };
  
  if (variant === 'minimal') {
    return (
      <button 
        onClick={toggleLanguage}
        className={cn("text-sm font-medium hover:underline flex items-center gap-2", className)}
        aria-label={`Switch to ${language === 'en' ? 'Norwegian' : 'English'}`}
      >
        <Globe className="h-4 w-4" />
        {showLabel && t('language_code')}
      </button>
    );
  }
  
  if (variant === 'flag') {
    return (
      <button 
        onClick={toggleLanguage}
        className={cn("flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 transition-colors duration-300", 
          language === 'no' 
            ? "border-red-600 hover:border-blue-600" 
            : "border-blue-600 hover:border-red-600", 
          className
        )}
        aria-label={`Switch to ${language === 'en' ? 'Norwegian' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Norwegian' : 'English'}`}
      >
        <span className="text-xs font-bold">
          {t('language_code')}
        </span>
      </button>
    );
  }
  
  if (variant === 'dropdown') {
    return (
      <div className={cn("relative group", className)}>
        <button 
          className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Select language"
          aria-haspopup="true"
        >
          <Globe className="h-4 w-4" />
          <span>{getLanguageName(language)}</span>
        </button>
        
        <div className="absolute right-0 mt-1 w-36 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100">
          <div className="py-1">
            {Object.keys(availableLanguages).map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLanguage(langCode as 'en' | 'no')}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-2 text-sm text-left",
                  language === langCode 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {getLanguageName(langCode)}
                {language === langCode && (
                  <span className="text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Default button style
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn("rounded-full px-3 text-sm flex items-center gap-2", className)}
    >
      <Globe className="h-4 w-4" />
      {t('switch_language')}
    </Button>
  );
};

export default LanguageSwitcher;
