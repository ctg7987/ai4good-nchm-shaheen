import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConsentModal } from './components/ConsentModal';
import { CheckIn } from './pages/CheckIn';
import { Story } from './pages/Story';
import { Comic } from './pages/Comic';
import { Feed } from './pages/Feed';
import { FeathersOfHope } from './pages/FeathersOfHope';
import { Journal } from './pages/Journal';
import { Breathing } from './pages/Breathing';
import { LanguageService } from './lib/language';

function App() {
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    // Force Arabic as default language on first load
    const storedLanguage = localStorage.getItem('ncmh-language');
    const storedConsent = localStorage.getItem('ncmh-consent');
    
    // Reset language to Arabic if it's currently English and no consent given
    if (storedLanguage === 'en' && !storedConsent) {
      LanguageService.resetToDefault();
    } else {
      LanguageService.initialize();
    }
    
    // Check if user has already consented
    if (storedConsent === 'true') {
      setShowConsent(false);
    } else {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = () => {
    setShowConsent(false);
  };

  const handleDecline = () => {
    setShowConsent(false);
    // You can redirect to a decline page or show a message
    alert('Thank you for your interest. You can visit us again anytime.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 to-stone-300">
      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsent}
        onConsent={handleConsent}
        onDecline={handleDecline}
      />

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<CheckIn />} />
        <Route path="/story" element={<Story />} />
        <Route path="/comic" element={<Comic />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feathers" element={<FeathersOfHope />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/breathing" element={<Breathing />} />
      </Routes>
    </div>
  );
}

export default App;
