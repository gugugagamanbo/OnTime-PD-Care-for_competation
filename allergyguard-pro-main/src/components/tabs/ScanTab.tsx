import { useState } from 'react';
import { ArrowLeft, FileText, Camera, PenLine, History, ShieldAlert, Check, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DetectedMed {
  name: string;
  strength: string;
  dose: string;
  times: string[];
  instruction: string;
  confidence: '高' | '中';
  confirmed: boolean;
}

const mockDetectedMeds: DetectedMed[] = [
  {
    name: '左旋多巴/卡比多巴',
    strength: '25/100mg',
    dose: '1片',
    times: ['08:00', '12:00', '16:00', '20:00'],
    instruction: '餐前30分钟',
    confidence: '高',
    confirmed: false,
  },
  {
    name: '多巴胺受体激动剂',
    strength: '0.5mg',
    dose: '1片',
    times: ['睡前'],
    instruction: '遵医嘱',
    confidence: '中',
    confirmed: false,
  },
];

const emptyManualMed: DetectedMed = {
  name: '',
  strength: '',
  dose: '',
  times: [''],
  instruction: '',
  confidence: '高',
  confirmed: false,
};

const ScanTab = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<'home' | 'camera' | 'scanning' | 'analyzing' | 'results' | 'manual'>('home');
  const [detectedMeds, setDetectedMeds] = useState<DetectedMed[]>(mockDetectedMeds);
  const [manualMed, setManualMed] = useState<DetectedMed>(emptyManualMed);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleCapture = () => {
    setView('scanning');
    setTimeout(() => setView('analyzing'), 1400);
    setTimeout(() => setView('results'), 2200);
  };

  const handleConfirmAll = () => {
    setDetectedMeds(prev => prev.map(m => ({ ...m, confirmed: true })));
    showToast(t('scan.generated'));
  };

  const handleSendPharmacist = () => {
    showToast(t('scan.sentToPharmacist'));
  };

  const updateDetectedMed = (index: number, field: keyof DetectedMed, value: string | string[]) => {
    setDetectedMeds(prev => prev.map((med, i) => {
      if (i !== index) return med;
      return { ...med, [field]: value, confirmed: false };
    }));
  };

  const removeDetectedMed = (index: number) => {
    setDetectedMeds(prev => prev.filter((_, i) => i !== index));
  };

  const updateManualMed = (field: keyof DetectedMed, value: string | string[]) => {
    setManualMed(prev => ({ ...prev, [field]: value }));
  };

  const handleAddManualMed = () => {
    if (!manualMed.name.trim() || !manualMed.dose.trim() || !manualMed.times.join('').trim()) {
      showToast('请至少填写药名、剂量和服药时间');
      return;
    }
    setDetectedMeds(prev => [
      ...prev,
      {
        ...manualMed,
        times: manualMed.times[0].split(/[,，、/ ]+/).filter(Boolean),
        instruction: manualMed.instruction || '遵医嘱',
        confidence: '高',
        confirmed: false,
      },
    ]);
    setManualMed(emptyManualMed);
    setView('results');
    showToast('已添加到待确认用药计划');
  };

  // Home view — entry buttons
  if (view === 'home') {
    return (
      <div className="px-5 pt-6 pb-28 space-y-5">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('scan.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('scan.subtitle')}</p>
        </div>

        {/* Entry buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('camera')}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-gray-400 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FileText size={22} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('scan.prescription')}</span>
          </button>
          <button
            onClick={() => setView('camera')}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-gray-400 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Camera size={22} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('scan.medicineBox')}</span>
          </button>
          <button
            onClick={() => setView('manual')}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-gray-400 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <PenLine size={22} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('scan.manual')}</span>
          </button>
          <button
            onClick={() => setView('results')}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-gray-400 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <History size={22} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('scan.importHistory')}</span>
          </button>
        </div>

        {/* Safety note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            {t('scan.safetyNote')}
          </p>
        </div>
      </div>
    );
  }

  if (view === 'manual') {
    return (
      <div className="px-5 pt-6 pb-28 space-y-5">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('scan.manual')}</h1>
            <p className="text-xs text-gray-500 mt-0.5">手动录入后仍需在待确认计划中核对。</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          {[
            ['name', '药物名称', manualMed.name, '例如：左旋多巴/卡比多巴'],
            ['strength', '规格', manualMed.strength, '例如：25/100mg'],
            ['dose', '每次剂量', manualMed.dose, '例如：1片'],
            ['times', '服药时间', manualMed.times[0], '例如：08:00，12:00，16:00'],
            ['instruction', '服药说明', manualMed.instruction, '例如：餐前30分钟'],
          ].map(([field, label, value, placeholder]) => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <input
                value={value}
                placeholder={placeholder}
                onChange={event => {
                  if (field === 'times') updateManualMed('times', [event.target.value]);
                  else updateManualMed(field as keyof DetectedMed, event.target.value);
                }}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </label>
          ))}
        </div>

        <button
          onClick={handleAddManualMed}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          添加到待确认用药计划
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            手动添加的信息也需要核对处方原文，任何药物调整请遵医嘱。
          </p>
        </div>
      </div>
    );
  }

  // Results view
  if (view === 'results') {
    return (
      <div className="px-5 pt-6 pb-28 space-y-5">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('scan.resultTitle')}</h1>
        </div>

        {/* Detected medications */}
        <div className="space-y-3">
          {detectedMeds.map((med, i) => {
            const isMedium = med.confidence === '中';
            return (
              <div key={i} className={`bg-white border rounded-2xl p-4 space-y-3 ${med.confirmed ? 'border-green-200' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-gray-900">药物 {i + 1}</p>
                  {med.confirmed ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <Check size={14} /> 已确认
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {t('scan.toConfirm')}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {[
                    ['name', '药物名称', med.name],
                    ['strength', t('scan.strength'), med.strength],
                    ['dose', t('scan.dosage'), med.dose],
                    ['times', t('scan.times'), med.times.join('，')],
                    ['instruction', t('scan.instruction'), med.instruction],
                  ].map(([field, label, value]) => (
                    <label key={field} className="block">
                      <span className="text-xs text-gray-500">{label}</span>
                      <input
                        value={value}
                        onChange={event => {
                          if (field === 'times') {
                            updateDetectedMed(i, 'times', event.target.value.split(/[,，、/ ]+/).filter(Boolean));
                          } else {
                            updateDetectedMed(i, field as keyof DetectedMed, event.target.value);
                          }
                        }}
                        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{t('scan.confidence')}</span>
                  <select
                    value={med.confidence}
                    onChange={event => updateDetectedMed(i, 'confidence', event.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-lg border ${
                      isMedium ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    <option value="高">{t('scan.confidenceHigh')}</option>
                    <option value="中">{t('scan.confidenceMedium')}</option>
                  </select>
                </div>

                {isMedium && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <p className="text-xs text-amber-800">{t('scan.uncertainNote')}</p>
                  </div>
                )}

                <button
                  onClick={() => removeDetectedMed(i)}
                  className="w-full py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-500 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={13} />
                  删除这条药物
                </button>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            onClick={handleConfirmAll}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
          >
            {t('scan.confirmGenerate')}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { setView('camera'); setDetectedMeds(mockDetectedMeds); }}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
            >
              {t('scan.rescan')}
            </button>
            <button
              onClick={handleSendPharmacist}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
            >
              {t('scan.sendPharmacist')}
            </button>
          </div>
        </div>

        {/* Safety note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            {t('scan.safetyNote')}
          </p>
        </div>
      </div>
    );
  }

  // Analyzing overlay
  if (view === 'analyzing') {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black gap-4">
        <div className="w-10 h-10 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        <p className="text-white font-semibold text-base">{t('scan.analyzing')}</p>
      </div>
    );
  }

  // Camera / scanning view
  return (
    <>
      <style>{`
        @keyframes scan-sweep {
          0%   { transform: translateY(0); opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(var(--box-height, 200px)); opacity: 0; }
        }
        .scan-line {
          animation: scan-sweep 1.2s ease-in infinite;
        }
      `}</style>
      <div className="fixed inset-0 z-40 flex flex-col bg-black">
        {/* Back button */}
        <div className="absolute top-6 left-4 z-50">
          <button onClick={() => setView('home')} className="p-2">
            <ArrowLeft size={22} className="text-white" />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative z-10 w-[calc(100%-48px)] max-w-[342px] aspect-[3/2] bg-transparent overflow-hidden"
            style={{ '--box-height': '200px' } as React.CSSProperties}
          >
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg" />
            {view === 'scanning' && (
              <div className="scan-line absolute left-2 right-2 top-0 h-0.5 bg-white/70 shadow-[0_0_8px_2px_rgba(255,255,255,0.4)]" />
            )}
          </div>
          <p className="absolute bottom-[calc(50%-70px)] left-0 right-0 text-center text-white/70 text-xs mt-4 translate-y-[calc(100%+100px)]">
            {view === 'scanning' ? t('scan.analyzing') : t('scan.hint')}
          </p>
          {view === 'scanning' && (
            <div className="absolute inset-0 bg-white/10 z-20" />
          )}
        </div>

        {/* Shutter button */}
        <div className="pb-24 pt-6 flex items-center justify-center bg-black">
          <button
            onClick={handleCapture}
            disabled={view === 'scanning'}
            className="w-16 h-16 rounded-full border-[3px] border-white/80 flex items-center justify-center transition-transform active:scale-90"
          >
            <div className={`w-[52px] h-[52px] rounded-full bg-white transition-opacity ${view === 'scanning' ? 'opacity-40' : 'opacity-100'}`} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ScanTab;
