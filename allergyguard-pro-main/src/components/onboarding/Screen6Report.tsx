import React from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

interface Props { onNext: () => void; onBack: () => void; }

const Screen6Report: React.FC<Props> = ({ onNext, onBack }) => {
  const { t } = useI18n();

  return (
    <OnboardingShell bgColor="#A5D6A7" step={6} progressColor="#2E7D32" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('reportTitle')}
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          {t('reportSubtitle')}
        </p>
      </div>

      <div className="mt-8">
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: 'white' }}>
          <div className="text-center">
            <span className="text-5xl">📋</span>
            <p className="font-heading font-bold text-base mt-3" style={{ color: '#1A1A1A' }}>
              {t('reportCardTitle')}
            </p>
            <p className="text-[13px] mt-3 leading-relaxed" style={{ color: '#6B7280' }}>
              {t('reportCardDesc')}
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="flex items-end gap-6 px-4 py-2 rounded-xl" style={{ backgroundColor: '#F5F5F5' }}>
              {['🛡️', '📷', '👥', '👤'].map((icon, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="text-lg"
                    style={{ opacity: i === 1 ? 1 : 0.4 }}
                  >
                    {icon}
                  </span>
                  {i === 1 && (
                    <span className="text-[10px] font-bold" style={{ color: '#2D6A4F' }}>
                      {t('scanLabel')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-center mt-5 leading-relaxed" style={{ color: '#6B7280' }}>
        {t('reportPrivacy')}
      </p>

      <div className="flex-1" />

      <CtaButton label={t('gotIt')} onClick={onNext} color="#2E7D32" textColor="white" />
    </OnboardingShell>
  );
};

export default Screen6Report;
