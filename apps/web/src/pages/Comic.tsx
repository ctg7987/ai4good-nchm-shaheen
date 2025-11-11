import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PhoneFrame } from '../components/PhoneFrame';
import { LanguageService, Language } from '../lib/language';

export const Comic: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [thoughts, setThoughts] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LanguageService.getCurrentLanguage());
  
  const { storyText, character, suggestedCaption } = location.state || {};
  const isArabic = currentLanguage === 'ar';
  
  // Initialize thoughts with suggested caption if available
  useEffect(() => {
    if (suggestedCaption) {
      setThoughts(suggestedCaption);
    }
  }, [suggestedCaption]);

  useEffect(() => {
    const handleLang = (e: CustomEvent) => setCurrentLanguage(e.detail.language);
    window.addEventListener('languagechange', handleLang as EventListener);
    return () => window.removeEventListener('languagechange', handleLang as EventListener);
  }, []);

  const handleBack = () => navigate(-1);

  const handleThoughtsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setThoughts(e.target.value);
  };

  const generatedImage = '/comic1.png';

  const handlePost = () => {
    // Navigate to feed with the comic data
    navigate('/feed', {
      state: {
        comic: {
          storyText,
          character,
          thoughts: thoughts.trim(),
          image: generatedImage,
          timestamp: new Date()
        }
      }
    });
  };

  const handleContinueWithoutPost = () => {
    navigate('/feed');
  };

  const sectionVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <PhoneFrame>
      <div className="h-full bg-[#0E4A3B] flex flex-col pb-24" dir="auto">
        <div className="flex-1 overflow-y-auto">
          {/* Back button */}
          <motion.div 
            variants={sectionVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 0.6 }}
            className="px-6 pt-6"
          >
            <button 
              onClick={handleBack} 
              className={`flex items-center gap-2 text-[#F5F5F5] hover:text-white transition-colors ${isArabic ? 'justify-end w-full' : ''}`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-medium" style={{ fontFamily: 'Inter, system-ui' }}>
                {isArabic ? 'رجوع' : 'Back'}
              </span>
            </button>
          </motion.div>

          {/* Title */}
          <motion.div 
            variants={sectionVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`px-6 ${isArabic ? 'text-right' : 'text-center'}`}
          >
            <h1 
              className="text-4xl md:text-5xl" 
              style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: '#F8FAFC' }}
            >
              {isArabic ? 'قصتك' : 'Your Story'}
            </h1>
          </motion.div>

          {/* Single Comic Image */}
          <motion.div 
            variants={sectionVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-6 mt-4"
          >
            <div className="max-w-xl mx-auto bg-[#155244] rounded-3xl p-5 shadow-lg border border-[#103a30]">
              <div className="w-full aspect-square bg-[#1b4d3f] rounded-2xl overflow-hidden">
                <img 
                  src={generatedImage} 
                  alt={isArabic ? 'القصة المصورة' : 'Comic'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    (e.target as HTMLImageElement).src = character?.image || '/falcon.png';
                  }}
                />
              </div>
            </div>
          </motion.div>

          <div className="px-6 space-y-8 mt-6 max-w-xl mx-auto">

            {/* Thoughts Input */}
            <motion.div 
              variants={sectionVariants} 
              initial="hidden" 
              animate="visible" 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
              <p className={`text-xs mb-2 ${isArabic ? 'text-right' : ''}`} style={{ color: '#475569', fontFamily: 'Inter, system-ui', fontWeight: 500 }}>
                {isArabic ? 'التعليق المقترح من تحليل المشاعر' : 'Suggested caption from emotion analysis'}
              </p>
              <textarea
                value={thoughts}
                onChange={handleThoughtsChange}
                placeholder={suggestedCaption || (isArabic ? 'أضف أفكارك...' : 'Add your thoughts...')}
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#FCD34D] focus:outline-none resize-none"
                style={{ fontFamily: 'Inter, system-ui', color: '#334155' }}
                rows={4}
                dir="auto"
              />
            </motion.div>

            {/* Post Button */}
            <motion.div 
              variants={sectionVariants} 
              initial="hidden" 
              animate="visible" 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pb-8 space-y-3"
            >
              <button
                onClick={handlePost}
                className="w-full h-12 rounded-full font-medium transition-all"
                style={{ 
                  background: '#FCD34D', 
                  color: '#0E4A3B', 
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  fontFamily: 'Inter, system-ui'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(252,211,77,0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                }}
              >
                {isArabic ? 'نشر على شاهين' : 'Post to Shaheen'}
              </button>

              <button
                onClick={handleContinueWithoutPost}
                className="w-full h-12 rounded-full font-medium transition-all border-2 border-white/30 text-white hover:bg-white/10"
                style={{ 
                  fontFamily: 'Inter, system-ui'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                {isArabic ? 'تخطي / Continue without posting' : 'Skip / Continue without posting'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};