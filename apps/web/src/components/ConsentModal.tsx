import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageService } from '../lib/language';
import { useTranslations } from '../lib/translations';

interface ConsentModalProps {
  isOpen: boolean;
  onConsent: () => void;
  onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ 
  isOpen, 
  onConsent, 
  onDecline 
}) => {
  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);
  const [hasConsented, setHasConsented] = useState(false);

  // Check if user has already consented
  useEffect(() => {
    const consent = localStorage.getItem('ncmh-consent');
    if (consent === 'true') {
      onConsent();
    }
  }, [onConsent]);

  const handleConsent = () => {
    localStorage.setItem('ncmh-consent', 'true');
    setHasConsented(true);
    onConsent();
  };

  const handleDecline = () => {
    localStorage.setItem('ncmh-consent', 'false');
    onDecline();
  };

  const consentText = currentLanguage === 'ar' ? {
    title: 'موافقة على استخدام التطبيق',
    subtitle: 'أداة للتعلم العاطفي - غير سريرية',
    description: 'نرحب بك في تطبيق شاهين للرفاهية العاطفية. هذا التطبيق مصمم لمساعدتك على التعلم العاطفي والوعي الذاتي.',
    important: 'تنبيه مهم:',
    disclaimer: 'هذا التطبيق أداة للتعلم العاطفي فقط وليس بديلاً عن الاستشارة الطبية المهنية. إذا كنت تعاني من مشاكل نفسية خطيرة، يرجى التوجه إلى متخصص في الصحة النفسية.',
    dataUsage: 'سيتم استخدام بياناتك بشكل مجهول لتحسين الخدمة فقط. لن يتم مشاركة معلوماتك الشخصية مع أطراف ثالثة.',
    consent: 'أوافق على استخدام التطبيق وأفهم أن هذا أداة للتعلم العاطفي فقط',
    agree: 'موافق',
    decline: 'رفض'
  } : {
    title: 'App Usage Consent',
    subtitle: 'Emotional Learning Tool - Non-Clinical',
    description: 'Welcome to Shaheen Wellbeing App. This application is designed to help you with emotional learning and self-awareness.',
    important: 'Important Notice:',
    disclaimer: 'This app is an emotional learning tool only and is not a substitute for professional medical consultation. If you are experiencing serious mental health issues, please consult a mental health professional.',
    dataUsage: 'Your data will be used anonymously to improve the service only. Your personal information will not be shared with third parties.',
    consent: 'I agree to use the app and understand this is an emotional learning tool only',
    agree: 'Agree',
    decline: 'Decline'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                  <span className="text-2xl">🪶</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {consentText.title}
                </h1>
                <p className="text-lg text-green-600 font-medium">
                  {consentText.subtitle}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  {consentText.description}
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    {consentText.important}
                  </h3>
                  <p className="text-yellow-700">
                    {consentText.disclaimer}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {currentLanguage === 'ar' ? 'خصوصية البيانات:' : 'Data Privacy:'}
                  </h3>
                  <p className="text-blue-700">
                    {consentText.dataUsage}
                  </p>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label 
                    htmlFor="consent-checkbox" 
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    {consentText.consent}
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleConsent}
                  disabled={!hasConsented}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {consentText.agree}
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {consentText.decline}
                </button>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>
                  {currentLanguage === 'ar' 
                    ? 'تطبيق شاهين للتعلم العاطفي - غير سريري'
                    : 'Shaheen Emotional Learning App - Non-Clinical'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;
