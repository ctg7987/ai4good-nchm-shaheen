import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { motion, AnimatePresence } from 'framer-motion';
import { AIProcessingIndicator, AIBadge } from '../components/AIProcessingIndicator';
import { LanguageService, Language } from '../lib/language';

interface Character {
  id: string;
  name: string;
  nameAr: string;
  image: string;
}

export const Story: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedText = location.state?.userInput || ''; // text carried from previous screen
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzingEmotion, setIsAnalyzingEmotion] = useState(false);
  const [emotionAnalysisComplete, setEmotionAnalysisComplete] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LanguageService.getCurrentLanguage());

  useEffect(() => {
    const handleLang = (e: CustomEvent) => setCurrentLanguage(e.detail.language);
    window.addEventListener('languagechange', handleLang as EventListener);
    return () => window.removeEventListener('languagechange', handleLang as EventListener);
  }, []);

  // const t = useTranslations(currentLanguage); // translations currently handled manually for new layout strings

  const characters: Character[] = [
    { id: 'falcon', name: 'Falcon', nameAr: 'صقر', image: '/falcon.png' },
    { id: 'omar', name: 'Omar', nameAr: 'عمر', image: '/omar.png' },
    { id: 'layla', name: 'Layla', nameAr: 'ليلى', image: '/layla.png' },
    { id: 'noor', name: 'Noor', nameAr: 'نور', image: '/noor.png' }
  ];

  // New heading: Select a character
  const headingText = currentLanguage === 'ar' ? 'اختر شخصية' : 'Select a character';
  const consentLabel = currentLanguage === 'ar'
    ? 'أوافق على مشاركة قصتي بشكل مجهول'
    : 'I consent to share my story anonymously';
  const consentHelper = currentLanguage === 'ar'
    ? 'هذا يسمح ل شاهين بتحليل نصك وإنشاء قصة مصورة بالذكاء الاصطناعي'
    : 'This allows Shaheen to analyze your text and create an AI comic.';
  const chooseCharacter = currentLanguage === 'ar' ? 'اختر شخصيتك' : 'Choose your character';
  const generateBase = currentLanguage === 'ar' ? 'إنشاء القصة المصورة' : 'Generate Comic';
  const analyzingText = currentLanguage === 'ar' ? 'جارٍ تحليل قصتك...' : 'Analyzing your story…';

  const handleBack = () => navigate('/');

  const startEmotionAnalysis = async () => {
    setIsAnalyzingEmotion(true);
    // Simulate analysis duration
    await new Promise(r => setTimeout(r, 2000));
    setIsAnalyzingEmotion(false);
    setEmotionAnalysisComplete(true);
  };

  // Trigger analysis when consent toggled on first time
  useEffect(() => {
    if (hasConsent && !emotionAnalysisComplete && !isAnalyzingEmotion) {
      startEmotionAnalysis();
    }
  }, [hasConsent]);

  const handleGenerate = async () => {
    if (!hasConsent || !selectedCharacter || !storedText) return;
    setIsProcessing(true);
    try {
      // Analyze endpoint
      await fetch('http://localhost:8000/api/narrative/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: storedText })
      });
      // Comic generation endpoint
      await fetch('http://localhost:8000/api/narrative/comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: storedText, character: selectedCharacter.id })
      });
      navigate('/comic', { state: { storyText: storedText, character: selectedCharacter } });
    } catch (e) {
      console.error('Generation failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const sectionVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <PhoneFrame>
      <div className="h-full bg-[#0E4A3B] flex flex-col pb-24" dir="auto">
        <div className="flex-1 overflow-y-auto px-6 pt-6">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Back button */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
              <button onClick={handleBack} className="flex items-center gap-2 text-[#F5F5F5] hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-xs font-medium" style={{ fontFamily: 'Inter, system-ui' }}>{currentLanguage === 'ar' ? 'رجوع' : 'Back'}</span>
              </button>
            </motion.div>

            {/* Title Section (Heading + badge) */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.1 }} className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: '#F5F5F5' }}>{headingText}</h1>
              <div className="flex justify-center">
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#E9D5FF', color: '#4B0082', fontFamily: 'Inter, system-ui', fontWeight: 500 }}>
                  {currentLanguage === 'ar' ? 'إنشاء قصة مصورة بالذكاء الاصطناعي ✋' : 'AI Comic Generation ✋'}
                </span>
              </div>
            </motion.div>

            {/* Character Selection (horizontal scroll) */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-md space-y-5">
              <p className="text-sm text-center" style={{ fontFamily: 'Inter, system-ui', fontWeight: 500, color: '#475569' }}>{chooseCharacter}</p>
              <div className="flex gap-4 overflow-x-auto pb-2 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                {characters.map(char => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharacter(char)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedCharacter?.id === char.id ? 'border-green-700 shadow-lg scale-105' : 'border-transparent'}`}
                    aria-label={currentLanguage === 'ar' ? char.nameAr : char.name}
                  >
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Reflection Text (read-only display) */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.3 }} className="bg-white rounded-2xl p-5 shadow-md">
              <p className="text-xs mb-2" style={{ fontFamily: 'Inter, system-ui', fontWeight: 500, color: '#475569' }}>
                {currentLanguage === 'ar' ? 'نصك المدخل' : 'Your reflection'}
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm leading-relaxed" style={{ fontFamily: 'Inter, system-ui', color: '#334155' }} dir="auto">
                {storedText || (currentLanguage === 'ar' ? 'لا يوجد نص.' : 'No text provided.')}
              </div>
            </motion.div>

            {/* Consent Section moved below text + analyzing indicator */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.4 }} className="bg-white rounded-2xl p-5 shadow-md space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="w-5 h-5 accent-green-700"
                />
                <span className="text-sm" style={{ fontFamily: 'Inter, system-ui', fontWeight: 500, color: '#334155' }}>{consentLabel}</span>
              </label>
              <p className="text-xs" style={{ fontFamily: 'Inter, system-ui', fontWeight: 300, color: '#64748B' }}>{consentHelper}</p>
              <AnimatePresence>
                {isAnalyzingEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="w-full p-3 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center gap-2"
                  >
                    <AIProcessingIndicator message={currentLanguage === 'ar' ? 'جارٍ تحليل المشاعر...' : 'Analyzing emotions...'} showBrain={false} />
                    <AIBadge text="AI" color="green" />
                  </motion.div>
                )}
                {emotionAnalysisComplete && !isAnalyzingEmotion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-3 rounded-xl bg-green-100 border border-green-300 text-center text-sm font-medium text-green-700"
                  >
                    {currentLanguage === 'ar' ? 'اكتمل تحليل المشاعر' : 'Emotion Analysis Complete!'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Generate Button at bottom */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.5 }} className="flex justify-center pt-2 pb-8">
              <button
                onClick={handleGenerate}
                disabled={!hasConsent || !selectedCharacter || !storedText || isProcessing}
                className={`w-full py-4 rounded-full font-semibold shadow-md transition-all ${( !hasConsent || !selectedCharacter || !storedText ) ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-[#FCD34D] hover:bg-[#FBBF24] text-[#0E4A3B]'} ${isProcessing ? 'animate-pulse' : ''}`}
                style={{ fontFamily: 'Inter, system-ui' }}
              >
                {isProcessing ? analyzingText : generateBase}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};