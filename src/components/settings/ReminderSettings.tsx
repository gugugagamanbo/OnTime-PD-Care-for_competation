import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Props {
  onBack: () => void;
}

const ReminderSettings = ({ onBack }: Props) => {
  const { t } = useLanguage();

  const [medReminder, setMedReminder] = useState(true);
  const [advanceTime, setAdvanceTime] = useState('15');
  const [missedReRemind, setMissedReRemind] = useState(true);
  const [familyNotify, setFamilyNotify] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const [ringtone, setRingtone] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [largeFont, setLargeFont] = useState(false);
  const [voiceReminder, setVoiceReminder] = useState(false);

  const SwitchRow = ({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-gray-900" />
    </div>
  );

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('settings.reminder.title')}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl px-4 divide-y divide-gray-100">
        <SwitchRow label={t('settings.reminder.medReminder')} checked={medReminder} onChange={setMedReminder} />

        <div className="py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{t('settings.reminder.advanceTime')}</p>
            <Select value={advanceTime} onValueChange={setAdvanceTime}>
              <SelectTrigger className="w-[130px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">{t('settings.reminder.min10')}</SelectItem>
                <SelectItem value="15">{t('settings.reminder.min15')}</SelectItem>
                <SelectItem value="30">{t('settings.reminder.min30')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SwitchRow
          label={t('settings.reminder.missedReRemind')}
          desc={t('settings.reminder.missedReRemindDesc')}
          checked={missedReRemind}
          onChange={setMissedReRemind}
        />

        <SwitchRow label={t('settings.reminder.familyNotify')} checked={familyNotify} onChange={setFamilyNotify} />

        <SwitchRow
          label={t('settings.reminder.nightMode')}
          desc={t('settings.reminder.nightModeDesc')}
          checked={nightMode}
          onChange={setNightMode}
        />

        <SwitchRow label={t('settings.reminder.ringtone')} checked={ringtone} onChange={setRingtone} />
        <SwitchRow label={t('settings.reminder.vibration')} checked={vibration} onChange={setVibration} />

        <SwitchRow
          label={t('settings.reminder.largeFont')}
          desc={t('settings.reminder.largeFontDesc')}
          checked={largeFont}
          onChange={setLargeFont}
        />

        <SwitchRow
          label={t('settings.reminder.voiceReminder')}
          desc={t('settings.reminder.voiceReminderDesc')}
          checked={voiceReminder}
          onChange={setVoiceReminder}
        />
      </div>
    </div>
  );
};

export default ReminderSettings;
