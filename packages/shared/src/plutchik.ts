/**
 * Arabic Plutchik Emotion Wheel Mapping
 * Based on Robert Plutchik's theory of emotions with Arabic translations
 */

export interface PlutchikEmotion {
  id: string;
  name_en: string;
  name_ar: string;
  color: string;
  intensity_levels: IntensityLevel[];
  synonyms_ar: string[];
  opposites: string[];
}

export interface IntensityLevel {
  level: number; // 1-3 (low, medium, high)
  name_ar: string;
  description_ar: string;
}

export const PLUTCHIK_EMOTIONS: PlutchikEmotion[] = [
  {
    id: 'joy',
    name_en: 'Joy',
    name_ar: 'فرح',
    color: '#FFCC66',
    intensity_levels: [
      { level: 1, name_ar: 'رضا', description_ar: 'شعور بالرضا والطمأنينة' },
      { level: 2, name_ar: 'فرح', description_ar: 'شعور بالبهجة والسعادة' },
      { level: 3, name_ar: 'ابتهاج', description_ar: 'شعور بالابتهاج الشديد' }
    ],
    synonyms_ar: ['سعادة', 'بهجة', 'سرور', 'انبساط', 'طمأنينة'],
    opposites: ['sadness']
  },
  {
    id: 'trust',
    name_en: 'Trust',
    name_ar: 'ثقة',
    color: '#00A29D',
    intensity_levels: [
      { level: 1, name_ar: 'اطمئنان', description_ar: 'شعور بالاطمئنان والهدوء' },
      { level: 2, name_ar: 'ثقة', description_ar: 'شعور بالثقة والأمان' },
      { level: 3, name_ar: 'يقين', description_ar: 'شعور باليقين التام' }
    ],
    synonyms_ar: ['أمان', 'اطمئنان', 'يقين', 'طمأنينة', 'استقرار'],
    opposites: ['disgust']
  },
  {
    id: 'fear',
    name_en: 'Fear',
    name_ar: 'خوف',
    color: '#05585F',
    intensity_levels: [
      { level: 1, name_ar: 'قلق', description_ar: 'شعور بالقلق والتردد' },
      { level: 2, name_ar: 'خوف', description_ar: 'شعور بالخوف والرهبة' },
      { level: 3, name_ar: 'رعب', description_ar: 'شعور بالرعب الشديد' }
    ],
    synonyms_ar: ['قلق', 'رهبة', 'فزع', 'رعب', 'اضطراب'],
    opposites: ['anger']
  },
  {
    id: 'surprise',
    name_en: 'Surprise',
    name_ar: 'دهشة',
    color: '#FFCC66',
    intensity_levels: [
      { level: 1, name_ar: 'انتباه', description_ar: 'شعور بالانتباه واليقظة' },
      { level: 2, name_ar: 'دهشة', description_ar: 'شعور بالدهشة والاستغراب' },
      { level: 3, name_ar: 'ذهول', description_ar: 'شعور بالذهول الشديد' }
    ],
    synonyms_ar: ['استغراب', 'ذهول', 'انتباه', 'يقظة', 'تأثر'],
    opposites: ['anticipation']
  },
  {
    id: 'sadness',
    name_en: 'Sadness',
    name_ar: 'حزن',
    color: '#6B7280',
    intensity_levels: [
      { level: 1, name_ar: 'أسى', description_ar: 'شعور بالأسى والحزن الخفيف' },
      { level: 2, name_ar: 'حزن', description_ar: 'شعور بالحزن والأسى' },
      { level: 3, name_ar: 'كآبة', description_ar: 'شعور بالكآبة الشديدة' }
    ],
    synonyms_ar: ['أسى', 'كآبة', 'حزن', 'غم', 'ألم'],
    opposites: ['joy']
  },
  {
    id: 'disgust',
    name_en: 'Disgust',
    name_ar: 'اشمئزاز',
    color: '#8B5CF6',
    intensity_levels: [
      { level: 1, name_ar: 'نفور', description_ar: 'شعور بالنفور والابتعاد' },
      { level: 2, name_ar: 'اشمئزاز', description_ar: 'شعور بالاشمئزاز والرفض' },
      { level: 3, name_ar: 'تقزز', description_ar: 'شعور بالتقزز الشديد' }
    ],
    synonyms_ar: ['نفور', 'تقزز', 'اشمئزاز', 'رفض', 'كراهية'],
    opposites: ['trust']
  },
  {
    id: 'anger',
    name_en: 'Anger',
    name_ar: 'غضب',
    color: '#EF4444',
    intensity_levels: [
      { level: 1, name_ar: 'إزعاج', description_ar: 'شعور بالإزعاج والضيق' },
      { level: 2, name_ar: 'غضب', description_ar: 'شعور بالغضب والانفعال' },
      { level: 3, name_ar: 'غضب شديد', description_ar: 'شعور بالغضب الشديد' }
    ],
    synonyms_ar: ['غضب', 'إزعاج', 'انفعال', 'سخط', 'غيظ'],
    opposites: ['fear']
  },
  {
    id: 'anticipation',
    name_en: 'Anticipation',
    name_ar: 'ترقب',
    color: '#F59E0B',
    intensity_levels: [
      { level: 1, name_ar: 'انتظار', description_ar: 'شعور بالانتظار والصبر' },
      { level: 2, name_ar: 'ترقب', description_ar: 'شعور بالترقب والانتظار' },
      { level: 3, name_ar: 'شوق', description_ar: 'شعور بالشوق الشديد' }
    ],
    synonyms_ar: ['ترقب', 'انتظار', 'شوق', 'تطلع', 'أمل'],
    opposites: ['surprise']
  }
];

export interface EmotionCombination {
  primary: string;
  secondary: string;
  result_ar: string;
  description_ar: string;
}

export const EMOTION_COMBINATIONS: EmotionCombination[] = [
  {
    primary: 'joy',
    secondary: 'trust',
    result_ar: 'حب',
    description_ar: 'مزيج من الفرح والثقة يخلق شعوراً بالحب'
  },
  {
    primary: 'joy',
    secondary: 'anticipation',
    result_ar: 'تفاؤل',
    description_ar: 'مزيج من الفرح والترقب يخلق شعوراً بالتفاؤل'
  },
  {
    primary: 'trust',
    secondary: 'fear',
    result_ar: 'خضوع',
    description_ar: 'مزيج من الثقة والخوف يخلق شعوراً بالخضوع'
  },
  {
    primary: 'fear',
    secondary: 'surprise',
    result_ar: 'رعب',
    description_ar: 'مزيج من الخوف والدهشة يخلق شعوراً بالرعب'
  },
  {
    primary: 'surprise',
    secondary: 'sadness',
    result_ar: 'خيبة أمل',
    description_ar: 'مزيج من الدهشة والحزن يخلق شعوراً بخيبة الأمل'
  },
  {
    primary: 'sadness',
    secondary: 'disgust',
    result_ar: 'ندم',
    description_ar: 'مزيج من الحزن والاشمئزاز يخلق شعوراً بالندم'
  },
  {
    primary: 'disgust',
    secondary: 'anger',
    result_ar: 'ازدراء',
    description_ar: 'مزيج من الاشمئزاز والغضب يخلق شعوراً بالازدراء'
  },
  {
    primary: 'anger',
    secondary: 'anticipation',
    result_ar: 'عدوانية',
    description_ar: 'مزيج من الغضب والترقب يخلق شعوراً بالعدوانية'
  }
];

export function getEmotionById(id: string): PlutchikEmotion | undefined {
  return PLUTCHIK_EMOTIONS.find(emotion => emotion.id === id);
}

export function getEmotionByArabicName(name_ar: string): PlutchikEmotion | undefined {
  return PLUTCHIK_EMOTIONS.find(emotion => 
    emotion.name_ar === name_ar || 
    emotion.synonyms_ar.includes(name_ar)
  );
}

export function getIntensityLevel(emotionId: string, level: number): IntensityLevel | undefined {
  const emotion = getEmotionById(emotionId);
  return emotion?.intensity_levels.find(intensity => intensity.level === level);
}
