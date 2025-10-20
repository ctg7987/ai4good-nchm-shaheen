import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LanguageService } from '../lib/language';
import { PhoneFrame } from '../components/PhoneFrame';

interface Character {
  id: string;
  name: string;
  nameAr: string;
  image: string;
}

const CHARACTERS: Character[] = [
  {
    id: 'falcon',
    name: 'Falcon',
    nameAr: 'صقر',
    image: '/falcon.png'
  },
  {
    id: 'omar',
    name: 'Omar',
    nameAr: 'عمر',
    image: '/omar.png'
  },
  {
    id: 'layla',
    name: 'Layla',
    nameAr: 'ليلى',
    image: '/layla.png'
  },
  {
    id: 'fahad',
    name: 'Fahad',
    nameAr: 'فهد',
    image: '/fahad.png'
  },
  {
    id: 'noor',
    name: 'Noor',
    nameAr: 'نور',
    image: '/noor.png'
  }
];

export const Story: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storyText, setStoryText] = useState(location.state?.userInput || '');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  
  const currentLanguage = LanguageService.getCurrentLanguage();

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStoryText(e.target.value);
  };

  const handleGenerateComic = () => {
    if (selectedCharacter && hasConsent) {
      navigate('/comic', {
        state: {
          storyText,
          character: selectedCharacter
        }
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const characters = [
    { id: 'falcon', name: 'Falcon', nameAr: 'صقر', image: '/falcon.png', color: 'bg-amber-100' },
    { id: 'omar', name: 'Omar', nameAr: 'عمر', image: '/omar.png', color: 'bg-blue-100' },
    { id: 'layla', name: 'Layla', nameAr: 'ليلى', image: '/layla.png', color: 'bg-pink-100' },
    { id: 'fahad', name: 'Fahad', nameAr: 'فهد', image: '/fahad.png', color: 'bg-teal-100' },
    { id: 'noor', name: 'Noor', nameAr: 'نور', image: '/noor.png', color: 'bg-purple-100' },
  ];

  return (
    <PhoneFrame>
      <div className="min-h-full bg-amber-50 p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-green-800 hover:text-green-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                رجوع / Back
              </span>
            </button>
          </div>
          
          <h1 className="text-3xl font-light text-center text-gray-800">
            احكِ قصتك / Tell Your Story
          </h1>
          
          <div className="bg-white rounded-2xl border-2 border-gray-300 p-6">
            <textarea
              value={storyText}
              onChange={handleStoryChange}
                     placeholder="اكتب قصتك هنا... / Write your story here..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-green-800 focus:outline-none resize-none"
              rows="6"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-3">اختر شخصيتك / Choose your character:</p>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl ${char.color} border-4 transition-all overflow-hidden ${
                    selectedCharacter?.id === char.id ? 'border-green-800 scale-105' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={char.image} 
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-300">
              <input
                type="checkbox"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-green-800 rounded focus:ring-green-800"
              />
              <span className="text-sm text-gray-700">
                أوافق على مشاركة قصتي بشكل مجهول / I consent to share my story anonymously
              </span>
            </label>

            <button
              onClick={handleGenerateComic}
              disabled={!hasConsent}
              className={`w-full py-4 rounded-full text-white font-medium transition-all ${
                hasConsent 
                  ? 'bg-green-800 hover:bg-green-900' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              إنشاء القصة المصورة / Generate Comic
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};