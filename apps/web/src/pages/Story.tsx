import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient, StoryResponse } from '../lib/api';

export const Story: React.FC = () => {
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStory = async () => {
      try {
        // For now, use a mock story since API isn't ready
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
      } catch (err) {
        setError('فشل في تحميل القصة');
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">جاري تحميل قصتك...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          إعادة المحاولة
        </button>
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
          قصتك اليوم
        </h1>
        <p className="text-neutral-600">
          استكشف هذه القصة التفاعلية
        </p>
      </motion.div>

      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">الاستعارة</h2>
            <p className="text-lg leading-relaxed">{story.metaphor}</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">المشهد</h2>
            <p className="text-lg leading-relaxed">{story.scene}</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">أسئلة للتفكير</h2>
            <ul className="space-y-3">
              {story.questions.map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium ml-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-neutral-700">{question}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/task'}
              className="btn-primary"
            >
              المتابعة للمهام
            </button>
            <button
              onClick={() => window.location.href = '/impact'}
              className="btn-secondary"
            >
              عرض التقدم
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
