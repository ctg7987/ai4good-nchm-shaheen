import { Language } from './language';

export interface Translations {
  // Navigation
  appName: string;
  redeem: string;
  
  // Check-in page
  howAreYouFeeling: string;
  takeAMoment: string;
  chooseYourFeelings: string;
  clickEmotions: string;
  shareYourThoughts: string;
  writeAdditionalThoughts: string;
  startYourJourney: string;
  processing: string;
  
  // Story page
  yourStoryToday: string;
  exploreInteractiveStory: string;
  metaphor: string;
  theScene: string;
  questionsToThinkAbout: string;
  continueToTasks: string;
  viewProgress: string;
  
  // Task page
  completeATask: string;
  engageInActivity: string;
  chooseYourTask: string;
  breathingExercise: string;
  journaling: string;
  focusOnBreath: string;
  writeDownThoughts: string;
  completeEarly: string;
  taskCompleted: string;
  completeJournal: string;
  
  // Impact page
  yourProgress: string;
  trackYourJourney: string;
  totalFeathers: string;
  tasksCompleted: string;
  daysActive: string;
  
  // Privacy page
  privacyPolicy: string;
  dataProtection: string;
  
  // Ethics page
  ethicsAndTransparency: string;
  howResponsesGenerated: string;
  
  // Non-clinical banner
  nonClinicalBanner: string;
  
  // Emotions
  joy: string;
  trust: string;
  fear: string;
  surprise: string;
  sadness: string;
  disgust: string;
  anger: string;
  anticipation: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    appName: 'NCMH Wellbeing - Welcome to Shaheen',
    redeem: 'Redeem',
    
    // Check-in page
    howAreYouFeeling: 'How are you feeling today?',
    takeAMoment: 'Take a moment to reflect on your feelings. This is a safe place to explore what\'s inside you',
    chooseYourFeelings: 'Choose your feelings',
    clickEmotions: 'Click on the emotions that reflect your current state',
    shareYourThoughts: 'Share your thoughts',
    writeAdditionalThoughts: 'Write any additional thoughts or feelings you\'d like to share',
    startYourJourney: 'Start Your Journey',
    processing: 'Processing...',
    
    // Story page
    yourStoryToday: 'Your Story Today',
    exploreInteractiveStory: 'Explore this interactive story designed just for you',
    metaphor: 'Metaphor',
    theScene: 'The Scene',
    questionsToThinkAbout: 'Questions to Think About',
    continueToTasks: 'Continue to Tasks',
    viewProgress: 'View Progress',
    
    // Task page
    completeATask: 'Complete a Task',
    engageInActivity: 'Engage in an activity to reflect and earn feathers',
    chooseYourTask: 'Choose Your Task',
    breathingExercise: 'Breathing Exercise',
    journaling: 'Journaling',
    focusOnBreath: 'Focus on your breath. Inhale deeply, hold, and exhale slowly.',
    writeDownThoughts: 'Write down your thoughts and feelings. There\'s no right or wrong.',
    completeEarly: 'Complete Early',
    taskCompleted: 'Task Completed!',
    completeJournal: 'Complete Journal',
    
    // Impact page
    yourProgress: 'Your Progress',
    trackYourJourney: 'Track your journey and see how you\'ve grown',
    totalFeathers: 'Total Feathers',
    tasksCompleted: 'Tasks Completed',
    daysActive: 'Days Active',
    
    // Privacy page
    privacyPolicy: 'Privacy Policy',
    dataProtection: 'Your data is protected and stored locally',
    
    // Ethics page
    ethicsAndTransparency: 'Ethics & Transparency',
    howResponsesGenerated: 'How responses are generated',
    
    // Non-clinical banner
    nonClinicalBanner: 'Non-clinical — Emotional learning tool only',
    
    // Emotions
    joy: 'Joy',
    trust: 'Trust',
    fear: 'Fear',
    surprise: 'Surprise',
    sadness: 'Sadness',
    disgust: 'Disgust',
    anger: 'Anger',
    anticipation: 'Anticipation',
  },
  
  ar: {
    // Navigation
    appName: 'رفاهية NCMH - مرحباً بك في شاهين',
    redeem: 'استبدال',
    
    // Check-in page
    howAreYouFeeling: 'كيف تشعر اليوم؟',
    takeAMoment: 'خذ لحظة للتفكير في مشاعرك. هذا مكان آمن لاستكشاف ما بداخلك',
    chooseYourFeelings: 'اختر مشاعرك',
    clickEmotions: 'انقر على المشاعر التي تعكس حالتك الحالية',
    shareYourThoughts: 'شارك أفكارك',
    writeAdditionalThoughts: 'اكتب أي أفكار أو مشاعر إضافية تريد مشاركتها',
    startYourJourney: 'ابدأ رحلتك',
    processing: 'جاري المعالجة...',
    
    // Story page
    yourStoryToday: 'قصتك اليوم',
    exploreInteractiveStory: 'استكشف هذه القصة التفاعلية المصممة خصيصاً لك',
    metaphor: 'الاستعارة',
    theScene: 'المشهد',
    questionsToThinkAbout: 'أسئلة للتفكير',
    continueToTasks: 'المتابعة للمهام',
    viewProgress: 'عرض التقدم',
    
    // Task page
    completeATask: 'أكمل مهمة',
    engageInActivity: 'شارك في نشاط للتفكير وكسب الريش',
    chooseYourTask: 'اختر مهمتك',
    breathingExercise: 'تمرين التنفس',
    journaling: 'كتابة اليوميات',
    focusOnBreath: 'ركز على تنفسك. استنشق بعمق، احبس، وازفر ببطء.',
    writeDownThoughts: 'اكتب أفكارك ومشاعرك. لا يوجد صحيح أو خطأ.',
    completeEarly: 'أكمل مبكراً',
    taskCompleted: 'تمت المهمة!',
    completeJournal: 'أكمل اليوميات',
    
    // Impact page
    yourProgress: 'تقدمك',
    trackYourJourney: 'تتبع رحلتك وانظر كيف تطورت',
    totalFeathers: 'إجمالي الريش',
    tasksCompleted: 'المهام المكتملة',
    daysActive: 'الأيام النشطة',
    
    // Privacy page
    privacyPolicy: 'سياسة الخصوصية',
    dataProtection: 'بياناتك محمية ومخزنة محلياً',
    
    // Ethics page
    ethicsAndTransparency: 'الأخلاقيات والشفافية',
    howResponsesGenerated: 'كيف يتم توليد الردود',
    
    // Non-clinical banner
    nonClinicalBanner: 'غير سريري — أداة للتعلم العاطفي فقط',
    
    // Emotions
    joy: 'فرح',
    trust: 'ثقة',
    fear: 'خوف',
    surprise: 'دهشة',
    sadness: 'حزن',
    disgust: 'اشمئزاز',
    anger: 'غضب',
    anticipation: 'ترقب',
  }
};

export const useTranslations = (language: Language) => {
  return translations[language];
};
