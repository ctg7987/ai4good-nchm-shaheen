import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LanguageService } from '../lib/language';
import { PhoneFrame } from '../components/PhoneFrame';
import { ContentModerationBadge } from '../components/ContentModeration';
import { Feather as FeatherIcon } from 'lucide-react';

interface FeatherPost {
  id: string;
  text: string;
  timestamp: Date;
  points: number;
  isAnonymous: boolean;
}

// Mock data for feathers of hope
const MOCK_FEATHERS: FeatherPost[] = [
  {
    id: '1',
    text: 'Remember that every storm passes, and you are stronger than you think.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    points: 45,
    isAnonymous: true
  },
  {
    id: '2',
    text: 'Today I smiled at a stranger and they smiled back. Small acts of kindness create ripples of hope.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    points: 32,
    isAnonymous: true
  },
  {
    id: '3',
    text: 'You are not alone in your struggles. There are people who care and want to help.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    points: 67,
    isAnonymous: true
  },
  {
    id: '4',
    text: 'Progress is not always linear. It\'s okay to have setbacks - they don\'t define your journey.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    points: 28,
    isAnonymous: true
  }
];

export const FeathersOfHope: React.FC = () => {
  const [feathers, setFeathers] = useState<FeatherPost[]>(MOCK_FEATHERS);
  const [newFeatherText, setNewFeatherText] = useState('');
  const [userPoints, setUserPoints] = useState(150);
  const currentLanguage = LanguageService.getCurrentLanguage();
  const coffeeCoupons = Math.floor(userPoints / 50);

  const handleFeatherSubmit = () => {
    if (newFeatherText.trim().length > 0 && newFeatherText.trim().length <= 200) {
      const newFeather: FeatherPost = {
        id: Date.now().toString(),
        text: newFeatherText.trim(),
        timestamp: new Date(),
        points: 0,
        isAnonymous: true
      };
      
      setFeathers(prev => [newFeather, ...prev]);
      setUserPoints(prev => prev + 10); // Award points for posting
      setNewFeatherText('');
    }
  };

  const handleFeatherVote = (featherId: string) => {
    setFeathers(prev => prev.map(feather => 
      feather.id === featherId 
        ? { ...feather, points: feather.points + 1 }
        : feather
    ));
    setUserPoints(prev => prev + 1); // Award point for voting
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return currentLanguage === 'ar' ? 'الآن' : 'now';
    if (diffInMinutes < 60) return currentLanguage === 'ar' ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return currentLanguage === 'ar' ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
  };

  return (
    <PhoneFrame>
      <div className="h-full bg-[#0E4A3B] flex flex-col pb-24">
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-20 px-6 pt-6 pb-4 bg-[#0E4A3B]">
            <div className="w-full max-w-2xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 text-white"
              >
                <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  ريش الأمل / Feathers of Hope
                </h1>
                <div className="w-16 h-1 bg-white/60 mx-auto rounded-full mb-4"></div>
                
                {/* User Points */}
                <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur px-8 py-5 rounded-full border border-white/20 shadow-lg max-w-xl mx-auto">
                  <div className="flex flex-col items-center gap-1 min-w-[120px]">
                    <span className="text-white/70 text-xs uppercase tracking-[0.3em]">
                      {currentLanguage === 'ar' ? 'النقاط' : 'points'}
                    </span>
                    <span className="text-4xl font-semibold text-white leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {userPoints}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-white/20"></div>
                  <div className="flex flex-col items-center gap-1 min-w-[120px]">
                    <span className="text-white/70 text-xs uppercase tracking-[0.3em]">
                      {currentLanguage === 'ar' ? 'قهوة' : 'coffee tokens'}
                    </span>
                    <span className="text-4xl font-semibold text-white leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {coffeeCoupons}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="px-6 pb-32">
            <div className="w-full max-w-2xl mx-auto">

        {/* Create New Feather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg border border-white/10 p-6 mb-8"
        >
          <h2 className="text-lg font-medium text-[#0E4A3B] mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            اترك ريشة أمل / Leave a feather of hope
          </h2>
          <textarea
            value={newFeatherText}
            onChange={(e) => setNewFeatherText(e.target.value)}
            placeholder="اكتب رسالة أمل أو تشجيع (أقل من 200 كلمة)... / Write a message of hope or encouragement (under 200 words)..."
          className={`w-full h-24 p-4 text-sm border border-[#dcdcdc] rounded-2xl resize-none focus:outline-none transition-all duration-300 ${
              currentLanguage === 'ar' ? 'text-right' : 'text-left'
            }`}
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: '1.5'
            }}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            maxLength={200}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-stone-500">
              {newFeatherText.length}/200
            </span>
            <button
              onClick={handleFeatherSubmit}
              disabled={newFeatherText.trim().length === 0}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                newFeatherText.trim().length > 0
                  ? 'bg-[#0E4A3B] text-white hover:bg-[#0c3d32]'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {currentLanguage === 'ar' ? 'نشر' : 'Publish'}
            </button>
          </div>
        </motion.div>

        {/* Feathers List */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {feathers.map((feather, index) => (
            <motion.div
              key={feather.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-[#d9e5dd] p-6 text-[#0E4A3B]"
            >
              <div className="flex items-start gap-4">
                {/* Feather Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#0E4A3B] flex items-center justify-center text-white">
                    <FeatherIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#0E4A3B]/60">{formatTimeAgo(feather.timestamp)}</span>
                    <ContentModerationBadge safetyScore={98} isApproved={true} />
                  </div>
                  <p className="text-sm text-[#0E4A3B]/90 mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6' }}>
                    {feather.text}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleFeatherVote(feather.id)}
                        className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 text-[#0E4A3B]"
                      >
                        <FeatherIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{feather.points}</span>
                      </button>
                      <span className="text-xs text-[#0E4A3B]/60">
                        {formatTimeAgo(feather.timestamp)}
                      </span>
                    </div>
                    <span className="text-xs text-[#0E4A3B]/60">
                      مجهول / Anonymous
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
</PhoneFrame>
  );
};
