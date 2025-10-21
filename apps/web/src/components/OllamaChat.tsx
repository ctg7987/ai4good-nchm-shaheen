import React, { useState } from 'react';
import { apiClient, OllamaRequest, OllamaResponse } from '../lib/api';
import { ArTSTVoiceInput } from './ArTSTVoiceInput';
import { LanguageService } from '../lib/language';

interface OllamaChatProps {
  className?: string;
}

export const OllamaChat: React.FC<OllamaChatProps> = ({ className = '' }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
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
    setError('');
  };

  const handleVoiceError = (error: string) => {
    setError(`Voice input error: ${error}`);
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Chat with Shaheen
      </h2>
      
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
        <ArTSTVoiceInput
          onTranscript={handleVoiceTranscript}
          onError={handleVoiceError}
          language={voiceLanguage}
          disabled={loading || isStreaming}
          className="mb-4"
        />

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
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Shaheen's Response:</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Powered by Ollama • Non-clinical emotional learning tool</p>
      </div>
    </div>
  );
};

export default OllamaChat;
