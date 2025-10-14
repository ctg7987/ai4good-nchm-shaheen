import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <FeatherParticles trigger={particleTrigger} />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-cyan-200 rounded-full opacity-20 animate-pulse delay-3000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 w-full"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg">
            <span className="text-4xl">💭</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
            How are you feeling today?
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Take a moment to reflect on your feelings. This is a safe place to explore what's inside you
          </p>
        </motion.div>

        {/* Mood Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10 mb-8 w-full max-w-5xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose your feelings</h2>
            <p className="text-xl text-slate-600">Click on the emotions that reflect your current state</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {PLUTCHIK_EMOTIONS.map((emotion, index) => (
              <motion.button
                key={emotion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(emotion, 1)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMood?.emotion.id === emotion.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50'
                }`}
                style={{ backgroundColor: selectedMood?.emotion.id === emotion.id ? undefined : emotion.color + '20' }}
                aria-label={`اختر ${emotion.nameAr}`}
                role="button"
              >
                <AnimatePresence>
                  {selectedMood?.emotion.id === emotion.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {emotion.emoji}
                </div>
                <div className="text-lg font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                  {emotion.nameAr}
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Share your thoughts</h3>
                <p className="text-xl text-slate-600">Write any additional thoughts or feelings you'd like to share</p>
              </div>
              
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write here about your feelings or what you're going through... don't hesitate to share anything that comes to mind"
                  className="w-full h-48 p-8 border-2 border-slate-200 rounded-2xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 text-xl leading-relaxed placeholder-slate-400"
                />
                <div className="absolute bottom-6 left-6 text-lg text-slate-400">
                  {notes.length} characters
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
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`relative px-16 py-6 rounded-2xl font-bold text-xl transition-all duration-300 ${
                  !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Start Your Journey</span>
                    <span className="text-2xl">✨</span>
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