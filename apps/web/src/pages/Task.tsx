import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/database';
import { FeatherService } from '../lib/featherService';
import { FeatherParticles } from '../components/FeatherParticles';

export const Task: React.FC = () => {
  const [taskType, setTaskType] = useState<'breathing' | 'journal' | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [journalContent, setJournalContent] = useState('');
  const [feathers, setFeathers] = useState(0);
  const [particleTrigger, setParticleTrigger] = useState(0);

  const startBreathing = () => {
    setTaskType('breathing');
    setTimeLeft(90); // 90 seconds
    setIsActive(true);
  };

  const startJournal = () => {
    setTaskType('journal');
    setTimeLeft(180); // 3 minutes
    setIsActive(true);
  };

  const completeTask = async () => {
    if (!taskType) return;

    try {
      // Save entry to database
      await db.entries.add({
        sessionId: 1, // This should come from current session
        type: taskType,
        content: taskType === 'journal' ? journalContent : 'Breathing exercise completed',
        duration: taskType === 'breathing' ? 90 : 180,
        timestamp: new Date()
      });

      // Award feathers using the new service
      await FeatherService.awardTaskCompletion(taskType);
      setParticleTrigger(prev => prev + 1);
      setFeathers(prev => prev + 1);
      
      setIsActive(false);
      setTaskType(null);
      setJournalContent('');
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  useEffect(() => {
    let interval: number;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            completeTask();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (taskType === 'breathing' && isActive) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
        >
          <h1 className="text-2xl font-bold mb-6">تمرين التنفس</h1>
          <div className="text-6xl font-bold text-primary-500 mb-4">
            {formatTime(timeLeft)}
          </div>
          <p className="text-neutral-600 mb-6">
            تنفس بعمق وهدوء. استنشق لمدة 4 ثوان، احبس لمدة 4 ثوان، ازفر لمدة 4 ثوان
          </p>
          <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (taskType === 'journal' && isActive) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">كتابة يومية</h1>
            <div className="text-2xl font-bold text-primary-500">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <p className="text-neutral-600 mb-4">
            اكتب عن مشاعرك وأفكارك اليوم. لا توجد قواعد، فقط اكتب بحرية
          </p>
          
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="اكتب هنا..."
            className="input min-h-[300px] resize-none"
            autoFocus
          />
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={completeTask}
              className="btn-primary flex-1"
            >
              إنهاء
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setTaskType(null);
              }}
              className="btn-secondary"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-900 mb-4">
          مهام اليوم
        </h1>
        <p className="text-neutral-600">
          اختر نشاطاً لتحسين صحتك العاطفية
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card cursor-pointer"
          onClick={startBreathing}
        >
          <div className="text-4xl mb-4">🫁</div>
          <h2 className="text-xl font-semibold mb-2">تمرين التنفس</h2>
          <p className="text-neutral-600 mb-4">90 ثانية من التنفس العميق</p>
          <div className="text-sm text-primary-600">⏱️ 90 ثانية</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card cursor-pointer"
          onClick={startJournal}
        >
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">كتابة يومية</h2>
          <p className="text-neutral-600 mb-4">3 دقائق من الكتابة الحرة</p>
          <div className="text-sm text-primary-600">⏱️ 3 دقائق</div>
        </motion.div>
      </div>

      {feathers > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-6"
        >
          <div className="text-2xl">🪶</div>
          <p className="text-primary-600 font-medium">
            لقد حصلت على {feathers} ريشة!
          </p>
        </motion.div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.location.href = '/impact'}
          className="btn-secondary"
        >
          عرض التقدم
        </button>
      </div>
      
      <FeatherParticles trigger={particleTrigger} />
    </div>
  );
};
