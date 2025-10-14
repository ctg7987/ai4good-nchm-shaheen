import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FeatherService } from '../lib/featherService';
import { RedemptionModal } from './RedemptionModal';

interface FeatherCounterProps {
  showRedeem?: boolean;
}

export const FeatherCounter: React.FC<FeatherCounterProps> = ({ showRedeem = true }) => {
  const [totalFeathers, setTotalFeathers] = useState(0);
  const [isRedemptionOpen, setIsRedemptionOpen] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);

  useEffect(() => {
    const loadFeathers = async () => {
      const total = await FeatherService.getTotalFeathers();
      setTotalFeathers(total);
    };

    loadFeathers();
  }, []);

  const handleRedeem = (optionId: string) => {
    // In a real app, this would make an API call
    console.log(`Redeemed option: ${optionId}`);
    // For demo, we'll just show a success message
    alert(`تم استبدال الريش بنجاح! (${optionId})`);
  };

  const triggerParticles = () => {
    setParticleTrigger(prev => prev + 1);
  };

  return (
    <>
      <motion.div
        className="flex items-center space-x-2 space-x-reverse"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
          <span className="text-xl">🪶</span>
          <span className="font-bold text-yellow-600 mr-2">
            {totalFeathers}
          </span>
        </div>
        
        {showRedeem && (
          <button
            onClick={() => setIsRedemptionOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors"
          >
            استبدال
          </button>
        )}
      </motion.div>

      <RedemptionModal
        isOpen={isRedemptionOpen}
        onClose={() => setIsRedemptionOpen(false)}
        totalFeathers={totalFeathers}
        onRedeem={handleRedeem}
      />
    </>
  );
};
