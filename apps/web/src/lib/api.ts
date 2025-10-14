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
}

export const apiClient = new ApiClient();
