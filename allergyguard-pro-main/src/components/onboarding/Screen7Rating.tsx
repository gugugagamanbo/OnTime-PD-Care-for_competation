import React from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

interface Props { onNext: () => void; onBack: () => void; }

const Screen7Rating: React.FC<Props> = ({ onNext, onBack }) => {
  const { t } = useI18n();

  const icons = [
    { color: '#4CAF50', symbol: '✓', label: 'Can eat', sub: t('canEat') },
    { color: '#FFB703', symbol: '−', label: 'Limit this', sub: t('limitThis') },
    { color: '#E63946', symbol: '✕', label: 'Avoid', sub: t('avoid') },
  ];

  return (
    <OnboardingShell bgColor="#FFFFFF" step={7} progressColor="#2E7D32" onBack={onBack}>
      <div className="pt-4 text-center">
        <h1 className="font-heading font-bold text-[28px]" style={{ color: '#1A1A1A' }}>
          {t('lastStepTitle')}
        </h1>
        <p className="text-[15px] font-medium mt-2 mx-auto max-w-[300px]" style={{ color: '#6B7280' }}>
          {t('lastStepSubtitle')}
        </p>
      </div>

      <div className="mt-8 rounded-2xl p-6" style={{ backgroundColor: '#F5F5F5' }}>
        <p className="text-xs mb-5" style={{ color: '#6B7280' }}>
          {t('scanHint')}
        </p>
        <div className="flex justify-around">
          {icons.map((icon, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: icon.color, color: 'white' }}
              >
                {icon.symbol}
              </div>
              <span className="text-xs font-bold" style={{ color: '#1A1A1A' }}>{icon.label}</span>
              <span className="text-[11px]" style={{ color: '#6B7280' }}>{icon.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="text-[13px] underline mt-5 mx-auto block" style={{ color: '#6B7280' }}>
        {t('whatDoTheyMean')}
      </button>

      <div className="flex-1" />

      <CtaButton label={t('next')} onClick={onNext} color="#2E7D32" textColor="white" />
    </OnboardingShell>
  );
};

export default Screen7Rating;
