// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, ArTSTTranscriptionResponse } from '../lib/api';
import { LanguageService } from '../lib/language';

interface ArTSTVoiceInputProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  className?: string;
  disabled?: boolean;
}

export const ArTSTVoiceInput: React.FC<ArTSTVoiceInputProps> = ({
  onTranscript,
  onError,
  language = 'ar',
  className = '',
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [artstAvailable, setArtstAvailable] = useState(false);
  
  const currentLanguage = LanguageService.getCurrentLanguage();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if ArTST is available
    checkArTSTAvailability();
    
    // Check if MediaRecorder is supported
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Voice recording not supported in this browser');
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkArTSTAvailability = async () => {
    try {
      const health = await apiClient.checkArTSTHealth();
      setArtstAvailable(health.status === 'healthy' && health.is_loaded);
    } catch (err) {
      console.warn('ArTST not available, falling back to browser speech recognition');
      setArtstAvailable(false);
    }
  };

  const startRecording = async () => {
    if (!isSupported || disabled) return;
    
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      streamRef.current = stream;
      setAudioChunks([]);
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        processRecording();
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const processRecording = async () => {
    if (audioChunks.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      // Use ArTST if available, otherwise fall back to browser speech recognition
      if (artstAvailable) {
        const result: ArTSTTranscriptionResponse = await apiClient.transcribeAudio(audioFile, {
          language: language,
          return_timestamps: false
        });
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        onTranscript(result.transcription);
      } else {
        // Fallback to browser Speech Recognition API
        await processWithBrowserSpeechRecognition(audioBlob);
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Transcription failed';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsProcessing(false);
      setAudioChunks([]);
    }
  };

  const processWithBrowserSpeechRecognition = async (audioBlob: Blob) => {
    // Fallback implementation using browser's Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported');
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    
    return new Promise<void>((resolve, reject) => {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        resolve();
      };
      
      recognition.onerror = (event) => {
        reject(new Error(event.error));
      };
      
      recognition.start();
    });
  };

  const getButtonText = () => {
    if (!isSupported) return 'غير متوفر';
    if (isProcessing) return 'جاري المعالجة...';
    if (isRecording) return 'جاري التسجيل...';
    return artstAvailable ? 'اضغط للتحدث (ArTST)' : 'اضغط للتحدث';
  };

  const getButtonTextEn = () => {
    if (!isSupported) return 'Not Available';
    if (isProcessing) return 'Processing...';
    if (isRecording) return 'Recording...';
    return artstAvailable ? 'Click to Speak (ArTST)' : 'Click to Speak';
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
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || !isSupported || isProcessing}
        className={`
          w-full p-4 rounded-lg font-medium transition-all duration-200
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-green-600 hover:bg-green-700 text-white'
          }
          ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!isSupported ? 'bg-gray-400 hover:bg-gray-400' : ''}
        `}
      >
        <div className="flex items-center justify-center">
          <span className="font-semibold tracking-wide text-base">
            {currentLanguage === 'ar' ? getButtonText() : getButtonTextEn()}
          </span>
        </div>
      </motion.button>

      {/* ArTST Status */}
      {artstAvailable && (
        <div className="text-center text-xs text-green-600 bg-green-50 p-2 rounded">
          {currentLanguage === 'ar' 
            ? 'محسن بـ ArTST للعربية' 
            : 'Enhanced with ArTST for Arabic'
          }
        </div>
      )}

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

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 space-x-reverse text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {currentLanguage === 'ar' 
                ? 'تحدث الآن...' 
                : 'Speak now...'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 space-x-reverse text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {currentLanguage === 'ar' 
                ? 'جاري تحويل الصوت إلى نص...' 
                : 'Converting speech to text...'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!isRecording && !isProcessing && !error && (
        <div className="text-center text-sm text-gray-500">
          <p>
            {currentLanguage === 'ar' 
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

export default ArTSTVoiceInput;
