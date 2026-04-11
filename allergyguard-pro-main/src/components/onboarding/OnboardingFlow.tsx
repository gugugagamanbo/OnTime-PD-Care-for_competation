import React, { useState, useCallback } from 'react';
import { I18nContext, translations, type Language, type TranslationKey } from '@/lib/i18n';
import { submitOnboardingProfile, type OnboardingProfile } from '@/lib/api';
import Screen0Login from './Screen0Login';
import Screen1Welcome from './Screen1Welcome';
import Screen2ProfileFor from './Screen2ProfileFor';
import Screen3RestrictionType from './Screen3RestrictionType';
import Screen4AAllergens from './Screen4AAllergens';
import Screen4BDietPrefs from './Screen4BDietPrefs';
import Screen5Severity from './Screen5Severity';
import Screen6Report from './Screen6Report';
import Screen7Rating from './Screen7Rating';
import Screen8Celebration from './Screen8Celebration';

type Screen = 'login' | 'welcome' | 'profileFor' | 'restrictionType' | 'allergens' | 'dietPrefs' | 'severity' | 'report' | 'rating' | 'celebration';

interface Props { onComplete: () => void; }

const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const [lang, setLang] = useState<Language>('zh');
  const [screen, setScreen] = useState<Screen>('login');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  // Collected data
  const [profileFor, setProfileFor] = useState('');
  const [restrictionType, setRestrictionType] = useState('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [dietPrefs, setDietPrefs] = useState<string[]>([]);
  const [severityLevels, setSeverityLevels] = useState<Record<string, 'mild' | 'moderate' | 'severe'>>({});

  const t = useCallback((key: TranslationKey) => translations[key]?.[lang] || key, [lang]);

  const navigate = (to: Screen, dir: 'forward' | 'back' = 'forward') => {
    setDirection(dir);
    setScreen(to);
  };

  const handleFinish = async () => {
    const profile: OnboardingProfile = {
      phoneNumber: '',
      countryCode: '+86',
      profileFor: profileFor as OnboardingProfile['profileFor'],
      restrictionType: restrictionType as OnboardingProfile['restrictionType'],
      allergens: selectedAllergens,
      dietPreferences: dietPrefs,
      severityLevels,
      language: lang,
    };
    await submitOnboardingProfile(profile);
    onComplete();
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <Screen0Login onContinue={() => navigate('welcome')} />;
      case 'welcome':
        return <Screen1Welcome onNext={() => navigate('profileFor')} onBack={() => navigate('login', 'back')} />;
      case 'profileFor':
        return (
          <Screen2ProfileFor
            onNext={(sel) => { setProfileFor(sel); navigate('restrictionType'); }}
            onBack={() => navigate('welcome', 'back')}
          />
        );
      case 'restrictionType':
        return (
          <Screen3RestrictionType
            onNext={(type) => {
              setRestrictionType(type);
              if (type === 'preference') navigate('dietPrefs');
              else navigate('allergens');
            }}
            onBack={() => navigate('profileFor', 'back')}
          />
        );
      case 'allergens':
        return (
          <Screen4AAllergens
            onNext={(items) => {
              setSelectedAllergens(items);
              if (items.length > 0) navigate('severity');
              else navigate('report');
            }}
            onBack={() => navigate('restrictionType', 'back')}
          />
        );
      case 'dietPrefs':
        return (
          <Screen4BDietPrefs
            onNext={(prefs) => { setDietPrefs(prefs); navigate('report'); }}
            onBack={() => navigate('restrictionType', 'back')}
          />
        );
      case 'severity':
        return (
          <Screen5Severity
            allergens={selectedAllergens}
            onNext={(sev) => { setSeverityLevels(sev); navigate('report'); }}
            onBack={() => navigate('allergens', 'back')}
          />
        );
      case 'report':
        return <Screen6Report onNext={() => navigate('rating')} onBack={() => {
          if (restrictionType === 'preference') navigate('dietPrefs', 'back');
          else if (selectedAllergens.length > 0) navigate('severity', 'back');
          else navigate('allergens', 'back');
        }} />;
      case 'rating':
        return <Screen7Rating onNext={() => navigate('celebration')} onBack={() => navigate('report', 'back')} />;
      case 'celebration':
        return <Screen8Celebration onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      <div className="relative overflow-hidden">
        {renderScreen()}
      </div>
    </I18nContext.Provider>
  );
};

export default OnboardingFlow;
