import React from 'react';
import { motion } from 'framer-motion';

interface AIProcessingIndicatorProps {
  message?: string;
  showBrain?: boolean;
  className?: string;
}

export const AIProcessingIndicator: React.FC<AIProcessingIndicatorProps> = ({ 
  message = 'AI is processing...', 
  showBrain = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {showBrain && (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-2xl"
        >
          🧠
        </motion.div>
      )}
      
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">{message}</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-600 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 p-4 bg-gray-100 rounded-lg w-fit ${className}`}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-gray-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">AI is thinking...</span>
    </div>
  );
};

interface AIBadgeProps {
  text: string;
  icon?: string;
  color?: 'green' | 'blue' | 'purple';
  className?: string;
}

export const AIBadge: React.FC<AIBadgeProps> = ({ 
  text, 
  icon = '✨', 
  color = 'green',
  className = '' 
}) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  const hasIcon = icon ? icon.trim().length > 0 : false;
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center ${hasIcon ? 'gap-1.5' : ''} px-3 py-1 rounded-full border-2 text-xs font-semibold ${colorClasses[color]} ${className}`}
    >
      {hasIcon && <span>{icon}</span>}
      <span>{text}</span>
    </motion.div>
  );
};

interface VoiceTranscriptionVisualProps {
  text: string;
  isListening: boolean;
  className?: string;
}

export const VoiceTranscriptionVisual: React.FC<VoiceTranscriptionVisualProps> = ({ 
  text, 
  isListening,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={isListening ? {
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
          className="text-2xl"
        >
          🎤
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-purple-700">
              {isListening ? 'Listening...' : 'Transcribed'}
            </span>
            {isListening && (
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-purple-600 rounded-full"
                    animate={{
                      height: [4, 16, 4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {text || (isListening ? 'Speak now...' : 'No transcription yet')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
