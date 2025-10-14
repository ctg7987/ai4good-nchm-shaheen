import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PLUTCHIK_EMOTIONS, MoodSelection } from '../types/plutchik';
import { db } from '../lib/database';
import { apiClient } from '../lib/api';
import { FeatherService } from '../lib/featherService';
import { FeatherParticles } from '../components/FeatherParticles';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodSelection | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);

  const handleMoodSelect = (emotion: typeof PLUTCHIK_EMOTIONS[0], intensity: number) => {
    setSelectedMood({ emotion, intensity });
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      // Save session to local database
      const sessionId = await db.sessions.add({
        timestamp: new Date(),
        mood: selectedMood.emotion.nameAr,
        notes: notes.trim() || undefined
      });
      
      // Award feathers for daily check-in
      await FeatherService.awardDailyCheckin();
      setParticleTrigger(prev => prev + 1);
      
      // Generate narrative from API
      const narrativeResponse = await apiClient.postNarrative({
        text_ar: notes.trim() || selectedMood.emotion.nameAr,
        mood: selectedMood.emotion.id
      });
      
      // Reset form
      setSelectedMood(null);
      setNotes('');
      
      // Navigate to story with narrative data
      navigate('/story', { 
        state: { 
          narrative: narrativeResponse,
          sessionId 
        } 
      });
    } catch (error) {
      console.error('Failed to save session or generate narrative:', error);
      // Still navigate even if API fails
      navigate('/story', { state: { sessionId: Date.now() } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
          كيف تشعر اليوم؟
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          اختر المشاعر التي تعكس حالتك الحالية
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {PLUTCHIK_EMOTIONS.map((emotion) => (
          <motion.button
            key={emotion.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(emotion, 1)}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
              selectedMood?.emotion.id === emotion.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-primary-300'
            }`}
            style={{ backgroundColor: emotion.color + '20' }}
            aria-label={`اختيار مشاعر ${emotion.nameAr}`}
            role="button"
          >
            <div className="text-xl sm:text-2xl mb-2">😊</div>
            <div className="font-medium text-xs sm:text-sm">{emotion.nameAr}</div>
          </motion.button>
        ))}
      </div>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card mb-6"
        >
          <h3 className="font-semibold mb-4">ملاحظات إضافية (اختياري)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اكتب أي أفكار أو مشاعر إضافية..."
            className="input min-h-[100px] resize-none"
          />
        </motion.div>
      )}

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary text-lg px-8 py-3 disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'متابعة'}
          </button>
        </motion.div>
      )}
      
      <FeatherParticles trigger={particleTrigger} />
    </div>
  );
};
