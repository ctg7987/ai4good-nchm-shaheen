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
    direction: 'rtl',
    font: 'Inter, system-ui, sans-serif'
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    direction: 'ltr',
    font: 'Noto Sans Arabic, Tajawal, system-ui, sans-serif'
  }
};

export class LanguageService {
  private static readonly STORAGE_KEY = 'ncmh-language';
  private static currentLanguage: Language = 'en';

  static getCurrentLanguage(): Language {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (stored && LANGUAGES[stored]) {
        this.currentLanguage = stored;
      }
    }
    return this.currentLanguage;
  }

  static setLanguage(language: Language): void {
    if (typeof window !== 'undefined') {
      this.currentLanguage = language;
      localStorage.setItem(this.STORAGE_KEY, language);
      
      // Update HTML attributes
      const html = document.documentElement;
      const config = LANGUAGES[language];
      
      html.setAttribute('lang', config.code);
      html.setAttribute('dir', config.direction);
      html.style.fontFamily = config.font;
      
      // Update text alignment based on direction
      if (config.direction === 'rtl') {
        html.style.textAlign = 'right';
      } else {
        html.style.textAlign = 'left';
      }
    }
  }

  static initialize(): void {
    if (typeof window !== 'undefined') {
      const language = this.getCurrentLanguage();
      this.setLanguage(language);
    }
  }
}
