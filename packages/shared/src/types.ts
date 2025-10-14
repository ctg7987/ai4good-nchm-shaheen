/**
 * Shared TypeScript interfaces for NCMH Wellbeing App
 */

export interface NarrativeRequest {
  text_ar: string;
  mood?: string;
  context?: string;
  user_id?: string;
}

export interface NarrativeResponse {
  metaphor: string;
  scene: string;
  questions_ar: string[];
  safety_flags: string[];
  non_clinical_disclaimer: string;
}

export interface MetricEvent {
  event_type: 'session_start' | 'session_end' | 'task_complete' | 'story_generated' | 'reflection_saved';
  timestamp: string;
  user_id?: string;
  data: Record<string, any>;
  anonymous: boolean;
}

export interface FeatherEntry {
  id: string;
  type: 'breathing' | 'journal' | 'reflection' | 'streak' | 'story';
  count: number;
  earned_at: string;
  description_ar: string;
}

export interface SessionData {
  id: string;
  timestamp: string;
  mood_selection?: {
    emotion: string;
    intensity: number;
    notes?: string;
  };
  activities: ActivityEntry[];
  feathers_earned: FeatherEntry[];
}

export interface ActivityEntry {
  id: string;
  type: 'breathing' | 'journal' | 'reflection';
  duration: number;
  content?: string;
  completed_at: string;
}

export interface UserSettings {
  data_saver: boolean;
  allow_telemetry: boolean;
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

export interface ContentSafetyCheck {
  is_safe: boolean;
  is_nonclinical: boolean;
  contains_profanity: boolean;
  contains_violence: boolean;
  recommendations: string[];
  confidence_score: number;
}

export interface ArtGenerationRequest {
  prompt: string;
  style?: 'therapeutic' | 'abstract' | 'nature';
  mood_context?: string;
}

export interface ArtGenerationResponse {
  image_url: string;
  prompt_used: string;
  style_applied: string;
  generation_time: number;
}

export interface TaskRequest {
  task_type: 'breathing' | 'journal';
  duration?: number;
  user_context?: string;
}

export interface TaskResponse {
  type: string;
  duration: number;
  instructions: string;
  instructions_ar: string;
  tips: string[];
}

export interface ReflectionRequest {
  session_id: string;
  content: string;
  mood_before?: string;
  mood_after?: string;
}

export interface ReflectionResponse {
  id: string;
  processed_at: string;
  insights?: string[];
  safety_check: ContentSafetyCheck;
}
