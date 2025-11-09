import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mic } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { LanguageService, Language } from '../lib/language';
import { useTranslations } from '../lib/translations';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LanguageService.getCurrentLanguage());

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent) => {
      setCurrentLanguage(e.detail.language);
    };
    
    window.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languagechange', handleLanguageChange as EventListener);
  }, []);

  const t = useTranslations(currentLanguage);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setHasInput(e.target.value.trim().length > 0);
  };

  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Try Arabic first, then English
    recognition.lang = 'ar-SA'; // Arabic (Saudi Arabia)
    
    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTextInput(transcript);
      setHasInput(transcript.trim().length > 0);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // If Arabic fails, try English
      if (event.error === 'no-speech' || event.error === 'language-not-supported') {
        const englishRecognition = new SpeechRecognition();
        englishRecognition.continuous = false;
        englishRecognition.interimResults = false;
        englishRecognition.lang = 'en-US';
        
        englishRecognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTextInput(transcript);
          setHasInput(transcript.trim().length > 0);
          setIsRecording(false);
        };
        
        englishRecognition.onerror = () => {
          setIsRecording(false);
          alert('Could not recognize speech. Please try typing instead.');
        };
        
        englishRecognition.onend = () => {
          setIsRecording(false);
        };
        
        englishRecognition.start();
      } else {
        setIsRecording(false);
        alert('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleContinue = () => {
    if (hasInput) {
      // Navigate directly to story page (emotion analysis happens there)
      navigate('/story', { 
        state: { 
          userInput: textInput.trim()
        } 
      });
    }
  };

  return (
    <PhoneFrame>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-full bg-gradient-radial from-[#0E4A3B] via-[#1B5E4A] to-[#0E4A3B] p-6"
        style={{
          background: 'radial-gradient(circle at center, #1B5E4A 0%, #0E4A3B 100%)'
        }}
      >
        <div className="w-full max-w-md space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center space-y-6"
          >
            {/* Heading: two-line with 'welcomes you' kept on one line */}
            <div className="space-y-2" translate="no">
              {/* Line 1: Shaheen */}
              <h1 translate="no"
                className="text-5xl md:text-6xl text-white leading-tight"
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 600,
                  letterSpacing: '0.01em'
                }}
              >
                {currentLanguage === 'ar' ? 'شاهين' : 'Shaheen'}
              </h1>
              {/* Line 2: welcomes you (nowrap) */}
              <div translate="no"
                className="text-3xl md:text-4xl text-white leading-tight"
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 400,
                  letterSpacing: '0.01em'
                }}
              >
                {currentLanguage === 'ar' ? (
                  <span className="whitespace-nowrap">يرحب بك</span>
                ) : (
                  <span className="whitespace-nowrap">welcomes you</span>
                )}
              </div>
            </div>
            
            {/* Symbol/Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
              className="my-8"
            >
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-5xl">🕊️</span>
              </div>
            </motion.div>
            
            {/* Breathing Reminder */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-2"
            >
              <p 
                className="text-base md:text-lg text-white/80 leading-relaxed px-4" 
                style={{fontFamily: 'Georgia, "Times New Roman", serif'}}
              >
                {t.beforeYouContinue}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-4 mt-12"
          >
            <textarea
              value={textInput}
              onChange={handleTextChange}
              placeholder={t.typeHere}
              className="w-full h-32 p-4 rounded-2xl border-2 border-white/30 focus:border-white focus:outline-none resize-none bg-white/95 text-gray-800 placeholder-gray-400 text-base shadow-xl transition-all"
              style={{fontFamily: 'system-ui'}}
              dir="auto"
            />
            
            <button
              onClick={handleVoiceInput}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/95 hover:bg-white text-[#0E4A3B] font-medium transition-all shadow-xl ${
                isRecording ? 'animate-pulse bg-red-100' : ''
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? t.listening : t.useVoice}</span>
            </button>

            {hasInput && (
              <motion.button
                onClick={handleContinue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-full bg-[#FDE68A] hover:bg-[#FCD34D] text-[#0E4A3B] font-semibold transition-all shadow-xl"
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              >
                {currentLanguage === 'ar' ? (
                  <>
                    <span>{t.next}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>{t.next}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </PhoneFrame>
  );
};