import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageService } from '../lib/language';
import { PhoneFrame } from '../components/PhoneFrame';

interface BreathingExercise {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  duration: number; // in seconds
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
}

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'calm',
    name: 'Calm Breathing',
    nameAr: 'التنفس الهادئ',
    description: 'A gentle breathing exercise to help you relax and find peace.',
    descriptionAr: 'تمرين تنفس لطيف لمساعدتك على الاسترخاء وإيجاد السلام.',
    duration: 300, // 5 minutes
    pattern: { inhale: 4, hold: 4, exhale: 6, pause: 2 }
  },
  {
    id: 'anxiety',
    name: 'ゼロ Anxiety Relief',
    nameAr: 'تخفيف القلق',
    description: 'Designed specifically to help reduce anxiety and racing thoughts.',
    descriptionAr: 'مصمم خصيصاً للمساعدة في تقليل القلق والأفكار المتسارعة.',
    duration: 480, // 8 minutes
    pattern: { inhale: 3, hold: 2, exhale: 5, pause: 2 }
  },
  {
    id: 'energy',
    name: 'Energy Boost',
    nameAr: 'زيادة الطاقة',
    description: 'An energizing breathing pattern to help you feel more alert and focused.',
    descriptionAr: 'نمط تنفس منشط لمساعدتك على الشعور بمزيد من اليقظة والتركيز.',
    duration: 240, // 4 minutes
    pattern: { inhale: 2, hold: 1, exhale: 2, pause: 1 }
  }
];

export const Breathing: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  
  const currentLanguage = LanguageService.getCurrentLanguage();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedExercise) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, selectedExercise]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedExercise) {
      let phaseTime = 0;
      let currentPhaseIndex = 0;
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
      
      interval = setInterval(() => {
        phaseTime++;
        const currentPhaseDuration = phases[currentPhaseIndex] === 'inhale' ? selectedExercise.pattern.inhale :
                                   phases[currentPhaseIndex] === 'hold' ? selectedExercise.pattern.hold :
                                   phases[currentPhaseIndex] === 'exhale' ? selectedExercise.pattern.exhale :
                                   selectedExercise.pattern.pause;
        
        if (phaseTime >= currentPhaseDuration) {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          setCurrentPhase(phases[currentPhaseIndex]);
          phaseTime = 0;
          
          if (phases[currentPhaseIndex] === 'inhale') {
            setCycleCount(prev => prev + 1);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, selectedExercise]);

  const handleStartExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.duration);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setIsActive(true);
  };

  const handleStopExercise = () => {
    setIsActive(false);
    setTimeRemaining(0);
    setCurrentPhase('inhale');
    setCycleCount(0);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'استنشق / Breathe In';
      case 'hold': return 'احبس / Hold';
      case 'exhale': return 'ازفر / Breathe Out';
      case 'pause': return 'توقف / Pause';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'bg-green-400';
      case 'hold': return 'bg-green-600';
      case 'exhale': return 'bg-green-300';
      case 'pause': return 'bg-stone-300';
      default: return 'bg-stone-300';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            تمارين التنفس / Breathing Exercises
          </h1>
          <div className="w-16 h-1 bg-green-800 mx-auto rounded-full mb-4"></div>
          <p className="text-stone-600 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            تقنيات CBT للاسترخاء وإدارة القلق / CBT techniques for relaxation and anxiety management
          </p>
        </motion.div>

        {/* Active Exercise */}
        {isActive && selectedExercise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg border-2 border-stone-200 p-8 mb-8"
          >
            {/* Timer */}
            <div className="text-center mb-8">
              <div className="text-4xl font-light text-stone-800 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-stone-500">
                دورة / Cycle {cycleCount}
              </div>
            </div>

            {/* Breathing Circle */}
            <div className="flex justify-center mb-8">
              <div className={`w-64 h-64 rounded-full transition-all duration-1000 ${getPhaseColor()} flex items-center justify-center shadow-lg`}>
                <div className="text-white text-2xl font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {getPhaseText()}
                </div>
              </div>
            </div>

            {/* Exercise Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-stone-800 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {currentLanguage === 'ar' ? selectedExercise.nameAr : selectedExercise.name}
              </h3>
              <p className="text-stone-600 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {currentLanguage === 'ar' ? selectedExercise.descriptionAr : selectedExercise.description}
              </p>
            </div>

            {/* Stop Button */}
            <div className="text-center">
              <button
                onClick={handleStopExercise}
                className="bg-red-500 text-white px-8 py-3 rounded-full font-medium hover:bg-red-600 transition-colors duration-300"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                توقف / Stop
              </button>
            </div>
          </motion.div>
        )}

        {/* Exercise Selection */}
        {!isActive && (
          <div className="space-y-4">
            {BREATHING_EXERCISES.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-stone-800 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {currentLanguage === 'ar' ? exercise.nameAr : exercise.name}
                    </h3>
                    <p className="text-stone-600 text-sm mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {currentLanguage === 'ar' ? exercise.descriptionAr : exercise.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span>
                        المدة: / Duration: {Math.floor(exercise.duration / 60)}m
                      </span>
                      <span>
                        النمط: / Pattern: {exercise.pattern.inhale}-{exercise.pattern.hold}-{exercise.pattern.exhale}-{exercise.pattern.pause}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartExercise(exercise)}
                    className="ml-4 bg-green-800 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors duration-300"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    ابدأ / Start
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl shadow-sm border border-stone-200 p-6"
          >
            <h3 className="text-lg font-medium text-stone-800 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              نصائح للتنفس الصحيح: / Tips for proper breathing:
            </h3>
            <ul className="space-y-2 text-sm text-stone-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>• اجلس أو استلقي في وضع مريح / Sit or lie in a comfortable position</li>
              <li>• اغمض عينيك وركز على تنفسك / Close your eyes and focus on your breathing</li>
              <li>• تنفس بعمق من خلال أنفك / Breathe deeply through your nose</li>
              <li>• لا تجهد نفسك - ابدأ ببطء / Don't strain yourself - start slowly</li>
            </ul>
          </motion.div>
        )}
        </div>
      </div>
    </PhoneFrame>
  );
};
