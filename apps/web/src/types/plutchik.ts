export interface PlutchikEmotion {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  intensity: number;
}

export const PLUTCHIK_EMOTIONS: PlutchikEmotion[] = [
  {
    id: 'joy',
    name: 'Joy',
    nameAr: 'فرح',
    color: '#FFCC66',
    intensity: 1
  },
  {
    id: 'trust',
    name: 'Trust',
    nameAr: 'ثقة',
    color: '#00A29D',
    intensity: 1
  },
  {
    id: 'fear',
    name: 'Fear',
    nameAr: 'خوف',
    color: '#05585F',
    intensity: 1
  },
  {
    id: 'surprise',
    name: 'Surprise',
    nameAr: 'دهشة',
    color: '#FFCC66',
    intensity: 1
  },
  {
    id: 'sadness',
    name: 'Sadness',
    nameAr: 'حزن',
    color: '#6B7280',
    intensity: 1
  },
  {
    id: 'disgust',
    name: 'Disgust',
    nameAr: 'اشمئزاز',
    color: '#8B5CF6',
    intensity: 1
  },
  {
    id: 'anger',
    name: 'Anger',
    nameAr: 'غضب',
    color: '#EF4444',
    intensity: 1
  },
  {
    id: 'anticipation',
    name: 'Anticipation',
    nameAr: 'ترقب',
    color: '#F59E0B',
    intensity: 1
  }
];

export interface MoodSelection {
  emotion: PlutchikEmotion;
  intensity: number;
  notes?: string;
}
