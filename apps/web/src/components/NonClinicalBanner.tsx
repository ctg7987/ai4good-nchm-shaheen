import React from 'react';
import { LanguageService } from '../lib/language';
import { useTranslations } from '../lib/translations';

export const NonClinicalBanner: React.FC = () => {
  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);

  return (
    <div 
      className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 py-2 px-4 text-center text-sm font-medium"
      role="banner"
      aria-label="Non-clinical alert"
    >
      <p role="alert" className="m-0">
        {t.nonClinicalBanner}
      </p>
    </div>
  );
};
