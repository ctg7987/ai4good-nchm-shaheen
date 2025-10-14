import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoryResponse } from '../lib/api';

export const Story: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const loadStory = async () => {
      try {
        // Check if we have narrative data from navigation state
        if (location.state?.narrative) {
          setStory(location.state.narrative);
        } else {
          // Fallback to mock story
          const mockStory: StoryResponse = {
            metaphor: 'مثل شجرة في عاصفة، أوراقها تتساقط لكن جذورها تبقى قوية',
            scene: 'تخيل نفسك كشجرة عريقة في حديقة، الرياح تهز أغصانك لكنك تبقى ثابتاً',
            questions: [
              'ما الذي يجعلك تشعر بالقوة في هذا الوقت؟',
              'كيف يمكنك أن تكون مثل هذه الشجرة؟',
              'ما هي الجذور التي تحافظ عليك؟'
            ]
          };
          setStory(mockStory);
        }
      } catch (err) {
        setError('فشل في تحميل القصة');
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-slate-600">جاري تحميل قصتك...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-4"
        >
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">{error}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            إعادة المحاولة
          </button>
        </motion.div>
      </div>
    );
  }

  const sections = story ? [
    { id: 'metaphor', title: 'الاستعارة', content: story.metaphor, icon: '🌳' },
    { id: 'scene', title: 'المشهد', content: story.scene, icon: '🎭' },
    { id: 'questions', title: 'أسئلة للتفكير', content: story.questions, icon: '💭' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 w-full"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-8 shadow-lg">
            <span className="text-4xl">📖</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gradient mb-6">
            Your Story Today
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore this interactive story designed just for you
          </p>
        </motion.div>

        {story && (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 w-full max-w-4xl"
            >
              <div className="flex flex-wrap justify-center gap-3">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      currentSection === index
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                        : 'text-slate-600 hover:bg-slate-100 hover:scale-105'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content Sections */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10 w-full max-w-4xl"
              >
                <div className="text-center mb-8">
                  <div className="text-5xl mb-6">{sections[currentSection].icon}</div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    {sections[currentSection].title}
                  </h2>
                </div>

                {sections[currentSection].id === 'questions' ? (
                  <div className="space-y-6">
                    {(sections[currentSection].content as string[]).map((question: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold ml-4">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 text-xl leading-relaxed">{question}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
                      {sections[currentSection].content}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-2xl"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/task')}
                className="btn-primary text-xl px-10 py-5 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span>Continue to Tasks</span>
                  <span className="text-2xl">🎯</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/impact')}
                className="btn-secondary text-xl px-10 py-5 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span>View Progress</span>
                  <span className="text-2xl">📊</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};