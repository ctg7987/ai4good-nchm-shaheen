import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lock, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
  currentFeature?: string;
}

const FREE_FEATURES = [
  '3 Breathing Exercises per day',
  '5 AI Comics per month',
  'Basic Emotion Tracking',
  'Community Feed Access',
  'Daily Journal (Limited)',
  'Standard Support'
];

const PREMIUM_FEATURES = [
  'Unlimited Breathing Exercises',
  'Unlimited AI Comic Generation',
  'Advanced Emotion AI Analysis',
  'Priority Feed Placement',
  'Unlimited Journaling with AI Insights',
  'Premium Therapeutic Narratives',
  '24/7 Priority Support',
  'Exclusive Arabic Content',
  'Custom AI Voice Models',
  'Progress Analytics Dashboard',
  'Ad-Free Experience',
  'Export Your Data Anytime'
];

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  currentFeature
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: 4.99,
      period: 'month',
      savings: null
    },
    yearly: {
      price: 49.99,
      period: 'year',
      savings: '17%'
    }
  };

  const handleUpgrade = () => {
    onUpgrade(selectedPlan);
    onClose();
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-3xl w-[320px] max-w-[92vw] max-h-[80vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-purple-600 p-4 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold mb-1">Upgrade to Premium</h2>
              <p className="text-xs opacity-90">
                Unlock guided wellbeing made for you
              </p>
              {currentFeature && (
                <p className="mt-3 text-xs bg-white/20 inline-block px-3 py-1 rounded-full">
                  🔒 Unlock {currentFeature}
                </p>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Plan Selection */}
            <div className="flex flex-col gap-3 mb-6 justify-center">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-green-600 text-white scale-105 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-xl">${plans.monthly.price}</div>
                <div className="text-sm">per month</div>
              </button>

              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'bg-green-600 text-white scale-105 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plans.yearly.savings && (
                  <span className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Save {plans.yearly.savings}
                  </span>
                )}
                <div className="text-xl">${plans.yearly.price}</div>
                <div className="text-sm">per year</div>
              </button>
            </div>

            {/* Feature Comparison */}
            <div className="space-y-3">
              {/* Free Plan */}
              <div className="border-2 border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>Free Plan</span>
                </h3>
                <ul className="space-y-2">
                  {FREE_FEATURES.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="border-4 border-green-500 rounded-xl p-4 bg-gradient-to-br from-green-50 to-purple-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Premium Plan</span>
                </h3>
                <ul className="space-y-2">
                  {PREMIUM_FEATURES.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-800">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl text-base transition-all transform hover:scale-105 shadow-lg"
              >
                🎉 Try Premium Free for 7 Days
              </button>
              
              <p className="text-center text-xs text-gray-600">
                Cancel anytime • Instant access
              </p>

              <button
                onClick={onClose}
                className="block text-center text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Continue with Free Plan
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 text-center">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface FeatureLockedProps {
  featureName: string;
  onUpgrade: () => void;
  className?: string;
}

export const FeatureLocked: React.FC<FeatureLockedProps> = ({
  featureName,
  onUpgrade,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 text-center border-2 border-gray-300 ${className}`}
    >
      <div className="flex justify-center mb-4">
        <div className="bg-gray-300 rounded-full p-4">
          <Lock className="w-12 h-12 text-gray-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {featureName} is Premium
      </h3>
      
      <p className="text-gray-600 mb-6">
        Upgrade to Premium to unlock this feature and many more AI-powered tools
      </p>
      
      <button
        onClick={onUpgrade}
        className="bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
      >
        <Sparkles className="w-5 h-5 inline mr-2" />
        Upgrade to Premium
      </button>
    </motion.div>
  );
};
