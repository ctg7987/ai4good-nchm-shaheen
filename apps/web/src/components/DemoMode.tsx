import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    { step: 1, title: 'تسجيل الدخول', description: 'أشعر بالتوتر قبل الامتحان', ai: '🤖 تحليل المشاعر AI' },
    { step: 2, title: 'محادثة AI', description: 'الدردشة مع مساعد العلاج Ollama', ai: '🧠 Ollama LLM' },
    { step: 3, title: 'إدخال الصوت', description: 'تسجيل صوت بالعربية', ai: '🎤 ArTST Speech-to-Text' },
    { step: 4, title: 'توليد القصص المصورة', description: 'إنشاء قصة مصورة بواسطة AI', ai: '🎨 Stable Diffusion v2.1' },
    { step: 5, title: 'الإشراف على المحتوى', description: 'فحص السلامة بواسطة AI', ai: '🛡️ Content Safety AI' },
    { step: 6, title: 'الميزات المميزة', description: 'مقارنة مجاني مقابل مميز', ai: '💎 Freemium Model' },
    { step: 7, title: 'إكمال المهمة', description: 'تمرين التنفس لمدة 90 ثانية', ai: '🧘 Guided Wellness' },
    { step: 8, title: 'كسب الريش', description: 'حصول على ريشة جديدة', ai: '🪶 Gamification' },
    { step: 9, title: 'عرض التأثير', description: 'إحصائيات التقدم', ai: '📊 Analytics' }
  ] : [
    { step: 1, title: '🔵 Check-in', description: 'I feel stressed before the exam', ai: '🤖 Emotion Analysis AI' },
    { step: 2, title: '💬 AI Chat', description: 'Chat with Ollama therapy assistant', ai: '🧠 Ollama LLM' },
    { step: 3, title: '🎤 Voice Input', description: 'Record Arabic voice input', ai: '🎙️ ArTST Speech-to-Text' },
    { step: 4, title: '🎨 Comic Generation', description: 'Generate AI-powered comic story', ai: '🖼️ Stable Diffusion v2.1' },
    { step: 5, title: '🛡️ Content Moderation', description: 'AI safety check in action', ai: '✅ Content Safety AI' },
    { step: 6, title: '💎 Premium Features', description: 'Free vs Premium comparison', ai: '💰 Freemium Model' },
    { step: 7, title: '🧘 Complete Task', description: 'Breathing exercise for 90s', ai: '🌬️ Guided Wellness' },
    { step: 8, title: '🪶 Earn Feathers', description: 'Gain a new feather reward', ai: '🎮 Gamification' },
    { step: 9, title: '📊 View Impact', description: 'Progress statistics dashboard', ai: '📈 Analytics' }
  ];

  const runDemo = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStep(0);

    try {
      // Step 1: Navigate to CheckIn and simulate mood selection
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Navigate to AI Chat
      setCurrentStep(2);
      navigate('/ollama-chat');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Demonstrate voice input
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 4: Generate comic with AI
      setCurrentStep(4);
      navigate('/story', { 
        state: { 
          sessionId: Date.now(),
          isDemo: true
        } 
      });
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Step 5: Show content moderation
      setCurrentStep(5);
      navigate('/feathers');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Step 6: Show premium comparison
      setCurrentStep(6);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Step 7: Navigate to Task and complete it
      setCurrentStep(7);
      navigate('/task');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate task completion
      await FeatherService.awardTaskCompletion('breathing');
      setParticleTrigger(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 8: Show feather earning
      setCurrentStep(8);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 9: Navigate to Impact
      setCurrentStep(9);
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
      <div className="fixed top-4 left-4 z-50 flex flex-col space-y-2">
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
        
        <motion.button
          onClick={() => {
            LanguageService.resetToDefault();
            window.location.reload();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentLanguage === 'ar' ? '🔄 إعادة تعيين اللغة' : '🔄 Reset to Arabic'}
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
                {currentLanguage === 'ar' ? 'عرض توضيحي - رحلة شاهين' : 'Demo – Shaheen Journey'}
              </h3>
              
              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    className={`p-3 rounded-lg ${
                      currentStep >= step.step 
                        ? 'bg-green-50 border-2 border-green-300' 
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          currentStep >= step.step 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {currentStep > step.step ? '✓' : step.step}
                        </div>
                        <div className="font-medium">{step.title}</div>
                      </div>
                      {currentStep === step.step && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="text-blue-600"
                        >
                          ⚡
                        </motion.div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 ml-9">{step.description}</div>
                    <div className="text-xs text-purple-600 font-semibold ml-9 mt-1">{step.ai}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
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
