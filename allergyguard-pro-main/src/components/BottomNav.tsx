import { Shield, Users, Camera, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const { t } = useLanguage();

  const tabs = [
    { icon: Shield, label: t('tab.allergy'), id: 0 },
    { icon: Users, label: t('tab.community'), id: 1 },
    { icon: Camera, label: t('tab.scan'), id: 2 },
    { icon: User, label: t('tab.profile'), id: 3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <nav className="w-full max-w-[390px] bg-white border-t border-gray-200 flex items-center justify-around px-1 pt-2 pb-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 relative"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px w-6 h-0.5 rounded-full bg-gray-900" />
              )}
              <Icon
                size={22}
                className={isActive ? 'text-gray-900' : 'text-gray-400'}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
