import React from 'react';
import { OllamaChat } from '../components/OllamaChat';
import { LanguageService } from '../lib/language';
import { useTranslations } from '../lib/translations';

export const OllamaChatPage: React.FC = () => {
  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <OllamaChat />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors"
          >
            {currentLanguage === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OllamaChatPage;

