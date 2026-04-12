import { useState } from 'react';
import { Clock, Check, AlertCircle, Package, Phone, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type MedStatus = 'taken' | 'late' | 'pending' | 'missed';

interface MedItem {
  id: number;
  time: string;
  name: string;
  dose: string;
  instructionKey: 'med.beforeMeal' | 'med.afterMeal' | 'med.beforeSleep';
  status: MedStatus;
  lateBy?: string;
}

const initialSchedule: MedItem[] = [
  { id: 1, time: '08:00', name: '左旋多巴/卡比多巴', dose: '1片', instructionKey: 'med.beforeMeal', status: 'taken' },
  { id: 2, time: '11:30', name: '多巴胺受体激动剂', dose: '0.5mg', instructionKey: 'med.afterMeal', status: 'late', lateBy: '18分钟' },
  { id: 3, time: '14:00', name: '左旋多巴/卡比多巴', dose: '1片', instructionKey: 'med.beforeMeal', status: 'pending' },
  { id: 4, time: '18:00', name: '左旋多巴/卡比多巴', dose: '1片', instructionKey: 'med.beforeMeal', status: 'pending' },
  { id: 5, time: '22:00', name: '睡前缓释片', dose: '1片', instructionKey: 'med.beforeSleep', status: 'pending' },
];

const careContacts = [
  { name: '王医生', role: '神经内科医生', phone: '021-88881200', note: '门诊电话，建议工作日上午联系' },
  { name: '李药师', role: '临床药师', phone: '021-88881201', note: '药物库存与处方核对' },
];

const statusConfig: Record<MedStatus, { bg: string; text: string; border: string }> = {
  taken: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  late: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  pending: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  missed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const MedicationTab = () => {
  const { t } = useLanguage();
  const [schedule, setSchedule] = useState<MedItem[]>(initialSchedule);
  const [toast, setToast] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const updateStatus = (id: number, status: MedStatus) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (status === 'taken') showToast('✓');
  };

  const handleRemindLater = (id: number) => {
    showToast(t('med.remindToast'));
  };

  const takenCount = schedule.filter(s => s.status === 'taken' || s.status === 'late').length;

  const statusLabel = (item: MedItem) => {
    if (item.status === 'taken') return t('med.taken');
    if (item.status === 'late') return `${t('med.late')} ${item.lateBy || ''}`;
    if (item.status === 'missed') return t('med.missed');
    return t('med.pending');
  };

  return (
    <div className="px-5 pt-6 pb-28 space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 px-4 pb-4">
          <div className="w-full max-w-[390px] bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">联系医生/药剂师</h3>
                <p className="text-xs text-gray-500 mt-1">可通过电话沟通补药、复诊或处方问题。</p>
              </div>
              <button onClick={() => setShowContactModal(false)} className="p-1 text-gray-500">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {careContacts.map(contact => (
                <div key={contact.phone} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{contact.phone}</p>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      onClick={() => showToast('正在跳转到电话 App...')}
                      className="h-10 px-3 rounded-xl bg-gray-900 text-white text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Phone size={14} />
                      拨打
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{contact.note}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowContactModal(false);
                showToast('已关闭联系弹窗');
              }}
              className="mt-3 w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700"
            >
              稍后联系
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('med.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('med.subtitle')}</p>
      </div>

      {/* Next dose status card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Clock size={14} />
          <span>{t('med.nextDose')}</span>
        </div>
        <p className="text-lg font-bold text-gray-900">左旋多巴/卡比多巴</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{t('med.dose')}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-600">14:00</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{t('med.minutesLeft')}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{t('med.todayProgress')}</span>
            <div className="flex gap-1">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className={`w-2 h-2 rounded-full ${
                    item.status === 'taken' ? 'bg-green-500' :
                    item.status === 'late' ? 'bg-yellow-400' :
                    item.status === 'missed' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('med.timeline')}</h2>
        <div className="space-y-3">
          {schedule.map((item) => {
            const config = statusConfig[item.status];
            const isPending = item.status === 'pending';
            return (
              <div key={item.id} className={`border rounded-2xl p-4 ${config.border} ${config.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">{item.time}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
                        {statusLabel(item)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{item.dose}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{t(item.instructionKey)}</span>
                    </div>
                  </div>
                  {item.status === 'taken' && (
                    <Check size={18} className="text-green-600 mt-1" />
                  )}
                  {item.status === 'late' && (
                    <AlertCircle size={18} className="text-yellow-600 mt-1" />
                  )}
                </div>

                {/* Action buttons for pending items */}
                {isPending && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200/60">
                    <button
                      onClick={() => updateStatus(item.id, 'taken')}
                      className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold"
                    >
                      {t('med.markTaken')}
                    </button>
                    <button
                      onClick={() => handleRemindLater(item.id)}
                      className="flex-1 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700"
                    >
                      {t('med.remindLater')}
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'missed')}
                      className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-500"
                    >
                      {t('med.markMissed')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly trends */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('med.weekTrend')}</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl py-3 text-center">
            <p className="text-xl font-bold text-gray-900">86%</p>
            <p className="text-xs text-gray-500">{t('med.onTimeRate')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl py-3 text-center">
            <p className="text-xl font-bold text-red-600">1 次</p>
            <p className="text-xs text-gray-500">{t('med.missedCount')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl py-3 text-center">
            <p className="text-xl font-bold text-yellow-600">12 min</p>
            <p className="text-xs text-gray-500">{t('med.avgDelay')}</p>
          </div>
        </div>
      </div>

      {/* Medication stock */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Package size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('med.stock')}</h3>
        </div>
        <p className="text-sm text-gray-700">左旋多巴/卡比多巴</p>
        <p className="text-xs text-gray-500 mt-1">{t('med.stockDays')}</p>
        <button
          onClick={() => setShowContactModal(true)}
          className="mt-3 w-full py-2 border-2 border-gray-400 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        >
          给医生发消息
        </button>
      </div>
    </div>
  );
};

export default MedicationTab;
