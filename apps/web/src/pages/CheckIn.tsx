import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, ChevronRight } from 'lucide-react';
import { ArTSTVoiceInput } from '../components/ArTSTVoiceInput';
import { LanguageService } from '../lib/language';
import { PhoneFrame } from '../components/PhoneFrame';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [hasInput, setHasInput] = useState(false);
  
  const currentLanguage = LanguageService.getCurrentLanguage();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setHasInput(e.target.value.trim().length > 0);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setTextInput(transcript);
    setHasInput(transcript.trim().length > 0);
  };

  const handleContinue = () => {
    if (hasInput) {
      navigate('/story', { 
        state: { 
          userInput: textInput.trim()
        } 
      });
    }
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col items-center justify-center min-h-full bg-amber-50 p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            {/* Welcome Message */}
            <div className="mb-6">
                     <h3 className="text-4xl font-bold text-green-800 mb-2 tracking-wide" style={{fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', letterSpacing: '0.05em'}}>
                       مرحباً بك في شاهين / Welcome to Shaheen
                     </h3>
            </div>
            
            {/* Shaheen Falcon Icon */}
            <div className="relative inline-block">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100">
                {/* Falcon head with characteristic markings */}
                <ellipse cx="50" cy="25" rx="12" ry="10" fill="#2d5016" stroke="#1a3d0f" strokeWidth="1"/>
                
                {/* Falcon eye */}
                <circle cx="47" cy="22" r="2" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5"/>
                
                {/* Falcon beak - sharp and curved */}
                <path d="M50,15 Q45,12 40,18 Q42,20 50,18" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5"/>
                
                {/* Falcon body - streamlined */}
                <ellipse cx="50" cy="45" rx="15" ry="20" fill="#2d5016" stroke="#1a3d0f" strokeWidth="1"/>
                
                {/* Left wing - spread */}
                <path d="M35,40 Q20,35 15,50 Q20,60 35,55 Q40,50 35,40" fill="#1a3d0f" stroke="#0f2a0a" strokeWidth="0.5"/>
                
                {/* Right wing - spread */}
                <path d="M65,40 Q80,35 85,50 Q80,60 65,55 Q60,50 65,40" fill="#1a3d0f" stroke="#0f2a0a" strokeWidth="0.5"/>
                
                {/* Falcon tail - fanned */}
                <path d="M50,65 Q40,80 30,85 Q35,82 50,75 Q65,82 70,85 Q60,80 50,65" fill="#1a3d0f" stroke="#0f2a0a" strokeWidth="0.5"/>
                
                {/* Falcon talons */}
                <path d="M45,75 Q42,78 40,80 Q43,79 45,77" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5"/>
                <path d="M55,75 Q58,78 60,80 Q57,79 55,77" fill="#DAA520" stroke="#B8860B" strokeWidth="0.5"/>
              </svg>
            </div>
            
                   <h1 className="text-4xl font-light text-gray-800" style={{fontFamily: 'serif'}}>
                     كيف تشعر؟ / How are you feeling?
                   </h1>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={handleTextChange}
              placeholder="اكتب هنا... / Type here..."
              className="w-full h-32 p-4 rounded-2xl border-2 border-gray-300 focus:border-green-800 focus:outline-none resize-none bg-white text-gray-800"
              style={{fontFamily: 'system-ui'}}
            />
            
            <button className="w-full flex items-center justify-center p-4 rounded-full bg-white border-2 border-green-800 hover:bg-green-50 transition-colors">
              <Mic className="w-6 h-6 text-green-800" />
              <span className="mr-3 text-green-800">استخدم الصوت / Use Voice</span>
            </button>

            {hasInput && (
              <motion.button
                onClick={handleContinue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-center p-4 rounded-full bg-green-800 hover:bg-green-900 text-white transition-colors"
              >
                <span className="ml-2">التالي / Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};