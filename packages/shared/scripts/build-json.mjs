#!/usr/bin/env node

/**
 * Build script to generate JSON exports for Python API
 * Converts TypeScript data to JSON format for use in FastAPI
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the compiled JavaScript (we'll need to build first)
// For now, we'll create the JSON manually based on the TypeScript definitions

const plutchikData = {
  emotions: [
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
  ],
  combinations: [
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
  ]
};

const promptsData = {
  system_prompts: {
    non_clinical_disclaimer: 'غير سريري — أداة للتعلم العاطفي فقط',
    narrative_generation: `أنت مساعد للتعلم العاطفي باللغة العربية. مهمتك هي إنشاء قصص واستعارات تساعد الناس على فهم مشاعرهم بطريقة صحية.

القواعد الأساسية:
- لا تقدم تشخيصاً أو علاجاً طبياً
- ركز على التعلم العاطفي والوعي الذاتي
- استخدم استعارات من الطبيعة والثقافة العربية
- كن داعماً ومتفهماً
- تجنب المصطلحات الطبية السريرية

عندما يشارك شخص مشاعره، قم بإنشاء:
1. استعارة من الطبيعة أو الحياة اليومية
2. مشهد تخيلي للتفاعل مع هذه الاستعارة
3. 3 أسئلة للتفكير الذاتي

تذكر: هذا للتعلم العاطفي فقط، وليس للعلاج النفسي.`,
    breathing_instructions: `تعليمات التنفس العميق:

1. اجلس في وضع مريح
2. ضع يدك على بطنك
3. استنشق ببطء لمدة 4 ثوان
4. احبس أنفاسك لمدة 4 ثوان
5. ازفر ببطء لمدة 4 ثوان
6. كرر هذا التمرين

هذا التمرين يساعد على:
- تقليل التوتر والقلق
- تحسين التركيز
- الشعور بالهدوء والاستقرار`
  },
  journaling_prompts: [
    'اكتب عن مشاعرك اليوم. ما الذي جعلك تشعر بالفرح أو الحزن؟',
    'ما هي التحديات التي واجهتها اليوم؟ كيف تعاملت معها؟',
    'اكتب عن شيء تشعر بالامتنان له اليوم.',
    'ما هي نقاط قوتك؟ كيف يمكنك استخدامها في حياتك؟',
    'اكتب رسالة لنفسك المستقبلية. ما الذي تريد أن تتذكره؟'
  ],
  reflection_prompts: [
    'ما الذي تعلمته عن نفسك اليوم؟',
    'كيف تغيرت مشاعرك منذ بداية اليوم؟',
    'ما هي الخطوات الصغيرة التي يمكنك اتخاذها غداً؟',
    'ما الذي يجعلك تشعر بالأمل؟',
    'كيف يمكنك أن تكون أكثر لطفاً مع نفسك؟'
  ],
  arabic_affirmations: [
    'أنا أقدر مشاعري وأتعلم منها',
    'لدي القوة للتعامل مع التحديات',
    'أستحق الحب والرعاية',
    'أنا أتقدم خطوة بخطوة',
    'مشاعري مهمة ومفهومة',
    'أنا أقدر نفسي وأحترمها',
    'لدي الحق في الشعور بالطريقة التي أشعر بها',
    'أنا أتعلم وأنمو كل يوم',
    'أستحق أن أكون سعيداً',
    'أنا أقدر رحلتي الشخصية'
  ],
  emotional_validation_phrases: [
    'من الطبيعي أن تشعر بهذه الطريقة',
    'مشاعرك صحيحة ومفهومة',
    'أقدر شجاعتك في مشاركة مشاعرك',
    'كل شخص يمر بأوقات صعبة',
    'أنت لست وحدك في هذا الشعور',
    'مشاعرك مهمة وتستحق الاهتمام',
    'لديك الحق في الشعور بالطريقة التي تشعر بها',
    'أقدر صراحتك مع نفسك',
    'التعامل مع المشاعر يتطلب شجاعة',
    'أنت تتعلم وتنمو من خلال هذه التجربة'
  ]
};

// Ensure the target directory exists
const targetDir = join(__dirname, '../../apps/api/assets');
mkdirSync(targetDir, { recursive: true });

// Write the JSON files
writeFileSync(
  join(targetDir, 'plutchik.json'),
  JSON.stringify(plutchikData, null, 2),
  'utf8'
);

writeFileSync(
  join(targetDir, 'prompts.json'),
  JSON.stringify(promptsData, null, 2),
  'utf8'
);

console.log('✅ Generated JSON files for Python API:');
console.log('  - apps/api/assets/plutchik.json');
console.log('  - apps/api/assets/prompts.json');
