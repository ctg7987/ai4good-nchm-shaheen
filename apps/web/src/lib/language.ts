export type Language = 'en' | 'ar';

export interface LanguageConfig {
  code: Language;
  name: string;
  direction: 'ltr' | 'rtl';
  font: string;
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    direction: 'ltr',
    font: 'Inter, system-ui, sans-serif'
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    direction: 'rtl',
    font: 'Noto Sans Arabic, Tajawal, system-ui, sans-serif'
  }
};

export class LanguageService {
  private static readonly STORAGE_KEY = 'ncmh-language';
  // Default to English instead of Arabic unless stored preference exists
  private static currentLanguage: Language = 'en';

  static getCurrentLanguage(): Language {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (stored && LANGUAGES[stored]) {
        this.currentLanguage = stored;
      } else {
        // If no stored language, use English as default and store it
        this.currentLanguage = 'en';
        localStorage.setItem(this.STORAGE_KEY, 'en');
      }
    }
    return this.currentLanguage;
  }

  static setLanguage(language: Language, reload: boolean = false): void {
    if (typeof window !== 'undefined') {
      this.currentLanguage = language;
      localStorage.setItem(this.STORAGE_KEY, language);
      
      // Update HTML attributes
      const html = document.documentElement;
      const config = LANGUAGES[language];
      
      html.setAttribute('lang', config.code);
      html.setAttribute('dir', config.direction);
      html.style.fontFamily = config.font;
      
      // Update body direction as well
      document.body.setAttribute('dir', config.direction);
      
      // Update text alignment based on direction
      if (config.direction === 'rtl') {
        html.style.textAlign = 'right';
      } else {
        html.style.textAlign = 'left';
      }
      
      // Trigger custom event for components to listen to
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
      
      // Optional reload for full effect
      if (reload) {
        window.location.reload();
      }
    }
  }

  static initialize(): void {
    if (typeof window !== 'undefined') {
      const language = this.getCurrentLanguage();
      this.setLanguage(language);
    }
  }

  static resetToDefault(): void {
    if (typeof window !== 'undefined') {
      this.currentLanguage = 'ar';
      localStorage.setItem(this.STORAGE_KEY, 'ar');
      this.setLanguage('ar');
    }
  }
}
