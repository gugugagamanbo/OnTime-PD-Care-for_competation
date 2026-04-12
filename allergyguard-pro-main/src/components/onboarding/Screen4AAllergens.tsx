import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

interface Props {
  onNext: (symptoms: string[]) => void;
  onBack: () => void;
}

const symptomOptions = [
  { id: 'tremor', emoji: '✋', zh: '震颤', en: 'Tremor' },
  { id: 'rigidity', emoji: '🦾', zh: '僵硬', en: 'Rigidity' },
  { id: 'dyskinesia', emoji: '〰️', zh: '异动症', en: 'Dyskinesia' },
  { id: 'off', emoji: '⏱️', zh: '药效减退', en: 'Wearing-off' },
  { id: 'gait', emoji: '🚶', zh: '步态不稳', en: 'Gait changes' },
  { id: 'sleep', emoji: '🌙', zh: '睡眠问题', en: 'Sleep issues' },
  { id: 'constipation', emoji: '🩺', zh: '便秘', en: 'Constipation' },
  { id: 'mood', emoji: '🧠', zh: '情绪波动', en: 'Mood changes' },
  { id: 'falls', emoji: '⚠️', zh: '跌倒风险', en: 'Fall risk' },
];

const extraSymptoms = [
  { id: 'fatigue', emoji: '🔋', zh: '疲劳', en: 'Fatigue' },
  { id: 'freezing', emoji: '🧊', zh: '冻结步态', en: 'Freezing of gait' },
  { id: 'custom', emoji: '➕', zh: '自定义添加', en: 'Custom' },
];

const Screen4AAllergens: React.FC<Props> = ({ onNext, onBack }) => {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <OnboardingShell bgColor="#DCEDC8" step={4} progressColor="#66BB6A" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('avoidTitle')}
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          {t('avoidSubtitle')}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {symptomOptions.map(a => {
          const isSelected = selected.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className="flex flex-col items-center py-3 px-2 rounded-xl border-[1.5px] transition-all"
              style={{
                backgroundColor: isSelected ? '#FFF0F0' : 'white',
                borderColor: isSelected ? '#E63946' : '#E0E0E0',
              }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span
                className="text-[11px] font-bold mt-1"
                style={{ color: isSelected ? '#E63946' : '#1A1A1A' }}
              >
                {lang === 'zh' ? a.zh : a.en}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {extraSymptoms.map(a => {
          const isSelected = selected.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className="flex items-center gap-1 px-3 py-2 rounded-full border text-xs whitespace-nowrap shrink-0 transition-all"
              style={{
                backgroundColor: isSelected ? '#FFF0F0' : 'white',
                borderColor: isSelected ? '#E63946' : '#E0E0E0',
                color: isSelected ? '#E63946' : '#1A1A1A',
              }}
            >
              <span>{a.emoji}</span>
              <span className="font-bold">{lang === 'zh' ? a.zh : a.en}</span>
            </button>
          );
        })}
      </div>

      <p
        className="text-xs text-center mt-4 cursor-pointer underline"
        style={{ color: '#6B7280' }}
        onClick={() => onNext([])}
      >
        {t('skipText')}
      </p>

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

export default Screen4AAllergens;
