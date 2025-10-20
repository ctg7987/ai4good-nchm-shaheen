const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export interface NarrativeRequest {
  text_ar: string;
  mood?: string;
}

export interface NarrativeResponse {
  metaphor: string;
  scene: string;
  questions_ar: string[];
  safety_flags: string[];
  non_clinical_disclaimer: string;
}

export interface StoryResponse {
  metaphor: string;
  scene: string;
  questions: string[];
}

export interface TaskResponse {
  type: 'breathing' | 'journal';
  duration: number;
  instructions: string;
}

export interface MetricsRequest {
  name: string;
  value: any;
  event_type?: string;
}

export interface OllamaRequest {
  prompt: string;
  model?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OllamaResponse {
  response: string;
  model: string;
  temperature: number;
  max_tokens: number;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

export interface OllamaModelsResponse {
  models: OllamaModel[];
}

export interface OllamaHealthResponse {
  status: string;
  version?: string;
  base_url: string;
  default_model: string;
  error?: string;
}

export interface ArTSTTranscriptionRequest {
  language?: string;
  return_timestamps?: boolean;
}

export interface ArTSTTranscriptionResponse {
  transcription: string;
  language: string;
  confidence: number;
  duration: number;
  model: string;
  error?: string;
  timestamps?: Array<{ [key: string]: any }>;
}

export interface ArTSTHealthResponse {
  status: string;
  model: string;
  device: string;
  is_loaded: boolean;
  supported_languages: string[];
  error?: string;
}

// Arabic NLP interfaces
export interface ArabicNLPAnalysisRequest {
  text: string;
  language?: string;
}

export interface ArabicNLPAnalysisResponse {
  sentiment: string;
  sentiment_score: number;
  emotion: string;
  emotion_confidence: number;
  language: string;
  crisis_detected: boolean;
  crisis_score: number;
  crisis_keywords?: string;
  normalized_text: string;
  confidence: number;
  error?: string;
}

export interface InterventionSuggestionResponse {
  type: string;
  title: string;
  description: string;
  action: string;
  priority: string;
}

export interface ArabicNLPHealthResponse {
  status: string;
  models_loaded: boolean;
  device: string;
  supported_languages: string[];
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async postNarrative({ text_ar, mood }: NarrativeRequest): Promise<NarrativeResponse> {
    return this.request<NarrativeResponse>('/api/v1/narrative', {
      method: 'POST',
      body: JSON.stringify({ text_ar, mood }),
    });
  }

  async postMetrics({ name, value, event_type = 'user_action' }: MetricsRequest): Promise<void> {
    return this.request<void>('/api/v1/metrics', {
      method: 'POST',
      body: JSON.stringify({ 
        event_type, 
        data: { name, value },
        anonymous: true 
      }),
    });
  }

  async generateStory(mood: string, context?: string): Promise<StoryResponse> {
    return this.request<StoryResponse>('/api/story', {
      method: 'POST',
      body: JSON.stringify({ mood, context }),
    });
  }

  async getTask(type: 'breathing' | 'journal'): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/api/tasks/${type}`);
  }

  async submitReflection(sessionId: number, content: string): Promise<void> {
    return this.request<void>('/api/reflections', {
      method: 'POST',
      body: JSON.stringify({ sessionId, content }),
    });
  }

  // Ollama API methods
  async generateOllamaResponse(request: OllamaRequest): Promise<OllamaResponse> {
    return this.request<OllamaResponse>('/api/v1/ollama/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async chatWithOllama(request: OllamaRequest): Promise<OllamaResponse> {
    return this.request<OllamaResponse>('/api/v1/ollama/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getOllamaModels(): Promise<OllamaModelsResponse> {
    return this.request<OllamaModelsResponse>('/api/v1/ollama/models');
  }

  async checkOllamaHealth(): Promise<OllamaHealthResponse> {
    return this.request<OllamaHealthResponse>('/api/v1/ollama/health');
  }

  async generateOllamaStream(request: OllamaRequest): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${this.baseURL}/api/v1/ollama/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Streaming request failed: ${response.status} ${response.statusText}`);
    }

    return response.body!;
  }

  // ArTST API methods
  async transcribeAudio(file: File, request: ArTSTTranscriptionRequest = {}): Promise<ArTSTTranscriptionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', request.language || 'ar');
    formData.append('return_timestamps', String(request.return_timestamps || false));

    return this.request<ArTSTTranscriptionResponse>('/api/v1/artst/transcribe', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
    });
  }

  async transcribeAudioBytes(audioData: ArrayBuffer, _request: ArTSTTranscriptionRequest = {}): Promise<ArTSTTranscriptionResponse> {
    return this.request<ArTSTTranscriptionResponse>('/api/v1/artst/transcribe-bytes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: audioData,
    });
  }

  async checkArTSTHealth(): Promise<ArTSTHealthResponse> {
    return this.request<ArTSTHealthResponse>('/api/v1/artst/health');
  }

  async getArTSTSupportedLanguages(): Promise<{ languages: string[]; model: string; primary_language: string }> {
    return this.request<{ languages: string[]; model: string; primary_language: string }>('/api/v1/artst/languages');
  }

  async initializeArTST(): Promise<{ status: string; message: string; device: string; model: string }> {
    return this.request<{ status: string; message: string; device: string; model: string }>('/api/v1/artst/initialize', {
      method: 'POST',
    });
  }

  // Arabic NLP API methods
  async analyzeText(request: ArabicNLPAnalysisRequest): Promise<ArabicNLPAnalysisResponse> {
    return this.request<ArabicNLPAnalysisResponse>('/api/v1/arabic-nlp/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }

  async suggestIntervention(request: ArabicNLPAnalysisRequest): Promise<InterventionSuggestionResponse> {
    return this.request<InterventionSuggestionResponse>('/api/v1/arabic-nlp/suggest-intervention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }

  async checkArabicNLPHealth(): Promise<ArabicNLPHealthResponse> {
    return this.request<ArabicNLPHealthResponse>('/api/v1/arabic-nlp/health');
  }

  async getArabicNLPSupportedLanguages(): Promise<{ languages: string[]; primary_language: string; description: string }> {
    return this.request<{ languages: string[]; primary_language: string; description: string }>('/api/v1/arabic-nlp/supported-languages');
  }

  async initializeArabicNLP(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/api/v1/arabic-nlp/initialize', {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
