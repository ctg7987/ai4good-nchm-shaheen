import React, { useState } from 'react';
import { apiClient, OllamaRequest, OllamaResponse } from '../lib/api';
import { ArTSTVoiceInput } from './ArTSTVoiceInput';
import { LanguageService } from '../lib/language';
import { TypingIndicator, AIBadge, VoiceTranscriptionVisual } from './AIProcessingIndicator';
import { AnimatePresence } from 'framer-motion';

interface OllamaChatProps {
  className?: string;
}

export const OllamaChat: React.FC<OllamaChatProps> = ({ className = '' }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showVoiceTranscription, setShowVoiceTranscription] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const currentLanguage = LanguageService.getCurrentLanguage();
  const voiceLanguage = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const request: OllamaRequest = {
        prompt: message,
        temperature: 0.7,
        max_tokens: 500,
      };

      const result: OllamaResponse = await apiClient.chatWithOllama(request);
      setResponse(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsStreaming(true);
    setError('');
    setResponse('');

    try {
      const request: OllamaRequest = {
        prompt: message,
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      };

      const stream = await apiClient.generateOllamaStream(request);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) {
                  fullResponse += data.chunk;
                  setResponse(fullResponse);
                }
                if (data.done) break;
              } catch (e) {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(transcript);
    setVoiceTranscript(transcript);
    setShowVoiceTranscription(true);
    setIsListening(false);
    setError('');
  };

  const handleVoiceError = (error: string) => {
    setError(`Voice input error: ${error}`);
    setIsListening(false);
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Chat with Shaheen AI
        </h2>
        <div className="flex justify-center gap-2 flex-wrap">
          <AIBadge text="Powered by Ollama" icon="🤖" color="purple" />
          <AIBadge text="Arabic & English AI" icon="🌍" color="blue" />
          <AIBadge text="Real-time Generation" icon="⚡" color="green" />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Shaheen anything about emotional wellbeing..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={4}
            disabled={loading || isStreaming}
          />
        </div>
        
        {/* Voice Input - Enhanced with ArTST */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AIBadge text="AI Voice Recognition" icon="🎤" color="purple" />
          </div>
          <ArTSTVoiceInput
            onTranscript={handleVoiceTranscript}
            onError={handleVoiceError}
            language={voiceLanguage}
            disabled={loading || isStreaming}
            className="mb-2"
          />
        </div>

        {/* Voice Transcription Visualization */}
        <AnimatePresence>
          {showVoiceTranscription && (
            <VoiceTranscriptionVisual
              text={voiceTranscript}
              isListening={isListening}
              className="mb-4"
            />
          )}
        </AnimatePresence>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || isStreaming || !message.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold tracking-wide transition-colors"
          >
            {loading ? 'Generating...' : 'Send Message'}
          </button>
          
          <button
            type="button"
            onClick={handleStreamingSubmit}
            disabled={loading || isStreaming || !message.trim()}
            className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold tracking-wide transition-colors"
          >
            {isStreaming ? 'Streaming...' : 'Stream Response'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* AI Thinking Indicator */}
      <AnimatePresence>
        {(loading || isStreaming) && !response && (
          <TypingIndicator className="mb-4 mt-4" />
        )}
      </AnimatePresence>

      {response && (
        <div className="mt-6 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Shaheen's AI Response:</h3>
            <AIBadge text="AI Generated" icon="✨" color="green" />
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{response}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-semibold mb-1">How AI Works Here:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Ollama LLM</strong> generates therapeutic responses in real-time</li>
              <li>• <strong>ArTST</strong> processes Arabic speech recognition</li>
              <li>• <strong>Emotion Analysis</strong> guides compassionate AI replies</li>
              <li>• All processing happens with privacy-first design</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Non-clinical emotional learning tool • AI-powered but not medical advice</p>
      </div>
    </div>
  );
};

export default OllamaChat;
