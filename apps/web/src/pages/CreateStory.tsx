import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { LanguageService, Language } from '../lib/language';
import { AIProcessingIndicator, AIBadge } from '../components/AIProcessingIndicator';

interface Character {
  id: string;
  name: string;
  nameAr: string;
  image: string;
}

const section = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const easing = { ease: 'easeInOut' as const, duration: 0.7 };

export const CreateStory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedText: string = location.state?.userInput || '';

  const [currentLanguage, setCurrentLanguage] = useState<Language>(LanguageService.getCurrentLanguage());
  const isArabic = currentLanguage === 'ar';

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isAnalyzingEmotion, setIsAnalyzingEmotion] = useState(false);
  const [emotionAnalysisComplete, setEmotionAnalysisComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedCaption, setSuggestedCaption] = useState('');

  useEffect(() => {
    const onLang = (e: CustomEvent) => setCurrentLanguage(e.detail.language);
    window.addEventListener('languagechange', onLang as EventListener);
    return () => window.removeEventListener('languagechange', onLang as EventListener);
  }, []);

  const characters: Character[] = [
    { id: 'falcon', name: 'Falcon', nameAr: 'صقر', image: '/falcon.png' },
    { id: 'omar', name: 'Omar', nameAr: 'عمر', image: '/omar.png' },
    { id: 'layla', name: 'Layla', nameAr: 'ليلى', image: '/layla.png' },
    { id: 'noor', name: 'Noor', nameAr: 'نور', image: '/noor.png' },
  ];

  // Heading should display a single word 'Characters' (English) or plural form in Arabic
  const titleText = isArabic ? 'الشخصيات' : 'Characters';
  const subtitleText = isArabic ? 'إنشاء قصة مصورة بالذكاء الاصطناعي' : 'AI Comic Generation';
  const chooseCharacter = isArabic ? 'اختر شخصيتك' : 'Choose your character';
  const reflectionLabel = isArabic ? 'نصك المدخل' : 'Your reflection';
  const consentLabel = isArabic ? 'أوافق على مشاركة قصتي بشكل مجهول.' : 'I consent to share my story anonymously.';
  const consentHelper = isArabic
    ? 'هذا يسمح ل شاهين بتحليل نصك وإنشاء قصة مصورة بالذكاء الاصطناعي.'
    : 'This allows Shaheen to analyze your text and create an AI comic.';
  const consentTooltip = isArabic
    ? 'لا يتم تخزين أي بيانات شخصية. يتم التحليل محليًا.'
    : 'No personal data is stored. Analysis happens locally.';
  const btnLabel = isArabic ? 'حوّل قصتي ' : 'Transform My Story ';
  const analyzingText = isArabic ? 'جارٍ تحليل المشاعر...' : 'Analyzing emotions...';
  const analyzingStoryText = isArabic ? 'جارٍ تحليل قصتك…' : 'Analyzing your story…';

  const handleBack = () => navigate('/')

  const startEmotionAnalysis = async () => {
    setIsAnalyzingEmotion(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzingEmotion(false);
    setEmotionAnalysisComplete(true);
    // Mock a suggested caption from analysis
    setSuggestedCaption(isArabic ? 'التحليق بنجاح' : 'Successfully flying');
  };

  useEffect(() => {
    if (hasConsent && !emotionAnalysisComplete && !isAnalyzingEmotion) {
      startEmotionAnalysis();
    }
  }, [hasConsent]);

  const handleGenerate = async () => {
    if (!hasConsent || !selectedCharacter || !storedText) return;
    setIsGenerating(true);
    try {
      // Analyze endpoint - don't wait for it, just fire and forget
      fetch('http://localhost:8000/api/v1/narrative/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: storedText })
      }).catch(err => console.log('Analysis request failed:', err));
      
      // Comic generation endpoint - don't wait for it, just fire and forget
      fetch('http://localhost:8000/api/v1/narrative/comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: storedText, character: selectedCharacter.id, emotion: analyzingText })
      }).catch(err => console.log('Comic generation request failed:', err));
      
      // Navigate immediately - don't wait for API responses
      navigate('/story-result', { state: { userInput: storedText, character: selectedCharacter, emotion: 'neutral', suggestedCaption } });
    } catch (e) {
      console.error(e);
      // Navigate even on error for demo purposes
      navigate('/story-result', { state: { userInput: storedText, character: selectedCharacter, emotion: 'neutral', suggestedCaption } });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="h-full bg-[#0E4A3B] flex flex-col pb-24" dir="auto">
        <div className="flex-1 overflow-y-auto px-6 pt-6">
          <div className="max-w-xl mx-auto">
            {/* Back */}
            <motion.button
              onClick={handleBack}
              variants={section}
              initial="hidden"
              animate="visible"
              transition={{ ...easing, delay: 0.05 }}
              className={`flex items-center gap-2 text-[#F8FAFC]/90 hover:text-white transition-colors ${isArabic ? 'justify-end w-full' : ''}`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-medium" style={{ fontFamily: 'Inter, system-ui' }}>{isArabic ? 'رجوع' : 'Back'}</span>
            </motion.button>

            {/* Title */}
            <motion.div
              variants={section}
              initial="hidden"
              animate="visible"
              transition={{ ...easing, delay: 0.1 }}
              className={`${isArabic ? 'text-right' : 'text-center'} mt-2`}
            >
              <h1
                className="text-4xl md:text-5xl"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: '#F8FAFC' }}
              >
                {titleText}
              </h1>
              <div className={`${isArabic ? 'justify-end' : 'justify-center'} flex mt-4 mb-6`}>
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#E9D5FF', color: '#4B0082', fontFamily: 'Inter, system-ui' }}>
                  {subtitleText}
                </span>
              </div>
            </motion.div>

            {/* Characters */}
            <motion.div
              variants={section}
              initial="hidden"
              animate="visible"
              transition={{ ...easing, delay: 0.3 }}
              className="bg-white/10 rounded-3xl p-4"
            >
              <p className={`text-sm ${isArabic ? 'text-right' : 'text-center'}`} style={{ color: '#CBD5E1', fontFamily: 'Inter, system-ui' }}>{chooseCharacter}</p>
              <div
                className="mt-4 flex gap-3 overflow-x-auto md:flex-wrap md:justify-center pb-1"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {characters.map((char) => {
                  const selected = selectedCharacter?.id === char.id;
                  return (
                    <div key={char.id} className="flex-shrink-0 flex flex-col items-center">
                      <button
                        onClick={() => setSelectedCharacter(char)}
                        className={`w-28 h-28 rounded-2xl overflow-hidden border-2 transition-transform duration-200 ${selected ? 'border-[#FCD34D] shadow-[0_0_10px_rgba(252,211,77,0.3)]' : 'border-transparent'} hover:scale-[1.05] ${selected ? 'scale-[1.05]' : ''}`}
                        aria-label={isArabic ? char.nameAr : char.name}
                      >
                        <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                      </button>
                      <span className="mt-2 text-xs text-gray-300" style={{ fontFamily: 'Inter, system-ui' }}>
                        {isArabic ? char.nameAr : char.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Reflection Preview */}
            <motion.div
              variants={section}
              initial="hidden"
              animate="visible"
              transition={{ ...easing, delay: 0.5 }}
              className="mt-4"
            >
              <p className={`text-xs ${isArabic ? 'text-right' : ''}`} style={{ color: '#E2E8F0', fontFamily: 'Inter, system-ui' }}>{reflectionLabel}</p>
              <div className="mt-2 bg-[#174D41] rounded-2xl p-4 italic" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, system-ui' }} dir="auto">
                <span className="mr-1">“</span>
                {storedText || (isArabic ? 'لا يوجد نص.' : 'No text provided.')}
              </div>
            </motion.div>

            {/* Consent */}
            <motion.div
              variants={section}
              initial="hidden"
              animate="visible"
              transition={{ ...easing, delay: 0.7 }}
              className="mt-5 mb-3"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded accent-[#FCD34D]"
                />
                <div className="flex-1">
                  <p className={`${isArabic ? 'text-right' : ''}`} style={{ color: '#ffffff', fontFamily: 'Inter, system-ui' }}>{consentLabel}</p>
                  <p className={`${isArabic ? 'text-right' : ''} text-sm`} style={{ color: '#9CA3AF', fontFamily: 'Inter, system-ui' }}>
                    {consentHelper}
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {isAnalyzingEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={easing}
                    className="mt-3 w-full p-3 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center gap-2"
                  >
                    <AIProcessingIndicator message={analyzingText} showBrain={false} />
                    <AIBadge text="AI" icon="" color="green" />
                  </motion.div>
                )}
                {emotionAnalysisComplete && !isAnalyzingEmotion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={easing}
                    className="mt-3 w-full p-3 rounded-xl bg-green-100 border border-green-300 text-center text-sm font-medium text-green-700"
                  >
                    {isArabic ? 'اكتمل تحليل المشاعر' : 'Emotion Analysis Complete!'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={section}
              initial="hidden"
              animate="visible"
              transition={{ ...easing, delay: 0.9 }}
              className="pb-8"
            >
              <button
                onClick={handleGenerate}
                disabled={!hasConsent || !selectedCharacter || !storedText || isGenerating}
                className={`w-full h-12 rounded-full font-medium transition-all ${(!hasConsent || !selectedCharacter || !storedText) ? 'opacity-60 pointer-events-none' : ''}`}
                style={{ background: '#FCD34D', color: '#0E4A3B', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(252,211,77,0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                }}
              >
                {isGenerating ? analyzingStoryText : btnLabel}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};

export default CreateStory;
