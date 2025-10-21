import React from 'react';
import { OllamaChat } from '../components/OllamaChat';

export const OllamaChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <OllamaChat />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors"
          >
            Back to Home / العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default OllamaChatPage;

