import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { NonClinicalBanner } from './components/NonClinicalBanner';
import { FeatherCounter } from './components/FeatherCounter';
import { DemoMode } from './components/DemoMode';
import { LanguageToggle } from './components/LanguageToggle';
import { CheckIn } from './pages/CheckIn';
import { Story } from './pages/Story';
import { Task } from './pages/Task';
import { Impact } from './pages/Impact';
import { Privacy } from './pages/Privacy';
import { Ethics } from './pages/Ethics';
import { LanguageService } from './lib/language';
import { useTranslations } from './lib/translations';

function App() {
  useEffect(() => {
    LanguageService.initialize();
  }, []);

  const currentLanguage = LanguageService.getCurrentLanguage();
  const t = useTranslations(currentLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <NonClinicalBanner />
      <nav className="bg-white shadow-sm border-b" role="navigation" aria-label="Main Navigation">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4 space-x-reverse">
            <a 
              href="/" 
              className="text-xl font-bold text-green-900 hover:text-green-700 transition-colors"
              aria-label="Back to Home Page"
            >
              {t.appName}
            </a>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <LanguageToggle />
            <FeatherCounter />
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<CheckIn />} />
          <Route path="/story" element={<Story />} />
          <Route path="/task" element={<Task />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/ethics" element={<Ethics />} />
        </Routes>
      </main>
      
      {/* Demo Mode - Only visible in development */}
      <DemoMode isVisible={(import.meta as any).env?.DEV || false} />
    </div>
  );
}

export default App;
