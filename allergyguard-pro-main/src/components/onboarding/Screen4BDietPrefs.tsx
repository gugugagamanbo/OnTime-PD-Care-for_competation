import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

interface Props {
  onNext: (prefs: string[]) => void;
  onBack: () => void;
}

const reportFocuses = [
  { id: 'medication-adherence', emoji: '💊', zh: '用药执行', en: 'Medication adherence' },
  { id: 'symptom-trend', emoji: '📈', zh: '症状趋势', en: 'Symptom trends' },
  { id: 'watch-data', emoji: '⌚', zh: 'Apple Watch 数据', en: 'Apple Watch data' },
  { id: 'caregiver-status', emoji: '🤝', zh: '照护者状态', en: 'Caregiver status' },
  { id: 'side-effects', emoji: '⚠️', zh: '副作用', en: 'Side effects' },
  { id: 'sleep-exercise', emoji: '🏃', zh: '睡眠与运动', en: 'Sleep and exercise' },
  { id: 'care-team', emoji: '👥', zh: '照护团队', en: 'Care team' },
  { id: 'visit-questions', emoji: '📝', zh: '就诊问题', en: 'Visit questions' },
];

const Screen4BDietPrefs: React.FC<Props> = ({ onNext, onBack }) => {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <OnboardingShell bgColor="#DCEDC8" step={4} progressColor="#66BB6A" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('dietPrefTitle')}
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          {t('dietPrefSubtitle')}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {reportFocuses.map(d => {
          const isSelected = selected.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => toggle(d.id)}
              className="flex items-center gap-2 p-4 rounded-2xl border-[1.5px] transition-all text-left"
              style={{
                backgroundColor: isSelected ? '#F0FFF4' : 'white',
                borderColor: isSelected ? '#2D6A4F' : '#E0E0E0',
              }}
            >
              <span className="text-2xl">{d.emoji}</span>
              <span className="font-heading font-bold text-sm" style={{ color: '#1A1A1A' }}>
                {lang === 'zh' ? d.zh : d.en}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <CtaButton
        label={t('next')}
        onClick={() => onNext(selected)}
        color="#66BB6A"
        disabled={selected.length === 0}
      />
    </OnboardingShell>
  );
};

export default Screen4BDietPrefs;
