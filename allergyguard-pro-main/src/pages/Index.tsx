import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import AllergyTab from '@/components/tabs/AllergyTab';
import CommunityTab from '@/components/tabs/CommunityTab';
import ScanTab from '@/components/tabs/ScanTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const tabs = [AllergyTab, CommunityTab, ScanTab, ProfileTab];

const AppShell = () => {
  const [activeTab, setActiveTab] = useState(2);
  const ActiveComponent = tabs[activeTab];

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[390px] relative">
        <div className="transition-opacity duration-200">
          <ActiveComponent />
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

const Index = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);

  if (!onboardingDone) {
    return <OnboardingFlow onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
};

export default Index;
