import { Routes, Route } from 'react-router-dom';
import { NonClinicalBanner } from './components/NonClinicalBanner';
import { FeatherCounter } from './components/FeatherCounter';
import { DemoMode } from './components/DemoMode';
import { CheckIn } from './pages/CheckIn';
import { Story } from './pages/Story';
import { Task } from './pages/Task';
import { Impact } from './pages/Impact';
import { Privacy } from './pages/Privacy';
import { Ethics } from './pages/Ethics';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <NonClinicalBanner />
      <nav className="bg-white shadow-sm border-b" role="navigation" aria-label="التنقل الرئيسي">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4 space-x-reverse">
            <a 
              href="/" 
              className="text-xl font-bold text-primary-900 hover:text-primary-700 transition-colors"
              aria-label="العودة للصفحة الرئيسية"
            >
              NCMH Wellbeing
            </a>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
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
      <DemoMode isVisible={import.meta.env.DEV} />
    </div>
  );
}

export default App;
