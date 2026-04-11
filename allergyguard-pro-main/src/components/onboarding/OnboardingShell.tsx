import React from 'react';

interface OnboardingShellProps {
  children: React.ReactNode;
  bgColor: string;
  step?: number;
  totalSteps?: number;
  progressColor?: string;
  onBack?: () => void;
  showProgress?: boolean;
}

const OnboardingShell: React.FC<OnboardingShellProps> = ({
  children,
  bgColor,
  step,
  totalSteps = 7,
  progressColor,
  onBack,
  showProgress = true,
}) => {
  const progressPercent = step && totalSteps ? (step / totalSteps) * 100 : 0;

  return (
    <div
      className="min-h-screen flex justify-center transition-colors duration-400 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative overflow-hidden">
        {showProgress && (
          <div className="flex items-center gap-3 px-5 pt-4 pb-2">
            {onBack && (
              <button
                onClick={onBack}
                className="text-ag-body text-xl w-8 h-8 flex items-center justify-center shrink-0"
                aria-label="Back"
              >
                ←
              </button>
            )}
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#E0E0E0' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercent}%`, backgroundColor: progressColor }}
              />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col px-5 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingShell;
