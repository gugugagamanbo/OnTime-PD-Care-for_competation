import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import SelectionCard from './SelectionCard';
import CtaButton from './CtaButton';

interface Props {
  onNext: (type: string) => void;
  onBack: () => void;
}

const Screen3RestrictionType: React.FC<Props> = ({ onNext, onBack }) => {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: 'medication', emoji: '💊', title: t('restrictionAllergy'), sub: t('restrictionAllergySub') },
    { id: 'symptom', emoji: '📈', title: t('restrictionIntolerance'), sub: t('restrictionIntoleranceSub') },
    { id: 'coordination', emoji: '🤝', title: t('restrictionPreference'), sub: t('restrictionPreferenceSub') },
    { id: 'unsure', emoji: '🤷', title: t('restrictionUnsure'), sub: t('restrictionUnsureSub') },
  ];

  return (
    <OnboardingShell bgColor="#E8F5E9" step={3} progressColor="#81C784" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('restrictionTitle')}
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          {t('restrictionSubtitle')}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {options.map(o => (
          <SelectionCard
            key={o.id}
            emoji={o.emoji}
            title={o.title}
            subtitle={o.sub}
            selected={selected === o.id}
            onClick={() => setSelected(o.id)}
          />
        ))}
      </div>

      <div className="flex-1" />

      <CtaButton
        label={t('next')}
        onClick={() => selected && onNext(selected)}
        color="#81C784"
        disabled={!selected}
      />
    </OnboardingShell>
  );
};

export default Screen3RestrictionType;
