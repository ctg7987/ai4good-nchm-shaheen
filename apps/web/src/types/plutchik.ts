export interface PlutchikEmotion {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  intensity: number;
  emoji: string;
}

export const PLUTCHIK_EMOTIONS: PlutchikEmotion[] = [
  {
    id: 'joy',
    name: 'Joy',
    nameAr: 'فرح',
    color: '#FFCC66',
    intensity: 1,
    emoji: '😊'
  },
  {
    id: 'trust',
    name: 'Trust',
    nameAr: 'ثقة',
    color: '#00A29D',
    intensity: 1,
    emoji: '🤝'
  },
  {
    id: 'fear',
    name: 'Fear',
    nameAr: 'خوف',
    color: '#05585F',
    intensity: 1,
    emoji: '😨'
  },
  {
    id: 'surprise',
    name: 'Surprise',
    nameAr: 'دهشة',
    color: '#FFCC66',
    intensity: 1,
    emoji: '😲'
  },
  {
    id: 'sadness',
    name: 'Sadness',
    nameAr: 'حزن',
    color: '#6B7280',
    intensity: 1,
    emoji: '😢'
  },
  {
    id: 'disgust',
    name: 'Disgust',
    nameAr: 'اشمئزاز',
    color: '#8B5CF6',
    intensity: 1,
    emoji: '🤢'
  },
  {
    id: 'anger',
    name: 'Anger',
    nameAr: 'غضب',
    color: '#EF4444',
    intensity: 1,
    emoji: '😠'
  },
  {
    id: 'anticipation',
    name: 'Anticipation',
    nameAr: 'ترقب',
    color: '#F59E0B',
    intensity: 1,
    emoji: '😌'
  }
];

export interface MoodSelection {
  emotion: PlutchikEmotion;
  intensity: number;
  notes?: string;
}