import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Mic, Image, Shield, Sparkles } from 'lucide-react';

interface AITransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AITransparencyModal: React.FC<AITransparencyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const aiModels = [
    {
      icon: <Brain className="w-8 h-8" />,
      name: 'Ollama LLM',
      purpose: 'Therapeutic Chat & Narrative Generation',
      description: 'Generates compassionate, culturally-sensitive responses for emotional support',
      dataUsage: 'Processes conversations locally, no data sent to external servers',
      color: 'purple'
    },
    {
      icon: <Mic className="w-8 h-8" />,
      name: 'ArTST (Arabic Speech Recognition)',
      purpose: 'Voice Input Processing',
      description: 'Converts Arabic speech to text with high accuracy',
      dataUsage: 'Audio processed in real-time, not stored permanently',
      color: 'blue'
    },
    {
      icon: <Image className="w-8 h-8" />,
      name: 'Stable Diffusion v2.1',
      purpose: 'AI Comic Generation',
      description: 'Creates therapeutic visual narratives based on your emotions',
      dataUsage: 'Text prompts only, generates images without storing personal data',
      color: 'green'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      name: 'Content Safety AI',
      purpose: 'Community Moderation',
      description: 'Ensures supportive, safe content in community spaces',
      dataUsage: 'Scans text for safety, flags inappropriate content automatically',
      color: 'red'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      name: 'Emotion Analysis AI',
      purpose: 'Plutchik-based Emotion Detection',
      description: 'Analyzes text to identify primary and secondary emotions',
      dataUsage: 'Processes text locally using emotion lexicons',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[color] || colors.purple;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">How AI Works in Shaheen</h2>
              <p className="text-lg opacity-90">
                Transparency in AI-powered mental wellbeing
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Introduction */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Our Commitment to Transparency
              </h3>
              <p className="text-blue-800 leading-relaxed">
                Shaheen uses multiple AI models to provide you with compassionate, culturally-sensitive support. 
                We believe in being completely transparent about how AI works in our app, what data is used, 
                and how your privacy is protected.
              </p>
            </div>

            {/* AI Models */}
            <div className="space-y-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-800">AI Technologies We Use</h3>
              
              {aiModels.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-xl p-6 ${getColorClasses(model.color)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {model.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1">{model.name}</h4>
                      <p className="text-sm font-semibold opacity-80 mb-3">{model.purpose}</p>
                      <p className="text-sm mb-3">{model.description}</p>
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-xs font-semibold mb-1">🔒 Data Usage:</p>
                        <p className="text-xs">{model.dataUsage}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Privacy Principles */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">
                🛡️ Our AI Privacy Principles
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-green-900">Local-First Processing:</strong>
                    <p className="text-sm text-green-800">Most AI models run locally or on our servers - your data doesn't leave our ecosystem</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-green-900">No Training on Your Data:</strong>
                    <p className="text-sm text-green-800">Your personal conversations and stories are NEVER used to train AI models</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-green-900">Anonymized Metrics Only:</strong>
                    <p className="text-sm text-green-800">If you opt-in to telemetry, only aggregated, anonymous usage stats are collected</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-green-900">You Control Your Data:</strong>
                    <p className="text-sm text-green-800">Export or delete your data anytime - no questions asked</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* AI Limitations */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">
                ⚠️ Understanding AI Limitations
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• AI cannot replace professional mental health care</li>
                <li>• Responses may occasionally be imperfect or need refinement</li>
                <li>• AI works best as a complementary tool for self-reflection</li>
                <li>• For crisis situations, always contact emergency services or a crisis helpline</li>
                <li>• This is an emotional learning tool, not medical advice</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Small inline info button component
interface AIInfoButtonProps {
  onClick: () => void;
  className?: string;
}

export const AIInfoButton: React.FC<AIInfoButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors ${className}`}
      title="Learn how AI works"
    >
      <span>ℹ️</span>
      <span>How AI Works</span>
    </button>
  );
};
