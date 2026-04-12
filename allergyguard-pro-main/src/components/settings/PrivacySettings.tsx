import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  onBack: () => void;
}

const PrivacySettings = ({ onBack }: Props) => {
  const { t } = useLanguage();

  const [reportGen, setReportGen] = useState(true);
  const [watchData, setWatchData] = useState(true);
  const [exportToDoctor, setExportToDoctor] = useState(true);
  const [savePrescription, setSavePrescription] = useState(true);
  const [consentExpanded, setConsentExpanded] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const SwitchRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-900 flex-1 pr-3">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-gray-900" />
    </div>
  );

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('settings.privacy.title')}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl px-4 divide-y divide-gray-100">
        <SwitchRow label={t('settings.privacy.reportGen')} checked={reportGen} onChange={setReportGen} />
        <SwitchRow label={t('settings.privacy.watchData')} checked={watchData} onChange={setWatchData} />
        <SwitchRow label={t('settings.privacy.exportToDoctor')} checked={exportToDoctor} onChange={setExportToDoctor} />
        <SwitchRow label={t('settings.privacy.savePrescription')} checked={savePrescription} onChange={setSavePrescription} />
      </div>

      {/* Data Export Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('settings.privacy.dataExport')}</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{t('settings.privacy.dataExportDesc')}</p>
      </div>

      {/* Delete Local Records */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full py-2.5 border border-red-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
              {t('settings.privacy.deleteLocal')}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('settings.privacy.deleteLocal')}</AlertDialogTitle>
              <AlertDialogDescription>{t('settings.privacy.deleteConfirm')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('settings.privacy.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => showToast(t('settings.privacy.deleted'))}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('settings.privacy.deleteConfirmBtn')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Informed Consent */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <button
          onClick={() => setConsentExpanded(!consentExpanded)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-sm font-semibold text-gray-900">{t('settings.privacy.consent')}</h3>
          {consentExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {consentExpanded && (
          <p className="text-xs text-gray-600 leading-relaxed mt-3">{t('settings.privacy.consentText')}</p>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;
