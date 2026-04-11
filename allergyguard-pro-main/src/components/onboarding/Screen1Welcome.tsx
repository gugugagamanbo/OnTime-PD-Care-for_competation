import React from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

interface Props { onNext: () => void; onBack: () => void; }

const Screen1Welcome: React.FC<Props> = ({ onNext, onBack }) => {
  const { t } = useI18n();
  const values = [
    { emoji: '🛡️', text: t('welcomeValue1') },
    { emoji: '🍽️', text: t('welcomeValue2') },
    { emoji: '👥', text: t('welcomeValue3') },
  ];

  return (
    <OnboardingShell bgColor="#F5F5F5" step={1} progressColor="#C8E6C9" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[28px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('welcomeTitle')}
        </h1>
        <p className="text-[15px] mt-2" style={{ color: '#6B7280' }}>
          {t('welcomeSubtitle')}
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-2xl">{v.emoji}</span>
            <span className="text-sm" style={{ color: '#1A1A1A' }}>{v.text}</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <p className="text-[11px] text-center mb-3" style={{ color: '#6B7280' }}>
        {t('welcomePrivacy')}
      </p>

      <CtaButton label={t('getStarted')} onClick={onNext} color="#C8E6C9" />
    </OnboardingShell>
  );
};

export default Screen1Welcome;
