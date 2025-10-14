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
            metaphor: 'Like a calm lake, its waters are clear and calm',
            scene: 'Imagine yourself as a beautiful lake in the morning, the water is calm and nature is still',
            questions: [
              'What makes you feel calm?',
              'How have your feelings changed since the beginning of the day?',
              'What are the simple things that bring you peace?'
            ]
          };
          setStory(mockStory);
        }
      } catch (err) {
        setError('Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 border-6 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-2xl text-slate-600">Loading your story...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl mx-4"
        >
          <div className="text-red-500 text-6xl mb-8">⚠️</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">{error}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary text-2xl px-12 py-6"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const sections = story ? [
    { id: 'metaphor', title: 'Metaphor', content: story.metaphor, icon: '🌳' },
    { id: 'scene', title: 'The Scene', content: story.scene, icon: '🎭' },
    { id: 'questions', title: 'Questions to Think About', content: story.questions, icon: '💭' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-8 shadow-2xl">
            <span className="text-6xl">📖</span>
          </div>
          <h1 className="text-7xl sm:text-8xl font-bold text-gradient mb-8">
            Your Story Today
          </h1>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Explore this interactive story designed just for you
          </p>
        </motion.div>

        {story && (
          <div className="space-y-12">
            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6"
            >
              <div className="flex flex-wrap justify-center gap-4">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`flex items-center space-x-4 px-8 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 ${
                      currentSection === index
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl scale-110'
                        : 'text-slate-600 hover:bg-slate-100 hover:scale-105'
                    }`}
                  >
                    <span className="text-3xl">{section.icon}</span>
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
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-16"
              >
                <div className="text-center mb-12">
                  <div className="text-8xl mb-8">{sections[currentSection].icon}</div>
                  <h2 className="text-5xl font-bold text-slate-800 mb-8">
                    {sections[currentSection].title}
                  </h2>
                </div>

                {sections[currentSection].id === 'questions' ? (
                  <div className="space-y-8">
                    {(sections[currentSection].content as string[]).map((question: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold ml-6">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 text-3xl leading-relaxed">{question}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-3xl text-slate-700 leading-relaxed max-w-5xl mx-auto">
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
              className="flex flex-col sm:flex-row gap-8 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/task')}
                className="btn-primary text-3xl px-16 py-8 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center space-x-4">
                  <span>Continue to Tasks</span>
                  <span className="text-4xl">🎯</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/impact')}
                className="btn-secondary text-3xl px-16 py-8 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center space-x-4">
                  <span>View Progress</span>
                  <span className="text-4xl">📊</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};