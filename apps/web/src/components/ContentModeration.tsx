import React from 'react';
import { motion } from 'framer-motion';

interface ContentModerationBadgeProps {
  isApproved: boolean;
  safetyScore?: number;
  className?: string;
}

export const ContentModerationBadge: React.FC<ContentModerationBadgeProps> = ({
  isApproved,
  safetyScore = 0,
  className = ''
}) => {
  if (!isApproved) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border-2 border-red-300 text-red-800 text-xs font-semibold ${className}`}
      >
        <span>⚠️</span>
        <span>Content Flagged</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border-2 border-green-300 text-green-800 text-xs font-semibold ${className}`}
    >
      <span>✓</span>
      <span>AI-Verified Safe</span>
      {safetyScore > 0 && <span className="text-green-600">({safetyScore}/100)</span>}
    </motion.div>
  );
};

interface SafetyIndicatorProps {
  safetyScore: number;
  className?: string;
}

export const SafetyIndicator: React.FC<SafetyIndicatorProps> = ({
  safetyScore,
  className = ''
}) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Review';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700 font-medium">AI Safety Score</span>
        <span className={`font-bold ${safetyScore >= 60 ? 'text-green-700' : 'text-red-700'}`}>
          {safetyScore}/100
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${getColor(safetyScore)}`}
          initial={{ width: 0 }}
          animate={{ width: `${safetyScore}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="text-xs text-gray-600 text-right">
        {getLabel(safetyScore)}
      </div>
    </div>
  );
};

interface ModerationAlertProps {
  flags: string[];
  recommendations: string[];
  onClose?: () => void;
}

export const ModerationAlert: React.FC<ModerationAlertProps> = ({
  flags,
  recommendations,
  onClose
}) => {
  if (flags.length === 0) return null;

  const isCritical = flags.some(flag => 
    flag.includes('self_harm') || flag.includes('crisis')
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 ${
        isCritical 
          ? 'bg-red-50 border-red-300' 
          : 'bg-yellow-50 border-yellow-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isCritical ? '🚨' : '⚠️'}</span>
          <h4 className={`font-semibold ${isCritical ? 'text-red-800' : 'text-yellow-800'}`}>
            {isCritical ? 'Critical Alert' : 'Content Moderation Notice'}
          </h4>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <p key={index} className={`text-sm ${isCritical ? 'text-red-700' : 'text-yellow-700'}`}>
            {rec}
          </p>
        ))}
      </div>

      {isCritical && (
        <div className="mt-4 p-3 bg-white rounded border border-red-200">
          <p className="text-sm font-semibold text-red-900 mb-2">
            Emergency Resources:
          </p>
          <ul className="text-xs text-red-800 space-y-1">
            <li>• National Crisis Hotline: 988</li>
            <li>• Text "HELLO" to 741741</li>
            <li>• You are not alone - help is available 24/7</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};
