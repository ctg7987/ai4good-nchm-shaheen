import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../lib/api';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  className?: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onError,
  language = 'ar-SA', // Default to Arabic
  className = '',
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artstAvailable, setArtstAvailable] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check ArTST availability
    checkArTSTAvailability();
    
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        stopListening();
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
        if (onError) {
          onError(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, onTranscript, onError]);

  const checkArTSTAvailability = async () => {
    try {
      const health = await apiClient.checkArTSTHealth();
      setArtstAvailable(health.status === 'healthy' && health.is_loaded);
    } catch (err) {
      console.warn('ArTST not available, using browser speech recognition');
      setArtstAvailable(false);
    }
  };

  const startListening = () => {
    if (!isSupported || disabled) return;
    
    try {
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (err) {
      setError('Failed to start voice recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const getButtonText = () => {
    if (!isSupported) return '🎤 غير متوفر';
    if (isListening) return '🎤 جاري الاستماع...';
    return artstAvailable ? '🎤 اضغط للتحدث (ArTST)' : '🎤 اضغط للتحدث';
  };

  const getButtonTextEn = () => {
    if (!isSupported) return '🎤 Not Available';
    if (isListening) return '🎤 Listening...';
    return artstAvailable ? '🎤 Click to Speak (ArTST)' : '🎤 Click to Speak';
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500 text-sm">
          Voice input is not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Voice Input Button */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || !isSupported}
        className={`
          w-full p-4 rounded-lg font-medium transition-all duration-200
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!isSupported ? 'bg-gray-400 hover:bg-gray-400' : ''}
        `}
      >
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          <span className="text-lg">
            {isListening ? '🔴' : '🎤'}
          </span>
          <span>
            {language.startsWith('ar') ? getButtonText() : getButtonTextEn()}
          </span>
        </div>
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 space-x-reverse text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {language.startsWith('ar') 
                ? 'تحدث الآن...' 
                : 'Speak now...'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ArTST Status */}
      {artstAvailable && (
        <div className="text-center text-xs text-green-600 bg-green-50 p-2 rounded">
          {language.startsWith('ar') 
            ? 'محسن بـ ArTST للعربية' 
            : 'Enhanced with ArTST for Arabic'
          }
        </div>
      )}

      {/* Instructions */}
      {!isListening && !error && (
        <div className="text-center text-sm text-gray-500">
          <p>
            {language.startsWith('ar') 
              ? 'اضغط على الزر وابدأ بالحديث بوضوح' + (artstAvailable ? ' (محسن للعربية)' : '')
              : 'Click the button and start speaking clearly' + (artstAvailable ? ' (Enhanced for Arabic)' : '')
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default VoiceInput;
