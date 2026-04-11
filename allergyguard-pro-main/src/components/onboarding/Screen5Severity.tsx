import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

const allergenMap: Record<string, { emoji: string; zh: string; en: string }> = {
  peanut: { emoji: '🥜', zh: '花生', en: 'Peanut' },
  treenut: { emoji: '🌰', zh: '坚果', en: 'Tree Nut' },
  milk: { emoji: '🥛', zh: '牛奶', en: 'Milk' },
  egg: { emoji: '🥚', zh: '鸡蛋', en: 'Egg' },
  gluten: { emoji: '🌾', zh: '麸质', en: 'Gluten' },
  soy: { emoji: '🫘', zh: '大豆', en: 'Soy' },
  fish: { emoji: '🐟', zh: '鱼类', en: 'Fish' },
  shellfish: { emoji: '🦐', zh: '贝类', en: 'Shellfish' },
  sesame: { emoji: '🌿', zh: '芝麻', en: 'Sesame' },
  corn: { emoji: '🌽', zh: '玉米', en: 'Corn' },
  stonefruit: { emoji: '🍑', zh: '核果类', en: 'Stone Fruit' },
};

type Severity = 'mild' | 'moderate' | 'severe';

interface Props {
  allergens: string[];
  onNext: (severities: Record<string, Severity>) => void;
  onBack: () => void;
}

const Screen5Severity: React.FC<Props> = ({ allergens, onNext, onBack }) => {
  const { t, lang } = useI18n();
  const displayAllergens = allergens.filter(a => a !== 'custom' && allergenMap[a]);

  const [severities, setSeverities] = useState<Record<string, Severity>>(
    Object.fromEntries(displayAllergens.map(a => [a, 'moderate']))
  );

  const setSeverity = (id: string, level: Severity) => {
    setSeverities(prev => ({ ...prev, [id]: level }));
  };

  const setAllSevere = () => {
    setSeverities(Object.fromEntries(displayAllergens.map(a => [a, 'severe'])));
  };

  const levels: { key: Severity; label: string; desc: string }[] = [
    { key: 'mild', label: t('mild'), desc: t('mildDesc') },
    { key: 'moderate', label: t('moderate'), desc: t('moderateDesc') },
    { key: 'severe', label: t('severe'), desc: t('severeDesc') },
  ];

  return (
    <OnboardingShell bgColor="#C8E6C9" step={5} progressColor="#4CAF50" onBack={onBack}>
      <div className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
              {t('severityTitle')}
            </h1>
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
              {t('severitySubtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={setAllSevere}
          className="text-xs font-bold mt-2"
          style={{ color: '#E63946' }}
        >
          {t('setAllSevere')}
        </button>
      </div>

      <div className="mt-4 space-y-3 overflow-y-auto flex-1 -mx-1 px-1">
        {displayAllergens.map(id => {
          const a = allergenMap[id];
          if (!a) return null;
          return (
            <div key={id} className="rounded-2xl p-4" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{a.emoji}</span>
                <span className="font-heading font-bold text-[15px]" style={{ color: '#1A1A1A' }}>
                  {lang === 'zh' ? a.zh : a.en}
                </span>
              </div>
              <div className="space-y-2">
                {levels.map(l => (
                  <button
                    key={l.key}
                    onClick={() => setSeverity(id, l.key)}
                    className="w-full flex items-center gap-3 text-left py-1"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: severities[id] === l.key ? '#2D6A4F' : '#D1D5DB' }}
                    >
                      {severities[id] === l.key && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2D6A4F' }} />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{l.label}</span>
                      <span className="text-xs ml-2" style={{ color: '#6B7280' }}>{l.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4">
        <CtaButton label={t('next')} onClick={() => onNext(severities)} color="#4CAF50" textColor="white" />
      </div>
    </OnboardingShell>
  );
};

export default Screen5Severity;
