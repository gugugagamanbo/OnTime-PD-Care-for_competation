import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import MedicationTab from '@/components/tabs/MedicationTab';
import CareCircleTab from '@/components/tabs/CareCircleTab';
import ScanTab from '@/components/tabs/ScanTab';
import ProfileTab from '@/components/tabs/ProfileTab';

const tabs = [MedicationTab, CareCircleTab, ScanTab, ProfileTab];

const AppShell = () => {
  const [activeTab, setActiveTab] = useState(0);
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
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
};

export default Index;
