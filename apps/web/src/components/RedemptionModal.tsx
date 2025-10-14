import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageService } from '../lib/language';
import { useTranslations } from '../lib/translations';

interface RedemptionOption {
  id: string;
  titleKey: string;
  descriptionKey: string;
  cost: number;
  icon: string;
  available: boolean;
}

interface RedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFeathers: number;
  onRedeem: (optionId: string) => void;
}

const redemptionOptions: RedemptionOption[] = [
  {
    id: 'donate_ncmh',
    titleKey: 'donateNCMH',
    descriptionKey: 'donateNCMHDesc',
    cost: 5,
    icon: '❤️',
    available: true,
  },
  {
    id: 'coffee_voucher',
    titleKey: 'coffeeVoucher',
    descriptionKey: 'coffeeVoucherDesc',
    cost: 10,
    icon: '☕',
    available: true,
  },
  {
    id: 'plant_tree',
    titleKey: 'plantTree',
    descriptionKey: 'plantTreeDesc',
    cost: 15,
    icon: '🌳',
    available: true,
  },
  {
    id: 'meditation_retreat',
    titleKey: 'meditationRetreat',
    descriptionKey: 'meditationRetreatDesc',
    cost: 25,
    icon: '🧘‍♀️',
    available: false,
  },
];

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  isOpen,
  onClose,
  totalFeathers,
  onRedeem,
}) => {
  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);
  const handleRedeem = (option: RedemptionOption) => {
    if (totalFeathers >= option.cost && option.available) {
      onRedeem(option.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t.redeemFeathers}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center">
                  <span className="text-3xl mr-2">🪶</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {totalFeathers}
                  </span>
                  <span className="text-gray-600 mr-2">{t.feathers}</span>
                </div>
              </div>

              <div className="space-y-4">
                {redemptionOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      totalFeathers >= option.cost && option.available
                        ? 'border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                    whileHover={
                      totalFeathers >= option.cost && option.available
                        ? { scale: 1.02 }
                        : {}
                    }
                    onClick={() => handleRedeem(option)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl ml-3">{option.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {t[option.titleKey as keyof typeof t]}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t[option.descriptionKey as keyof typeof t]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-yellow-600">
                            {option.cost}
                          </span>
                          <span className="text-sm text-gray-500 mr-1">🪶</span>
                        </div>
                        {!option.available && (
                          <span className="text-xs text-red-500">{t.unavailable}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  {t.experimentalNote}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
