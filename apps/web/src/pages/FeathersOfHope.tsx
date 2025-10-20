import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LanguageService } from '../lib/language';
import { PhoneFrame } from '../components/PhoneFrame';

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
      <div className="h-full bg-amber-50 flex flex-col pb-24">
        <div className="w-full max-w-2xl mx-auto flex-1 overflow-y-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-light text-stone-800 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            ريش الأمل / Feathers of Hope
          </h1>
          <div className="w-16 h-1 bg-green-800 mx-auto rounded-full mb-4"></div>
          
          {/* User Points */}
          <div className="flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-stone-200">
            <span className="text-2xl">🪶</span>
            <span className="text-stone-700 font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {userPoints} نقطة / points
            </span>
          </div>
        </motion.div>

        {/* Create New Feather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg border-2 border-stone-200 p-6 mb-8"
        >
          <h2 className="text-lg font-medium text-stone-700 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            اترك ريشة أمل / Leave a feather of hope
          </h2>
          <textarea
            value={newFeatherText}
            onChange={(e) => setNewFeatherText(e.target.value)}
            placeholder="اكتب رسالة أمل أو تشجيع (أقل من 200 كلمة)... / Write a message of hope or encouragement (under 200 words)..."
            className={`w-full h-24 p-4 text-sm border-0 rounded-2xl resize-none focus:outline-none transition-all duration-300 ${
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
                  ? 'bg-green-800 text-white hover:bg-green-700'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              نشر / Post
            </button>
          </div>
        </motion.div>

        {/* Feathers List */}
        <div className="space-y-4">
          {feathers.map((feather, index) => (
            <motion.div
              key={feather.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6"
            >
              <div className="flex items-start gap-4">
                {/* Feather Icon */}
                <div className="flex-shrink-0">
                  <span className="text-3xl">🪶</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-stone-700 text-sm mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6' }}>
                    {feather.text}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleFeatherVote(feather.id)}
                        className="flex items-center gap-2 hover:scale-110 transition-transform duration-200"
                      >
                        <span className="text-lg">💚</span>
                        <span className="text-stone-600 text-sm font-medium">
                          {feather.points}
                        </span>
                      </button>
                      <span className="text-xs text-stone-500">
                        {formatTimeAgo(feather.timestamp)}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">
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
    </PhoneFrame>
  );
};
