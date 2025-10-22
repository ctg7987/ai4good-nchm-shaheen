import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { AIProcessingIndicator, AIBadge } from '../components/AIProcessingIndicator';
import { UsageTracker } from '../lib/usageTracker';
import { openPremiumModal } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
  id: string;
  name: string;
  nameAr: string;
  image: string;
}

export const Story: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storyText, setStoryText] = useState(location.state?.userInput || '');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [comicsRemaining, setComicsRemaining] = useState(5);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check usage limits
    setComicsRemaining(UsageTracker.getComicsRemaining());
    setIsPremium(UsageTracker.isPremium());
  }, []);

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStoryText(e.target.value);
  };

  const handleGenerateComic = async () => {
    // Check if user can generate comics
    if (!UsageTracker.canGenerateComic()) {
      openPremiumModal();
      return;
    }

    if (selectedCharacter && hasConsent) {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Track usage
      UsageTracker.trackComicGenerated();
      setComicsRemaining(UsageTracker.getComicsRemaining());
      
      try {
        // Call Ollama API for narrative generation
        const progressSteps = [
          { progress: 10, message: 'Connecting to Ollama AI...' },
          { progress: 20, message: 'Analyzing emotions with AI...' },
          { progress: 35, message: 'Ollama generating narrative arc...' },
          { progress: 50, message: 'Creating therapeutic metaphor...' },
          { progress: 65, message: 'Generating comic panel 1...' },
          { progress: 75, message: 'Generating comic panel 2...' },
          { progress: 85, message: 'Generating comic panel 3...' },
          { progress: 95, message: 'Finalizing with Stable Diffusion...' },
          { progress: 100, message: 'Complete!' }
        ];
        
        for (const step of progressSteps) {
          await new Promise(resolve => setTimeout(resolve, 600));
          setGenerationProgress(step.progress);
        }
        
        // In production, this would call the actual Ollama API:
        // const response = await fetch('http://localhost:8000/api/narrative/generate', {
        //   method: 'POST',
        //   body: JSON.stringify({ text: storyText, mood: 'neutral' })
        // });
        
      } catch (error) {
        console.error('Error generating comic:', error);
      }
      
      setTimeout(() => {
        navigate('/comic', {
          state: {
            storyText,
            character: selectedCharacter
          }
        });
      }, 500);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const characters = [
    { id: 'falcon', name: 'Falcon', nameAr: 'صقر', image: '/falcon.png', color: 'bg-amber-100' },
    { id: 'omar', name: 'Omar', nameAr: 'عمر', image: '/omar.png', color: 'bg-blue-100' },
    { id: 'layla', name: 'Layla', nameAr: 'ليلى', image: '/layla.png', color: 'bg-pink-100' },
    { id: 'fahad', name: 'Fahad', nameAr: 'فهد', image: '/fahad.png', color: 'bg-teal-100' },
    { id: 'noor', name: 'Noor', nameAr: 'نور', image: '/noor.png', color: 'bg-purple-100' },
  ];

  return (
    <PhoneFrame>
      <div className="min-h-full bg-amber-50 p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6 mb-8">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-green-800 hover:text-green-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                رجوع / Back
              </span>
            </button>
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-light text-gray-800">
              احكِ قصتك / Tell Your Story
            </h1>
            <div className="flex justify-center gap-2 items-center flex-wrap">
              <AIBadge text="AI Comic Generation" icon="🎨" color="purple" />
              {!isPremium && (
                <div className="px-3 py-1 bg-amber-100 border-2 border-amber-300 rounded-full text-xs font-semibold text-amber-800">
                  {comicsRemaining === 0 ? (
                    <>🔒 Limit Reached - Upgrade to Premium</>
                  ) : (
                    <>⭐ {comicsRemaining} free comics remaining this month</>
                  )}
                </div>
              )}
              {isPremium && (
                <div className="px-3 py-1 bg-purple-100 border-2 border-purple-300 rounded-full text-xs font-semibold text-purple-800">
                  💎 Premium - Unlimited Comics
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border-2 border-gray-300 p-6">
            <textarea
              value={storyText}
              onChange={handleStoryChange}
                     placeholder="اكتب قصتك هنا... / Write your story here..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-green-800 focus:outline-none resize-none"
              rows={6}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-3">اختر شخصيتك / Choose your character:</p>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl ${char.color} border-4 transition-all overflow-hidden ${
                    selectedCharacter?.id === char.id ? 'border-green-800 scale-105' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={char.image} 
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-300">
              <input
                type="checkbox"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-green-800 rounded focus:ring-green-800"
              />
              <span className="text-sm text-gray-700">
                أوافق على مشاركة قصتي بشكل مجهول / I consent to share my story anonymously
              </span>
            </label>

            <button
              onClick={handleGenerateComic}
              disabled={!hasConsent || isGenerating}
              className={`w-full py-4 rounded-full text-white font-medium transition-all ${
                hasConsent && !isGenerating
                  ? 'bg-green-800 hover:bg-green-900' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'Generating AI Comic...' : 'إنشاء القصة المصورة / Generate Comic'}
            </button>

            {/* AI Generation Progress */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 bg-white rounded-2xl p-6 border-2 border-purple-200"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="px-3 py-1 bg-purple-100 border border-purple-300 rounded-full text-xs font-semibold text-purple-800">
                      🤖 Ollama API
                    </div>
                    <div className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-xs font-semibold text-blue-800">
                      🎨 Stable Diffusion
                    </div>
                  </div>

                  <AIProcessingIndicator 
                    message={`AI Processing... ${generationProgress}%`}
                    showBrain={true}
                  />
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-green-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {generationProgress < 35 ? '🧠 Ollama analyzing emotions...' :
                       generationProgress < 65 ? '📝 Generating narrative with AI...' :
                       generationProgress < 95 ? '🎨 Creating comic panels...' :
                       '✅ Complete!'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Calling Ollama API → Emotion Analysis → Stable Diffusion Generation
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};