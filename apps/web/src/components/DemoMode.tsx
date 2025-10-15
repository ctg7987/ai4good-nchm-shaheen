import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { FeatherService } from '../lib/featherService';
import { FeatherParticles } from './FeatherParticles';
import { LanguageService } from '../lib/language';

interface DemoModeProps {
  isVisible: boolean;
}

export const DemoMode: React.FC<DemoModeProps> = ({ isVisible }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const navigate = useNavigate();
  const currentLanguage = LanguageService.getCurrentLanguage();

  const demoSteps = currentLanguage === 'ar' ? [
    { step: 1, title: 'تسجيل الدخول', description: 'أشعر بالتوتر قبل الامتحان' },
    { step: 2, title: 'توليد السرد', description: 'إنشاء استعارة علاجية' },
    { step: 3, title: 'عرض القصة', description: 'عرض السرد العلاجي' },
    { step: 4, title: 'إكمال المهمة', description: 'تمرين التنفس لمدة 90 ثانية' },
    { step: 5, title: 'كسب الريش', description: 'حصول على ريشة جديدة' },
    { step: 6, title: 'عرض التأثير', description: 'إحصائيات التقدم' }
  ] : [
    { step: 1, title: 'Check-in', description: 'I feel stressed before the exam' },
    { step: 2, title: 'Generate Narrative', description: 'Create a supportive metaphor' },
    { step: 3, title: 'Show Story', description: 'Display the narrative' },
    { step: 4, title: 'Complete Task', description: 'Breathing exercise for 90s' },
    { step: 5, title: 'Earn Feathers', description: 'Gain a new feather' },
    { step: 6, title: 'View Impact', description: 'Progress statistics' }
  ];

  const runDemo = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStep(0);

    try {
      // Step 1: Navigate to CheckIn and simulate mood selection
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Generate narrative
      setCurrentStep(2);
      const narrativeResponse = await apiClient.postNarrative({
        text_ar: "أشعر بالتوتر قبل الامتحان",
        mood: "fear"
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Navigate to Story with narrative data
      setCurrentStep(3);
      navigate('/story', { 
        state: { 
          narrative: narrativeResponse,
          sessionId: Date.now(),
          isDemo: true
        } 
      });
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Step 4: Navigate to Task and complete it
      setCurrentStep(4);
      navigate('/task');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate task completion
      await FeatherService.awardTaskCompletion('breathing');
      setParticleTrigger(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 5: Show feather earning
      setCurrentStep(5);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 6: Navigate to Impact
      setCurrentStep(6);
      navigate('/impact');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Demo error:', error);
    } finally {
      setIsRunning(false);
      setCurrentStep(0);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <motion.button
          onClick={runDemo}
          disabled={isRunning}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning 
            ? (currentLanguage === 'ar' ? 'جاري التشغيل...' : 'Running...') 
            : (currentLanguage === 'ar' ? '🎭 وضع العرض' : '🎭 Demo Mode')}
        </motion.button>
      </div>

      {/* Demo Progress Overlay */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4 relative"
            >
              <button
                onClick={() => {
                  setIsRunning(false);
                  setCurrentStep(0);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
              <h3 className="text-xl font-bold text-center mb-4">
                {currentLanguage === 'ar' ? 'عرض توضيحي - رحلة المستخدم' : 'Demo – User Journey'}
              </h3>
              
              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg ${
                      currentStep >= step.step 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= step.step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > step.step ? '✓' : step.step}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / demoSteps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {currentLanguage === 'ar' ? `الخطوة ${currentStep} من ${demoSteps.length}` : `Step ${currentStep} of ${demoSteps.length}`}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeatherParticles trigger={particleTrigger} />
    </>
  );
};
