import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConsentModal } from './components/ConsentModal';
import { PremiumModal } from './components/PremiumModal';
import { UsageTracker } from './lib/usageTracker';
import { CheckIn } from './pages/CheckIn';
import { Story } from './pages/Story';
import { Comic } from './pages/Comic';
import { Feed } from './pages/Feed';
import { FeathersOfHope } from './pages/FeathersOfHope';
import { Journal } from './pages/Journal';
import { Breathing } from './pages/Breathing';
import { LanguageService } from './lib/language';

// Global premium modal state
export let openPremiumModal: () => void = () => {};

function App() {
  const [showConsent, setShowConsent] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

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

    // Expose premium modal function globally
    openPremiumModal = () => setShowPremiumModal(true);
  }, []);

  const handleConsent = () => {
    setShowConsent(false);
  };

  const handleDecline = () => {
    setShowConsent(false);
    // You can redirect to a decline page or show a message
    alert('Thank you for your interest. You can visit us again anytime.');
  };

  const handlePremiumUpgrade = (plan: string) => {
    console.log(`User selected ${plan} plan`);
    // In production, this would redirect to payment gateway
    // For demo, activate a free trial
    UsageTracker.startFreeTrial();
    alert(`🎉 Welcome to Premium! Your 7-day free trial has started.`);
    setShowPremiumModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 to-stone-300">
      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsent}
        onConsent={handleConsent}
        onDecline={handleDecline}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handlePremiumUpgrade}
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
