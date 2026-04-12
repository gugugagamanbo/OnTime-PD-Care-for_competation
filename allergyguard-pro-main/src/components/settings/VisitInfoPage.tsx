import { useState } from 'react';
import { ChevronLeft, Pill, Activity, Heart, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onBack: () => void;
}

const VisitInfoPage = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [activePeriod, setActivePeriod] = useState<'7' | '14' | '30'>('7');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const adherenceData: Record<string, { rate: string; missed: string; avgDelay: string }> = {
    '7': { rate: '86%', missed: '1 次', avgDelay: '12 分钟' },
    '14': { rate: '82%', missed: '3 次', avgDelay: '15 分钟' },
    '30': { rate: '84%', missed: '5 次', avgDelay: '14 分钟' },
  };

  const currentMeds = [
    '左旋多巴/卡比多巴 25/100mg — 每日4次',
    '多巴胺受体激动剂 0.5mg — 每日1次',
    '睡前缓释片 — 每日1次',
  ];

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
        <h1 className="text-xl font-bold text-gray-900">{t('settings.visitInfo.title')}</h1>
      </div>

      {/* Current Medications */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Pill size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('settings.visitInfo.currentMeds')}</h3>
        </div>
        <div className="space-y-2">
          {currentMeds.map((med, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {med}
            </div>
          ))}
        </div>
      </div>

      {/* Adherence */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('settings.visitInfo.adherence')}</h3>
        <div className="flex gap-2 mb-3">
          {(['7', '14', '30'] as const).map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activePeriod === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {t(`settings.visitInfo.days${p}` as 'settings.visitInfo.days7')}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{adherenceData[activePeriod].rate}</p>
            <p className="text-xs text-gray-500">按时率</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{adherenceData[activePeriod].missed}</p>
            <p className="text-xs text-gray-500">漏服</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{adherenceData[activePeriod].avgDelay}</p>
            <p className="text-xs text-gray-500">平均延迟</p>
          </div>
        </div>
      </div>

      {/* Recent Symptom Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('settings.visitInfo.recentSymptoms')}</h3>
        </div>
        <div className="space-y-1.5 text-sm text-gray-700">
          <p>· 僵硬 5 次（主要在 14:00-16:00）</p>
          <p>· 震颤 3 次（晨起轻微）</p>
          <p>· 异动症 1 次</p>
          <p>· 近跌倒 1 次</p>
        </div>
      </div>

      {/* Apple Watch Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('settings.visitInfo.watchSummary')}</h3>
        </div>
        <div className="space-y-1.5 text-sm text-gray-700">
          <p>· 日均震颤时长 42 分钟</p>
          <p>· 日均步数 3200 步</p>
          <p>· 静息心率 68 bpm</p>
          <p>· 日均睡眠 6.5 小时</p>
          <p>· 夜间活动平均 3 次</p>
        </div>
      </div>

      {/* Caregiver Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('settings.visitInfo.caregiverSummary')}</h3>
        </div>
        <p className="text-sm text-gray-700">照护者本周选择"需要支持"。夜间照护负担增加，有跌倒担忧。</p>
      </div>

      {/* Doctor/Pharmacist Contacts */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('settings.visitInfo.doctorContacts')}</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">王医生</span>
            <span className="text-gray-900">神经内科</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">李药师</span>
            <span className="text-gray-900">临床药师</span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() => showToast(t('settings.visitInfo.generated'))}
        className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold"
      >
        {t('settings.visitInfo.generate')}
      </button>
    </div>
  );
};

export default VisitInfoPage;
