import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

const symptomMap: Record<string, { emoji: string; zh: string; en: string }> = {
  tremor: { emoji: '✋', zh: '震颤', en: 'Tremor' },
  rigidity: { emoji: '🦾', zh: '僵硬', en: 'Rigidity' },
  dyskinesia: { emoji: '〰️', zh: '异动症', en: 'Dyskinesia' },
  off: { emoji: '⏱️', zh: '药效减退', en: 'Wearing-off' },
  gait: { emoji: '🚶', zh: '步态不稳', en: 'Gait changes' },
  sleep: { emoji: '🌙', zh: '睡眠问题', en: 'Sleep issues' },
  constipation: { emoji: '🩺', zh: '便秘', en: 'Constipation' },
  mood: { emoji: '🧠', zh: '情绪波动', en: 'Mood changes' },
  falls: { emoji: '⚠️', zh: '跌倒风险', en: 'Fall risk' },
  fatigue: { emoji: '🔋', zh: '疲劳', en: 'Fatigue' },
  freezing: { emoji: '🧊', zh: '冻结步态', en: 'Freezing of gait' },
};

type Severity = 'mild' | 'moderate' | 'severe';

interface Props {
  symptoms: string[];
  onNext: (severities: Record<string, Severity>) => void;
  onBack: () => void;
}

const Screen5Severity: React.FC<Props> = ({ symptoms, onNext, onBack }) => {
  const { t, lang } = useI18n();
  const displaySymptoms = symptoms.filter(a => a !== 'custom' && symptomMap[a]);

  const [severities, setSeverities] = useState<Record<string, Severity>>(
    Object.fromEntries(displaySymptoms.map(a => [a, 'moderate']))
  );

  const setSeverity = (id: string, level: Severity) => {
    setSeverities(prev => ({ ...prev, [id]: level }));
  };

  const setAllSevere = () => {
    setSeverities(Object.fromEntries(displaySymptoms.map(a => [a, 'severe'])));
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
        {displaySymptoms.map(id => {
          const a = symptomMap[id];
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
