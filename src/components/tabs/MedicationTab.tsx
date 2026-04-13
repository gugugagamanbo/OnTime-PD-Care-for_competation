import { useMemo, useState, useEffect } from 'react';
import { Clock, Check, AlertCircle, Package, Phone, X, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type MedicationPlanItem, useCareData } from '@/contexts/CareDataContext';
import { requestNotificationPermission, scheduleMedicationReminders, getNotificationPermission } from '@/services/notificationService';

type MedStatus = 'taken' | 'late' | 'pending' | 'missed';

interface MedItem {
  id: number;
  medId: number;
  time: string;
  name: string;
  label: string;
  dose: string;
  instructionKey: 'med.beforeMeal' | 'med.afterMeal' | 'med.beforeSleep';
  status: MedStatus;
  lateBy?: string;
}

const stockStatus = (days: number) => {
  if (days <= 5) return { label: '库存偏低', className: 'bg-red-50 text-red-700 border-red-200' };
  if (days <= 10) return { label: '需要关注', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
  return { label: '库存充足', className: 'bg-green-50 text-green-700 border-green-200' };
};

const telFromContact = (contact?: string) => {
  const digits = contact?.match(/\+?\d[\d\s-]{5,}/)?.[0].replace(/[^\d+]/g, '');
  return digits || '';
};

const displayRole = (role: string, department?: string) => {
  if (role === '医生' && department) return `${department}医生`;
  if (role === '药剂师' && department) return `${department}药剂师`;
  return role;
};

const defaultStatusForDose = (medication: MedicationPlanItem, time: string): { status: MedStatus; lateBy?: string } => {
  if (medication.id === 1 && time === '07:00') return { status: 'taken' };
  if (medication.id === 2 && time === '11:00') return { status: 'late', lateBy: '18分钟' };
  return { status: 'pending' };
};

const buildSchedule = (medications: MedicationPlanItem[], statusOverrides: Record<number, MedStatus>): MedItem[] =>
  medications
    .flatMap(medication => medication.times.map((time, index) => {
      const id = medication.id * 100 + index;
      const defaultStatus = defaultStatusForDose(medication, time);
      return {
        id,
        medId: medication.id,
        time,
        name: medication.name,
        label: medication.label,
        dose: medication.dose,
        instructionKey: medication.instructionKey,
        status: statusOverrides[id] ?? defaultStatus.status,
        lateBy: statusOverrides[id] ? undefined : defaultStatus.lateBy,
      };
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

const statusConfig: Record<MedStatus, { bg: string; text: string; border: string }> = {
  taken: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  late: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  pending: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  missed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const MedicationTab = () => {
  const { t } = useLanguage();
  const { careTeam, medications } = useCareData();
  const [statusOverrides, setStatusOverrides] = useState<Record<number, MedStatus>>({});
  const [toast, setToast] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  const clinicalContacts = useMemo(
    () => careTeam.filter(member => member.role === '医生' || member.role === '药剂师'),
    [careTeam]
  );

  const schedule = useMemo(() => buildSchedule(medications, statusOverrides), [medications, statusOverrides]);
  const nextDose = schedule.find(item => item.status === 'pending') ?? schedule[0];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const updateStatus = (id: number, status: MedStatus) => {
    setStatusOverrides(prev => ({ ...prev, [id]: status }));
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
              {clinicalContacts.map(contact => {
                const phone = telFromContact(contact.contact);
                return (
                <div key={contact.id} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{displayRole(contact.role, contact.department)}</p>
                      <p className="text-xs text-gray-400 mt-1">{contact.contact || '暂未填写电话'}</p>
                    </div>
                    {phone ? (
                      <a
                        href={`tel:${phone}`}
                        onClick={() => showToast('正在跳转到电话 App...')}
                        className="h-10 px-3 rounded-xl bg-gray-900 text-white text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Phone size={14} />
                        拨打
                      </a>
                    ) : (
                      <button
                        disabled
                        className="h-10 px-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Phone size={14} />
                        无电话
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {contact.availableTime ? `可沟通时间：${contact.availableTime}` : '可在照护圈中补充可沟通时间'}
                  </p>
                  {contact.notes && <p className="text-xs text-gray-500 mt-1">{contact.notes}</p>}
                </div>
                );
              })}
              {clinicalContacts.length === 0 && (
                <div className="border border-dashed border-gray-200 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
                  暂无医生或药剂师联系人。请先在照护圈中新增医生或药剂师，保存后会自动同步到这里。
                </div>
              )}
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
        <p className="text-lg font-bold text-gray-900">{nextDose?.label || '暂无待服药物'}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{nextDose?.dose || t('med.dose')}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-600">{nextDose?.time || '--:--'}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{t('med.minutesLeft')}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">已完成 {takenCount}/{schedule.length} 次</span>
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
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
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
        <div className="space-y-2">
          {medications.map(item => {
            const status = stockStatus(item.stockDays);
            return (
              <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      关联药物：今日用药时间轴中的「{item.label}」
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      剩余 {item.stockRemaining}{item.stockUnit} · 预计还剩 {item.stockDays} 天
                    </p>
                  </div>
                  <span className={`text-[11px] px-2 py-1 rounded-full border flex-shrink-0 ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
