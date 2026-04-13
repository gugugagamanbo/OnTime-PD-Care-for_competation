import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onBack: () => void;
}

const AboutPage = ({ onBack }: Props) => {
  const { t } = useLanguage();

  const Section = ({ title, text, urgent }: { title: string; text: string; urgent?: boolean }) => (
    <div className={`rounded-2xl p-4 ${urgent ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'}`}>
      <h3 className={`text-sm font-semibold mb-2 ${urgent ? 'text-red-800 flex items-center gap-2' : 'text-gray-900'}`}>
        {urgent && <AlertTriangle size={14} className="text-red-600" />}
        {title}
      </h3>
      <p className={`text-xs leading-relaxed whitespace-pre-line ${urgent ? 'text-red-700' : 'text-gray-600'}`}>{text}</p>
    </div>
  );

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('settings.about.title')}</h1>
      </div>

      {/* App Info */}
      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl mb-2">💊</div>
        <h2 className="text-lg font-bold text-gray-900">{t('settings.about.appName')}</h2>
        <p className="text-xs text-gray-500">{t('settings.about.version')}</p>
      </div>

      <Section title={t('settings.about.positioning')} text={t('settings.about.positioningText')} />
      <Section title={t('settings.about.medDisclaimer')} text={t('settings.about.medDisclaimerText')} />
      <Section title={t('settings.about.aiDisclaimer')} text={t('settings.about.aiDisclaimerText')} />
      <Section title={t('settings.about.watchDisclaimer')} text={t('settings.about.watchDisclaimerText')} />
      <Section title={t('settings.about.privacyNote')} text={t('settings.about.privacyNoteText')} />
      <Section title={t('settings.about.emergency')} text={t('settings.about.emergencyText')} urgent />
    </div>
  );
};

export default AboutPage;
