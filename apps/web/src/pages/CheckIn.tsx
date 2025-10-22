import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, ChevronRight } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { AIProcessingIndicator, AIBadge } from '../components/AIProcessingIndicator';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setHasInput(e.target.value.trim().length > 0);
  };

  const handleContinue = async () => {
    if (hasInput) {
      setIsAnalyzing(true);
      // Simulate AI emotion analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAnalyzing(false);
      
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
            {/* Welcome Message */}
            <div className="mb-4">
              <h3 className="text-2xl font-normal text-white leading-relaxed" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                <span className="block mb-1">شاهين يرحب بك /</span>
                <span className="block italic">Shaheen</span>
                <span className="block italic">welcomes you</span>
              </h3>
            </div>
            
            {/* Shaheen Falcon Icon - Simplified */}
            <div className="relative inline-block my-6">
              <svg className="w-12 h-12 mx-auto" viewBox="0 0 60 60" fill="none">
                {/* Simple stylized falcon/leaf shape */}
                <path 
                  d="M30 10 C25 15, 20 20, 20 30 C20 35, 22 40, 30 45 C38 40, 40 35, 40 30 C40 20, 35 15, 30 10 Z" 
                  fill="#fef9f0" 
                  stroke="#ffe4c4" 
                  strokeWidth="1.5"
                />
                <path 
                  d="M30 15 C28 18, 26 22, 26 28 C26 32, 27 36, 30 39 C33 36, 34 32, 34 28 C34 22, 32 18, 30 15 Z" 
                  fill="#fff8e7" 
                />
                <circle cx="27" cy="22" r="1.5" fill="#3d5636" />
              </svg>
            </div>
            
            <h1 className="text-xl font-normal text-white leading-relaxed px-4 text-center" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
              كيف تشعر؟ / How are you feeling?
            </h1>
          </div>
          
          <div className="space-y-3 mt-8">
            <textarea
              value={textInput}
              onChange={handleTextChange}
              placeholder="اكتب هنا... / Type here..."
              className="w-full h-28 p-4 rounded-2xl border-2 border-white/30 focus:border-white focus:outline-none resize-none bg-white/95 text-gray-800 text-sm shadow-lg"
              style={{fontFamily: 'system-ui'}}
            />
            
            <button className="w-full flex items-center justify-center gap-2 p-3.5 rounded-full bg-white/90 border-2 border-white/40 hover:bg-white transition-colors shadow-md">
              <Mic className="w-5 h-5 text-[#4a6741]" />
              <span className="text-sm text-[#4a6741]">استخدم الصوت / Use Voice</span>
              <span className="text-xs text-purple-600 font-semibold">🎤 ArTST</span>
            </button>

            {hasInput && !isAnalyzing && (
              <motion.button
                onClick={handleContinue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-center p-4 rounded-full bg-amber-100 hover:bg-amber-200 text-[#3d5636] font-medium transition-colors shadow-lg"
              >
                <span className="ml-2">التالي / Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-6 rounded-2xl bg-white/95 shadow-lg"
              >
                <AIProcessingIndicator message="Analyzing emotions with AI..." />
                <div className="mt-3 flex justify-center">
                  <AIBadge text="Emotion Analysis AI" color="purple" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};