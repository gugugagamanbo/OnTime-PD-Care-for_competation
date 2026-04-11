import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import CtaButton from './CtaButton';

interface Props { onFinish: () => void; }

const confettiColors = ['#2D6A4F', '#66BB6A', '#FFB703', '#FFFFFF'];

const ConfettiPiece: React.FC<{ delay: number; color: string; left: number }> = ({ delay, color, left }) => (
  <div
    className="absolute w-2 h-3 rounded-sm animate-confetti"
    style={{
      backgroundColor: color,
      left: `${left}%`,
      top: '-20px',
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }}
  />
);

const Screen8Celebration: React.FC<Props> = ({ onFinish }) => {
  const { t } = useI18n();
  const [showChecks, setShowChecks] = useState([false, false, false]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowChecks(p => [true, p[1], p[2]]), 500),
      setTimeout(() => setShowChecks(p => [p[0], true, p[2]]), 900),
      setTimeout(() => setShowChecks(p => [p[0], p[1], true]), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const checks = [t('check1'), t('check2'), t('check3')];

  return (
    <div className="min-h-screen flex justify-center" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative overflow-hidden px-5 pt-16">
        {/* Confetti */}
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiPiece
            key={i}
            delay={Math.random() * 1.5}
            color={confettiColors[i % confettiColors.length]}
            left={Math.random() * 100}
          />
        ))}

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Progress Ring */}
          <div className="relative w-[120px] h-[120px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#E8F5E9" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#2D6A4F" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="339.292"
                strokeDashoffset="339.292"
                className="animate-ring-draw"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading font-bold text-2xl" style={{ color: '#1A1A1A' }}>100%</span>
            </div>
          </div>

          <h1 className="font-heading font-bold text-[28px] mt-8 text-center" style={{ color: '#1A1A1A' }}>
            {t('profileReady')}
          </h1>

          <div className="mt-6 space-y-4 w-full">
            {checks.map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-fade-in-up"
                style={{ animationDelay: `${0.5 + i * 0.4}s` }}
              >
                <span className="text-lg" style={{ color: '#2D6A4F' }}>✓</span>
                <span className="text-[15px]" style={{ color: '#1A1A1A' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <CtaButton label={t('continueBtn')} onClick={onFinish} color="#2D6A4F" textColor="white" delay={1800} />
        </div>
      </div>
    </div>
  );
};

export default Screen8Celebration;
