import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneFrame } from '../components/PhoneFrame';

export const Comic: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [thoughts, setThoughts] = useState('');
  
  const { storyText, character } = location.state || {};

  const handleThoughtsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setThoughts(e.target.value);
  };

  const handlePost = () => {
    // Navigate to feed with the comic data
    navigate('/feed', {
      state: {
        comic: {
          storyText,
          character,
          thoughts: thoughts.trim(),
          timestamp: new Date()
        }
      }
    });
  };

  const handleContinueWithoutPost = () => {
    navigate('/feed');
  };

  return (
    <PhoneFrame>
      <div className="min-h-full bg-amber-50 p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-light text-center text-gray-800">
            قصتك / Your Story
          </h1>

          <div className="bg-white rounded-2xl border-2 border-gray-300 p-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((panel) => (
                <div key={panel} className="aspect-square bg-amber-100 rounded-xl border-2 border-gray-400 overflow-hidden">
                  <img 
                    src={`/panel${panel}.png`} 
                    alt={`Comic Panel ${panel}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-300 p-4">
            <textarea
              value={thoughts}
              onChange={handleThoughtsChange}
              placeholder="أضف أفكارك... / Add your thoughts..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-green-800 focus:outline-none resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={handlePost}
            className="w-full py-5 rounded-full bg-green-800 hover:bg-green-900 text-white text-xl font-medium transition-colors"
          >
            نشر على شاهين / POST TO SHAHEEN
          </button>

          <button
            onClick={handleContinueWithoutPost}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
          >
            تخطي / Continue without posting
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
};