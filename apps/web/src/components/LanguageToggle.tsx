import React from 'react';
import { motion } from 'framer-motion';
import { LanguageService, Language, LANGUAGES } from '../lib/language';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>(LanguageService.getCurrentLanguage());

  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };
    
    window.addEventListener('languagechange' as any, handleLanguageChange);
    return () => window.removeEventListener('languagechange' as any, handleLanguageChange);
  }, []);

  const handleLanguageChange = (language: Language) => {
    LanguageService.setLanguage(language, false); // No reload
    setCurrentLanguage(language);
  };

  return (
    <div className={`flex items-center space-x-2 space-x-reverse ${className}`}>
      <span className="text-sm text-slate-600">Language:</span>
      <div className="flex bg-slate-100 rounded-lg p-1">
        {Object.values(LANGUAGES).map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              currentLanguage === lang.code
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
