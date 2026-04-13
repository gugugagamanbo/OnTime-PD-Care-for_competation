import { useState } from 'react';
import { ArrowLeft, FileText, Camera, PenLine, History, ShieldAlert, Check, Plus, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { scanPrescription } from '@/services/aiService';
import { useCareData } from '@/contexts/CareDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

interface DetectedMed {
  name: string;
  strength: string;
  dose: string;
  times: string[];
  instruction: string;
  confidence: '高' | '中';
  confirmed: boolean;
}

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
  const { setMedications, medications, saveMedications } = useCareData();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [view, setView] = useState<'home' | 'camera' | 'scanning' | 'analyzing' | 'results' | 'manual' | 'text-input'>('home');
  const [detectedMeds, setDetectedMeds] = useState<DetectedMed[]>([]);
  const [manualMed, setManualMed] = useState<DetectedMed>(emptyManualMed);
  const [toast, setToast] = useState('');
  const [textInput, setTextInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Real AI scan from text input
  const handleAiScan = async (content: string) => {
    if (!settings.allowAIAnalysis) {
      showToast('请先在隐私设置中开启「允许 AI 分析用药数据」');
      return;
    }
    if (!content.trim()) {
      showToast('请输入处方内容');
      return;
    }
    setAiLoading(true);
    setView('analyzing');
    try {
      const result = await scanPrescription(content);
      if (result.error) {
        showToast(`识别失败: ${result.error}`);
        setView('home');
        return;
      }
      if (result.medications && result.medications.length > 0) {
        setDetectedMeds(result.medications.map(m => ({ ...m, confirmed: false })));
        setView('results');
      } else {
        showToast('未能识别到药物信息，请重试');
        setView('home');
      }
    } catch (err) {
      console.error('AI scan error:', err);
      showToast('AI 服务出错，请稍后重试');
      setView('home');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCapture = () => {
    // Simulate camera capture → go to text input for now (real camera would use getUserMedia)
    setView('text-input');
  };

  const handleConfirmAll = async () => {
    setDetectedMeds(prev => prev.map(m => ({ ...m, confirmed: true })));
    
    // Add confirmed meds to medication plan
    const newMeds = detectedMeds.map((m, i) => ({
      id: medications.length + i + 1,
      label: `${m.name} ${m.strength}`,
      name: m.name,
      dose: m.dose,
      instructionKey: m.instruction.includes('餐前') ? 'med.beforeMeal' as const
        : m.instruction.includes('睡前') ? 'med.beforeSleep' as const
        : 'med.afterMeal' as const,
      times: m.times,
      stockRemaining: 30,
      stockDays: 30,
      stockUnit: '片',
    }));

    const nextMedications = [...medications, ...newMeds];
    setMedications(nextMedications);
    
    // Save to database if logged in
    if (user) {
      try {
        await saveMedications(nextMedications);
      } catch (err) {
        console.error('Save error:', err);
        showToast('保存到云端失败，请稍后重试');
        return;
      }
    }
    
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

  // Toast overlay
  const ToastOverlay = () => toast ? (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
      {toast}
    </div>
  ) : null;

  // Text input view for AI scan
  if (view === 'text-input') {
    return (
      <div className="px-5 pt-6 pb-28 space-y-5">
        <ToastOverlay />
        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">输入处方信息</h1>
            <p className="text-xs text-gray-500 mt-0.5">粘贴处方文字或拍照后的文字，AI 将自动识别药物</p>
          </div>
        </div>

        <textarea
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder="请粘贴处方内容，例如：&#10;多巴丝肼片 125mg 每日4次 每次1片 餐前30分钟&#10;恩他卡朋片 200mg 每日3次 每次1片"
          className="w-full h-48 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
        />

        <button
          onClick={() => handleAiScan(textInput)}
          disabled={aiLoading || !textInput.trim()}
          className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {aiLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {aiLoading ? 'AI 正在识别...' : '开始 AI 识别'}
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            AI 识别结果仅供参考，请务必核对原始处方，任何调整请遵医嘱。
          </p>
        </div>
      </div>
    );
  }

  // Home view — entry buttons
  if (view === 'home') {
    return (
      <div className="px-5 pt-6 pb-28 space-y-5">
        <ToastOverlay />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('scan.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('scan.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('text-input')}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-gray-400 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FileText size={22} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t('scan.prescription')}</span>
          </button>
          <button
            onClick={() => setView('text-input')}
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
        <ToastOverlay />
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
            ['name', '药物名称', manualMed.name, '例如：多巴丝肼片'],
            ['strength', '规格', manualMed.strength, '例如：125mg'],
            ['dose', '每次剂量', manualMed.dose, '例如：1片'],
            ['times', '服药时间', manualMed.times[0], '例如：07:00，11:00，15:00，19:00'],
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
        <ToastOverlay />
        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('scan.resultTitle')}</h1>
        </div>

        {detectedMeds.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500">暂无待确认药物</p>
            <button
              onClick={() => setView('home')}
              className="mt-3 text-sm font-medium text-gray-900 underline"
            >
              返回扫描首页
            </button>
          </div>
        ) : (
          <>
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

            <div className="space-y-2">
              <button
                onClick={handleConfirmAll}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
              >
                {t('scan.confirmGenerate')}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('text-input')}
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
          </>
        )}

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
        <Loader2 size={40} className="text-white animate-spin" />
        <p className="text-white font-semibold text-base">AI 正在分析处方...</p>
        <p className="text-white/60 text-sm">通常需要 5-10 秒</p>
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
        <div className="absolute top-6 left-4 z-50">
          <button onClick={() => setView('home')} className="p-2">
            <ArrowLeft size={22} className="text-white" />
          </button>
        </div>

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
        </div>

        <div className="pb-24 pt-6 flex flex-col items-center gap-3 bg-black">
          <button
            onClick={handleCapture}
            disabled={view === 'scanning'}
            className="w-16 h-16 rounded-full border-[3px] border-white/80 flex items-center justify-center transition-transform active:scale-90"
          >
            <div className={`w-[52px] h-[52px] rounded-full bg-white transition-opacity ${view === 'scanning' ? 'opacity-40' : 'opacity-100'}`} />
          </button>
          <button
            onClick={() => setView('text-input')}
            className="text-white/70 text-xs underline"
          >
            或直接输入文字
          </button>
        </div>
      </div>
    </>
  );
};

export default ScanTab;
