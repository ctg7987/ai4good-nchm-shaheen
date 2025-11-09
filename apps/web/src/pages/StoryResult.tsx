import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneFrame } from '../components/PhoneFrame';
import { LanguageService, Language } from '../lib/language';
import { apiClient, ArabicNLPAnalysisResponse } from '../lib/api';

interface GeneratedArt { image_url: string; prompt_used: string; }

export const StoryResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedText: string = location.state?.userInput || '';
  const selectedCharacter = location.state?.character;
  const incomingEmotion = location.state?.emotion;
  const suggested: string | undefined = location.state?.suggestedCaption;

  const [currentLanguage, setCurrentLanguage] = useState<Language>(LanguageService.getCurrentLanguage());
  const isArabic = currentLanguage === 'ar';
  const [analysis, setAnalysis] = useState<ArabicNLPAnalysisResponse | null>(null);
  const [art, setArt] = useState<GeneratedArt | null>(null);
  const [userCaption, setUserCaption] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onLang = (e: CustomEvent) => setCurrentLanguage(e.detail.language);
    window.addEventListener('languagechange', onLang as EventListener);
    return () => window.removeEventListener('languagechange', onLang as EventListener);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setIsLoading(true); setError(null);
        let emotionForArt = incomingEmotion || 'joy';
        if (storedText.trim()) {
          try {
            const result = await apiClient.analyzeText({ text: storedText });
            if (!active) return; setAnalysis(result);
            if (result.emotion && result.emotion !== 'other') emotionForArt = result.emotion;
          } catch { console.warn('analysis failed'); }
        }
        try {
          const artResult = await apiClient.generateArt(storedText || 'emotional wellbeing illustration', emotionForArt);
          if (!active) return; setArt(artResult);
        } catch (e) {
          console.error(e); setError(isArabic ? 'فشل توليد الصورة' : 'Art generation failed');
        }
        const baseCaption = suggested || (isArabic ? 'رحلة شعورك اليوم' : 'Your emotional journey today');
        setUserCaption(baseCaption);
      } finally { if (active) setIsLoading(false); }
    };
    run();
    return () => { active = false; };
  }, [storedText, incomingEmotion, suggested, isArabic]);

  const emotion = analysis?.emotion || incomingEmotion || 'neutral';

  const handlePost = () => {
    if (!art) return;
    setIsPosting(true);
    try {
      const payload = {
        image: art.image_url,
        ai_caption: userCaption,
        user_caption: userCaption.trim(),
        emotion,
        character: selectedCharacter?.id || 'falcon',
        timestamp: new Date().toISOString(),
        prompt_used: art.prompt_used,
        language: currentLanguage,
        sentiment: analysis?.sentiment,
        sentiment_score: analysis?.sentiment_score
      };
      console.log('Post payload', payload);
      navigate('/feed', { state: { newPost: payload } });
    } finally { setIsPosting(false); }
  };

  const skip = () => navigate('/journal');

  const titleText = isArabic ? 'قصتك' : 'Your Story';
  const postLabel = isArabic ? 'انشر في شاهين' : 'Post to Shaheen';
  const skipLabel = isArabic ? 'تخطي / المتابعة دون نشر' : 'Skip / Continue without posting';
  const thoughtsPlaceholder = isArabic ? 'أضف تعليقك أو أفكارك...' : 'Add your own caption or thoughts...';
  const emotionBadge = emotion && emotion !== 'other' ? emotion : '';

  return (
    <PhoneFrame>
      <div className="h-full bg-[#0E4A3B] flex flex-col pb-24" dir="auto">
        <div className="flex-1 overflow-y-auto px-6 pt-6">
          <div className="max-w-xl mx-auto space-y-6">
            <h1 className={`text-3xl font-light ${isArabic ? 'text-right' : 'text-center'} text-white`} style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{titleText}</h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="bg-white/10 rounded-3xl p-5 flex flex-col items-center border-2 border-[#FCD34D]"
            >
              {isLoading && (<div className="w-[320px] h-[320px] flex items-center justify-center text-sm text-gray-200">{isArabic ? 'جارٍ التحميل...' : 'Loading...'}</div>)}
              {!isLoading && art && (
                <>
                  <motion.img src={art.image_url} alt="story-art" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0 }} className="w-[320px] h-[320px] object-cover rounded-2xl shadow-md border border-[#FCD34D]/40" />
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className={`mt-4 text-sm italic ${isArabic ? 'text-right' : 'text-center'} text-white`} dir="auto">"{userCaption}"</motion.p>
                  {emotionBadge && (<span className="mt-2 text-xs px-3 py-1 rounded-full bg-[#FCD34D] text-[#0E4A3B] font-medium" dir="auto">{emotionBadge}</span>)}
                  {error && <p className="mt-2 text-xs text-red-300" dir="auto">{error}</p>}
                </>
              )}
            </motion.div>
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
              <textarea value={userCaption} onChange={(e) => setUserCaption(e.target.value)} placeholder={thoughtsPlaceholder} className="w-full min-h-[110px] p-3 rounded-xl bg-white text-[#0E4A3B] placeholder-gray-400 focus:outline-none resize-none" style={{ fontFamily: 'Inter, system-ui' }} dir="auto" />
              {analysis && (
                <div className="mt-3 text-xs text-[#0E4A3B] opacity-70" dir="auto">{isArabic ? 'تحليل الشعور:' : 'Emotion analysis:'} {analysis.emotion} · {isArabic ? 'الميل:' : 'Sentiment:'} {analysis.sentiment}</div>
              )}
            </div>
            <div className="space-y-3">
              <button onClick={handlePost} disabled={!art || isPosting} className={`w-full rounded-full py-3 font-medium transition-all ${isPosting ? 'opacity-60 pointer-events-none' : 'hover:shadow-[0_0_8px_rgba(14,74,59,0.4)]'} text-white`} style={{ background: '#0E4A3B', fontFamily: 'Inter, system-ui' }}>{isPosting ? (isArabic ? 'جاري النشر...' : 'Posting...') : postLabel}</button>
              <button onClick={skip} className="w-full text-center text-gray-400 text-sm hover:text-gray-300" style={{ fontFamily: 'Inter, system-ui' }}>{skipLabel}</button>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};

export default StoryResult;

