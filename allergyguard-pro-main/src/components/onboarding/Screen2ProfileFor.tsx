import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import SelectionCard from './SelectionCard';
import CtaButton from './CtaButton';

interface Props {
  onNext: (selection: string) => void;
  onBack: () => void;
}

const Screen2ProfileFor: React.FC<Props> = ({ onNext, onBack }) => {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: 'self', emoji: '👤', title: t('profileSelf') },
    { id: 'child', emoji: '👶', title: t('profileChild'), sub: t('profileChildSub') },
    { id: 'family', emoji: '👨‍👩‍👧', title: t('profileFamily'), sub: t('profileFamilySub') },
    { id: 'caregiver', emoji: '👩‍⚕️', title: t('profileCaregiver'), sub: t('profileCaregiverSub') },
  ];

  return (
    <OnboardingShell bgColor="#F0F7F0" step={2} progressColor="#A5D6A7" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('profileForTitle')}
        </h1>
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
        color="#A5D6A7"
        disabled={!selected}
      />
    </OnboardingShell>
  );
};

export default Screen2ProfileFor;
