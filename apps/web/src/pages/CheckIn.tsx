import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mic } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

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
      <div className="flex flex-col items-center justify-center min-h-full bg-gradient-to-br from-[#5a7a4d] via-[#6b8d5e] to-[#4a6741] p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-6">
            {/* Shaheen Title */}
            <h1 className="text-5xl font-light text-white leading-relaxed italic mb-2" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
              Shaheen
            </h1>
            
            {/* welcomes you subtitle */}
            <h2 className="text-3xl font-light text-white leading-relaxed mb-4" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
              welcomes you
            </h2>
            
            {/* Symbol/Icon */}
            <div className="my-6">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🕊️</span>
              </div>
            </div>
            
            {/* Main Question */}
            <h3 className="text-3xl font-light text-white/95 leading-relaxed pt-4" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
              How are you feeling?
            </h3>
            
            {/* Breathing Reminder */}
            <div className="mt-8 space-y-2">
              <p className="text-sm text-white/80 leading-relaxed" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                Before you continue, pause for three breaths
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mt-8">
            <textarea
              value={textInput}
              onChange={handleTextChange}
              placeholder="Type here..."
              className="w-full h-28 p-4 rounded-2xl border-2 border-white/30 focus:border-white focus:outline-none resize-none bg-white/95 text-gray-800 text-sm shadow-lg"
              style={{fontFamily: 'system-ui'}}
              dir="auto"
            />
            
            <button
              onClick={handleVoiceInput}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/95 hover:bg-white text-[#3d5636] font-medium transition-colors shadow-lg ${
                isRecording ? 'animate-pulse bg-red-100' : ''
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? 'Listening...' : 'Use Voice'}</span>
            </button>

            {hasInput && (
              <motion.button
                onClick={handleContinue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-center p-4 rounded-full bg-amber-100 hover:bg-amber-200 text-[#3d5636] font-medium transition-colors shadow-lg"
              >
                <ChevronRight className="w-5 h-5 transform rotate-180" />
                <span className="mr-2">التالي / Next</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};