import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PLUTCHIK_EMOTIONS, MoodSelection } from '../types/plutchik';
import { db } from '../lib/database';
import { apiClient } from '../lib/api';
import { FeatherService } from '../lib/featherService';
import { FeatherParticles } from '../components/FeatherParticles';
import { LanguageService } from '../lib/language';
import { useTranslations } from '../lib/translations';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodSelection | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  
  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <FeatherParticles trigger={particleTrigger} />
      
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-8 shadow-2xl">
            <span className="text-6xl">💭</span>
          </div>
          <h1 className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8" style={{fontSize: '6rem', fontWeight: 'bold', textAlign: 'center'}}>
            {t.howAreYouFeeling}
          </h1>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed" style={{fontSize: '1.5rem', textAlign: 'center', lineHeight: '1.6'}}>
            {t.takeAMoment}
          </p>
        </motion.div>

        {/* Mood Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 mb-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-6" style={{fontSize: '2.5rem', textAlign: 'center'}}>{t.chooseYourFeelings}</h2>
            <p className="text-2xl text-slate-600" style={{fontSize: '1.5rem', textAlign: 'center'}}>{t.clickEmotions}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {PLUTCHIK_EMOTIONS.map((emotion, index) => (
              <motion.button
                key={emotion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(emotion, 1)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMood?.emotion.id === emotion.id
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl scale-105'
                    : 'border-slate-200 bg-white hover:border-green-300 hover:shadow-lg hover:bg-green-50/50'
                }`}
                style={{ 
                  padding: '1.5rem', 
                  minHeight: '180px', 
                  fontSize: '1.2rem', 
                  textAlign: 'center',
                  backgroundColor: selectedMood?.emotion.id === emotion.id ? undefined : emotion.color + '20'
                }}
                aria-label={`Choose ${emotion.nameAr}`}
                role="button"
              >
                <AnimatePresence>
                  {selectedMood?.emotion.id === emotion.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-lg">✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200" style={{fontSize: '2.5rem'}}>
                  {emotion.emoji}
                </div>
                <div className="text-lg font-bold text-slate-700 group-hover:text-green-700 transition-colors" style={{fontSize: '1.1rem', fontWeight: 'bold'}}>
                  {currentLanguage === 'ar' ? emotion.nameAr : emotion.name}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notes Section */}
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 mb-12"
            >
              <div className="text-center mb-10">
                <h3 className="text-4xl font-bold text-slate-800 mb-6">{t.shareYourThoughts}</h3>
                <p className="text-2xl text-slate-600">{t.writeAdditionalThoughts}</p>
              </div>
              
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className={`w-full h-60 p-8 border-3 border-slate-200 rounded-2xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 text-2xl leading-relaxed placeholder-slate-400 ${currentLanguage === 'ar' ? 'text-left' : 'text-right'}`}
                  dir={currentLanguage === 'ar' ? 'ltr' : 'rtl'}
                />
                <div className="absolute bottom-8 left-8 text-xl text-slate-400">
                  {notes.length} {t.characters}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { 
                  scale: 1.1,
                  y: -5,
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                className={`relative px-16 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 ${
                  !isSubmitting
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl hover:shadow-3xl hover:from-green-700 hover:to-emerald-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.processing}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-4">
                    <span>{t.startYourJourney}</span>
                    <span className="text-4xl">✨</span>
                  </div>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};