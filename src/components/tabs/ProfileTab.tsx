import { useState } from 'react';
import type { ReactNode } from 'react';
import ApiSettings from '@/components/settings/ApiSettings';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Loader2,
  Lock,
  LogOut,
  Pill,
  Plus,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type MedicationPlanItem, useCareData } from '@/contexts/CareDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateReport, generateVisitSummary } from '@/services/aiService';
import { scheduleMedicationReminders, clearAllReminders, requestNotificationPermission, getNotificationPermission } from '@/services/notificationService';

type SettingPage = 'reminders' | 'privacy' | 'visitInfo' | 'security' | 'about' | 'manageMeds' | 'recentReport' | 'apiSettings' | null;

interface ProfileInfo {
  displayName: string;
  diagnosisTime: string;
  primaryDoctor: string;
  mainSymptoms: string;
  swallowingDiff: string;
  fallHistory: string;
  wearWatch: string;
  emergencyContact: string;
}

type PhoneOwner = 'patient' | 'family';

interface BoundPhone {
  id: number;
  owner: PhoneOwner;
  label: string;
  phone: string;
  verifiedAt: string;
}

const initialProfileInfo: ProfileInfo = {
  displayName: '周慧兰与家人',
  diagnosisTime: '2021年3月',
  primaryDoctor: '许明轩医生',
  mainSymptoms: '右手静止性震颤、午后僵硬、动作变慢',
  swallowingDiff: '偶尔饮水呛咳',
  fallHistory: '近3个月1次',
  wearWatch: 'Apple Watch',
  emergencyContact: '周岚（女儿）',
};

const phoneLimits: Record<PhoneOwner, number> = {
  patient: 1,
  family: 3,
};

const initialBoundPhones: BoundPhone[] = [
  { id: 1, owner: 'patient', label: '周慧兰（患者）', phone: '021-5555-0197', verifiedAt: '2026-04-12' },
  { id: 2, owner: 'family', label: '周岚（女儿）', phone: '021-5555-0198', verifiedAt: '2026-04-12' },
];

const Toggle = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-gray-900' : 'bg-gray-300'}`}
    aria-pressed={checked}
  >
    <span
      className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4">
    <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);

const ProfileTab = () => {
  const { t, lang, setLang } = useLanguage();
  const { careTeam, medications, setMedications, saveMedications } = useCareData();
  const { signOut, user } = useAuth();
  const { settings, updateSetting, resetSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [settingPage, setSettingPage] = useState<SettingPage>(null);
  const [toast, setToast] = useState('');
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(initialProfileInfo);
  const [newMed, setNewMed] = useState('');
  const [visitInfoGenerated, setVisitInfoGenerated] = useState(false);
  const [visitInfoContent, setVisitInfoContent] = useState('');
  const [recentReportGenerated, setRecentReportGenerated] = useState(false);
  const [recentReportContent, setRecentReportContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [boundPhones, setBoundPhones] = useState<BoundPhone[]>(initialBoundPhones);
  const [phoneOwner, setPhoneOwner] = useState<PhoneOwner>('family');
  const [phoneLabel, setPhoneLabel] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const renderToast = () => toast ? (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
      {toast}
    </div>
  ) : null;

  const openSettingPage = (page: SettingPage) => {
    setSettingPage(page);
  };

  const renderSettingsHeader = (title: string) => (
    <div className="flex items-center gap-3">
      <button onClick={() => setSettingPage(null)} className="p-1">
        <ChevronLeft size={24} className="text-gray-900" />
      </button>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    </div>
  );

  const updateProfileInfo = (field: keyof ProfileInfo, value: string) => {
    setProfileInfo(prev => ({ ...prev, [field]: value }));
  };

  const medicationNameFromLabel = (label: string) => {
    const trimmed = label.trim();
    return trimmed.replace(/\s+\d.*$/, '').trim() || trimmed;
  };

  const updateMedicationLabel = (id: number, label: string) => {
    setMedications(prev => prev.map(medication => (
      medication.id === id
        ? { ...medication, label, name: medicationNameFromLabel(label) }
        : medication
    )));
  };

  const createMedicationFromLabel = (label: string): MedicationPlanItem => ({
    id: Date.now(),
    label,
    name: medicationNameFromLabel(label),
    dose: '按医嘱',
    instructionKey: 'med.beforeMeal',
    times: ['08:00'],
    stockRemaining: 0,
    stockDays: 0,
    stockUnit: '片',
  });

  const phoneOwnerLabel = (owner: PhoneOwner) => (owner === 'patient' ? '患者' : '家人');
  const clinicalContacts = careTeam.filter(member => member.role === '医生' || member.role === '药剂师');

  const addBoundPhone = () => {
    const ownerCount = boundPhones.filter(item => item.owner === phoneOwner).length;
    if (ownerCount >= phoneLimits[phoneOwner]) {
      showToast(`${phoneOwnerLabel(phoneOwner)}手机号已达到可绑定数量上限`);
      return;
    }
    if (!phone.trim() || !code.trim()) {
      showToast('请填写手机号和验证码');
      return;
    }
    setBoundPhones(prev => [
      ...prev,
      {
        id: Date.now(),
        owner: phoneOwner,
        label: phoneLabel.trim() || `${phoneOwnerLabel(phoneOwner)}联系人`,
        phone: phone.trim(),
        verifiedAt: '今天',
      },
    ]);
    setPhone('');
    setPhoneLabel('');
    setCode('');
    showToast('手机号已绑定');
  };

  // === Apply reminder settings to notification service ===
  const applyReminderSettings = async () => {
    if (!settings.medReminderEnabled) {
      clearAllReminders();
      showToast('用药提醒已关闭');
      return;
    }

    const permission = getNotificationPermission();
    if (permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        showToast('通知权限被拒绝，请在浏览器设置中开启');
        return;
      }
    }

    const instructionMap: Record<string, string> = {
      'med.beforeMeal': '餐前30分钟',
      'med.afterMeal': '餐后服用',
      'med.beforeSleep': '睡前服用',
    };

    const allDoses = medications.flatMap(m =>
      m.times.map(time => ({
        name: m.name,
        dose: m.dose,
        time,
        instruction: instructionMap[m.instructionKey] || '遵医嘱',
      }))
    );

    const count = scheduleMedicationReminders(allDoses, settings.advanceMinutes);
    showToast(`提醒已更新，已设置 ${count} 个提醒`);
  };

  // === Real AI report generation ===
  const handleGenerateReport = async () => {
    if (!settings.allowReportGen) {
      showToast('请先在隐私设置中开启「允许生成近期报告」');
      return;
    }
    setAiLoading(true);
    try {
      const result = await generateReport({
        medications: medications.map(m => ({ name: m.name, dose: m.dose, times: m.times })),
      });
      if (result.error) {
        showToast(`生成失败: ${result.error}`);
      } else {
        setRecentReportContent(result.result || '');
        setRecentReportGenerated(true);
        showToast('近期报告已生成');
      }
    } catch (err) {
      showToast('AI 服务暂时不可用');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateVisitInfo = async () => {
    if (!settings.allowExportToDoctor) {
      showToast('请先在隐私设置中开启「允许导出数据给医生」');
      return;
    }
    setAiLoading(true);
    try {
      const result = await generateVisitSummary({
        medications: medications.map(m => ({ name: m.name, dose: m.dose, times: m.times })),
      });
      if (result.error) {
        showToast(`生成失败: ${result.error}`);
      } else {
        setVisitInfoContent(result.result || '');
        setVisitInfoGenerated(true);
        showToast('就诊信息已生成');
      }
    } catch (err) {
      showToast('AI 服务暂时不可用');
    } finally {
      setAiLoading(false);
    }
  };

  // === Real logout ===
  const handleLogout = async () => {
    try {
      await signOut();
      showToast('已退出登录');
    } catch {
      showToast('退出失败，请重试');
    }
  };

  // === Real delete local data ===
  const handleDeleteLocalData = () => {
    localStorage.removeItem('pd_care_settings');
    localStorage.removeItem('pd_care_api_config');
    resetSettings();
    clearAllReminders();
    showToast('本地记录已清空');
  };

  const renderEditProfile = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      <div className="flex items-center gap-3">
        <button onClick={() => setEditingProfile(false)} className="p-1">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">编辑资料</h1>
          <p className="text-xs text-gray-500 mt-0.5">患者和家属共同账号下维护的基础资料。</p>
        </div>
      </div>

      <SectionCard title="共同账号信息">
        <div className="space-y-3">
          {[
            ['displayName', '账号显示名称', profileInfo.displayName],
            ['primaryDoctor', '主治医生', profileInfo.primaryDoctor],
            ['emergencyContact', '紧急联系人', profileInfo.emergencyContact],
          ].map(([field, label, value]) => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <input
                value={value}
                onChange={event => updateProfileInfo(field as keyof ProfileInfo, event.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="帕金森档案">
        <div className="space-y-3">
          {[
            ['diagnosisTime', '诊断时间', profileInfo.diagnosisTime],
            ['mainSymptoms', '主要症状', profileInfo.mainSymptoms],
            ['swallowingDiff', '是否有吞咽困难', profileInfo.swallowingDiff],
            ['fallHistory', '是否有跌倒史', profileInfo.fallHistory],
            ['wearWatch', '是否佩戴手表', profileInfo.wearWatch],
          ].map(([field, label, value]) => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <input
                value={value}
                onChange={event => updateProfileInfo(field as keyof ProfileInfo, event.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <button
        onClick={() => {
          setEditingProfile(false);
          showToast('资料已保存');
        }}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
      >
        保存资料
      </button>
    </div>
  );

  // === Reminder Settings — connected to SettingsContext + notification service ===
  const renderReminderSettings = () => {
    const reminderItems: { key: keyof typeof settings; label: string; desc: string }[] = [
      { key: 'medReminderEnabled', label: '服药提醒', desc: '按每日时间轴发送提醒' },
      { key: 'missedReRemind', label: '漏服后再次提醒', desc: '漏服超过30分钟后再次提醒' },
      { key: 'familyMissedAlert', label: '通知共同使用账号的家属', desc: '患者漏服时提醒共同账号使用者' },
      { key: 'nightMode', label: '夜间免打扰', desc: '22:00 - 07:00 不发送非紧急提醒' },
      { key: 'vibration', label: '震动提醒', desc: '适合外出和安静场景' },
      { key: 'largeFont', label: '大字体提醒', desc: '弹出提醒时使用更大字体' },
      { key: 'voiceReminder', label: '语音提醒', desc: '播报药物名称和剂量' },
    ];

    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        {renderToast()}
        {renderSettingsHeader('提醒设置')}

        <SectionCard title="提前提醒时间">
          <div className="grid grid-cols-3 gap-2">
            {[10, 15, 30].map(mins => (
              <button
                key={mins}
                onClick={() => updateSetting('advanceMinutes', mins)}
                className={`py-2 rounded-xl text-xs font-medium border ${
                  settings.advanceMinutes === mins
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                提前{mins}分钟
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="提醒开关">
          <div className="space-y-4">
            {reminderItems.map(item => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  checked={settings[item.key] as boolean}
                  onClick={() => updateSetting(item.key, !settings[item.key])}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <button
          onClick={applyReminderSettings}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
        >
          应用提醒设置
        </button>
      </div>
    );
  };

  const renderManageMeds = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('管理药物')}

      <SectionCard title="当前药物清单">
        <div className="space-y-3">
          {medications.map((med) => (
            <div key={med.id} className="flex items-center gap-2">
              <input
                value={med.label}
                onChange={event => updateMedicationLabel(med.id, event.target.value)}
                disabled={!settings.familyEditMedPlan}
                className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400 ${!settings.familyEditMedPlan ? 'opacity-60' : ''}`}
              />
              {settings.familyEditMedPlan && (
                <button
                  onClick={() => setMedications(prev => prev.filter(item => item.id !== med.id))}
                  className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500"
                >
                  <Trash2 size={15} />
                </button>
              )}
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="新增药物">
        <div className="flex gap-2">
          <input
            value={newMed}
            onChange={event => setNewMed(event.target.value)}
            placeholder="例如：多巴丝肼片 125mg（美多芭）"
            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={() => {
              if (!newMed.trim()) {
                showToast('请先填写药物信息');
                return;
              }
              setMedications(prev => [...prev, createMedicationFromLabel(newMed.trim())]);
              setNewMed('');
              showToast('药物已添加');
            }}
            className="h-11 px-3 rounded-xl bg-gray-900 text-white text-sm font-semibold flex items-center gap-1"
          >
            <Plus size={15} />
            添加
          </button>
        </div>
      </SectionCard>

      <button
        onClick={async () => {
          if (user) {
            try { await saveMedications(); } catch {}
          }
          setSettingPage(null);
          showToast('药物清单已保存');
        }}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
      >
        保存药物清单
      </button>
    </div>
  );

  // === Recent Report — connected to real AI ===
  const renderRecentReport = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('近期报告')}

      <SectionCard title="报告将包含">
        <div className="space-y-2 text-sm text-gray-700">
          <p>· 最近 7 天用药记录、漏服和延迟情况</p>
          <p>· 快速记录的震颤、僵硬、吞咽困难和跌倒/近跌倒情况</p>
          {settings.allowWatchData && <p>· Apple Watch 震颤、异动症、步数、睡眠和夜间活动摘要</p>}
          <p>· AI 生成的医生摘要和照护者状态总结</p>
          <p>· 医生/药剂师联系人信息</p>
        </div>
      </SectionCard>

      {recentReportGenerated && recentReportContent && (
        <SectionCard title="AI 生成的报告">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{recentReportContent}</p>
        </SectionCard>
      )}

      <button
        onClick={handleGenerateReport}
        disabled={aiLoading}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {aiLoading && <Loader2 size={16} className="animate-spin" />}
        {aiLoading ? 'AI 生成中...' : '生成近期报告'}
      </button>

      {recentReportGenerated && settings.previewBeforeExport && (
        <SectionCard title="报告预览">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">{recentReportContent}</p>
        </SectionCard>
      )}

      {recentReportGenerated && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(recentReportContent);
            showToast('报告已复制到剪贴板');
          }}
          className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800"
        >
          复制报告内容
        </button>
      )}
    </div>
  );

  // === Privacy Settings — connected to SettingsContext ===
  const renderPrivacySettings = () => {
    const dataCollectionItems: { key: keyof typeof settings; label: string; desc: string }[] = [
      { key: 'allowAIAnalysis', label: '允许 AI 分析用药数据', desc: 'AI 报告、趋势分析功能依赖此项' },
      { key: 'allowWatchData', label: '允许采集手表健康数据', desc: 'Apple Watch 步态/震颤/心率数据' },
      { key: 'savePrescriptionImages', label: '保存处方扫描图片', desc: '扫描后是否保留原始图片' },
    ];

    const familyItems: { key: keyof typeof settings; label: string; desc: string }[] = [
      { key: 'familyViewMedLog', label: '家属可查看用药记录', desc: '家属端能否看到服药状态' },
      { key: 'familyMissedAlert', label: '家属接收漏服提醒', desc: '患者漏服时通知家属' },
      { key: 'familyEditMedPlan', label: '家属可编辑药物计划', desc: '家属能否增删改药物' },
    ];

    const doctorItems: { key: keyof typeof settings; label: string; desc: string }[] = [
      { key: 'allowReportGen', label: '允许生成就诊报告', desc: '控制 AI 报告生成功能' },
      { key: 'previewBeforeExport', label: '导出前预览确认', desc: '导出给医生前显示预览' },
      { key: 'allowExportToDoctor', label: '允许导出数据给医生', desc: '就诊时一键分享功能' },
    ];

    const renderGroup = (title: string, subtitle: string, items: typeof dataCollectionItems) => (
      <SectionCard title={title}>
        <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.key} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                checked={settings[item.key] as boolean}
                onClick={() => updateSetting(item.key, !settings[item.key])}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    );

    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        {renderToast()}
        {renderSettingsHeader('隐私与授权')}

        {renderGroup('数据采集权限', '控制 app 能收集和使用哪些数据', dataCollectionItems)}
        {renderGroup('家属协作权限', '共享账户模式下生效，控制家属能看到或操作的内容', familyItems)}
        {renderGroup('医生/外部分享', '控制数据如何导出给医疗团队', doctorItems)}

        <SectionCard title="知情同意说明">
          <p className="text-sm text-gray-600 leading-relaxed">
            本应用仅用于帕金森药物提醒和照护信息整理，不提供医疗诊断或治疗建议。AI 功能仅辅助总结信息，不能替代专业医疗判断。
          </p>
        </SectionCard>

        <button
          onClick={handleDeleteLocalData}
          className="w-full py-2.5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-semibold"
        >
          删除本地记录/清空示例数据
        </button>
      </div>
    );
  };

  // === Visit Info — connected to real AI ===
  const renderVisitInfo = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('生成就诊信息')}

      <SectionCard title="当前药物清单">
        <div className="space-y-2">
          {medications.map(med => (
            <p key={med.id} className="text-sm text-gray-800">· {med.label}</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="医生/药剂师联系人">
        <div className="space-y-2">
          {clinicalContacts.map(contact => (
            <p key={contact.id} className="text-sm text-gray-800">
              · {contact.name} · {contact.hospital || '未填写机构'} · {contact.department || contact.role}
            </p>
          ))}
          {clinicalContacts.length === 0 && (
            <p className="text-sm text-gray-500">请先在照护圈中新增医生或药剂师联系人。</p>
          )}
        </div>
      </SectionCard>

      {visitInfoGenerated && visitInfoContent && (
        <SectionCard title="AI 生成的就诊摘要">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{visitInfoContent}</p>
        </SectionCard>
      )}

      <button
        onClick={handleGenerateVisitInfo}
        disabled={aiLoading}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {aiLoading && <Loader2 size={16} className="animate-spin" />}
        {aiLoading ? 'AI 生成中...' : '生成并导出就诊信息'}
      </button>

      {visitInfoGenerated && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(visitInfoContent);
            showToast('就诊信息已复制到剪贴板');
          }}
          className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800"
        >
          复制就诊信息
        </button>
      )}
    </div>
  );

  // === Security — real signOut ===
  const renderSecurity = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('账号安全')}

      <SectionCard title="手机验证码">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(['patient', 'family'] as PhoneOwner[]).map(owner => {
            const count = boundPhones.filter(item => item.owner === owner).length;
            return (
              <button
                key={owner}
                onClick={() => setPhoneOwner(owner)}
                className={`rounded-xl border px-3 py-2 text-left ${
                  phoneOwner === owner ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <p className="text-xs font-semibold">{phoneOwnerLabel(owner)}手机号</p>
                <p className={`text-[11px] mt-0.5 ${phoneOwner === owner ? 'text-gray-200' : 'text-gray-500'}`}>
                  已绑定 {count}/{phoneLimits[owner]}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-2 mb-4">
          {boundPhones.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">
                  {phoneOwnerLabel(item.owner)} · {item.phone} · {item.verifiedAt} 验证
                </p>
              </div>
              <button
                onClick={() => {
                  setBoundPhones(prev => prev.filter(phoneItem => phoneItem.id !== item.id));
                  showToast('手机号已解绑');
                }}
                className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 flex-shrink-0"
              >
                解绑
              </button>
            </div>
          ))}
        </div>

        <label className="block mb-3">
          <span className="text-xs font-medium text-gray-500">联系人称呼</span>
          <input
            value={phoneLabel}
            onChange={event => setPhoneLabel(event.target.value)}
            placeholder={phoneOwner === 'patient' ? '例如：周慧兰（患者）' : '例如：周岚（女儿）'}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
          />
        </label>

        <label className="block mb-3">
          <span className="text-xs font-medium text-gray-500">新增绑定手机号</span>
          <input
            value={phone}
            onChange={event => setPhone(event.target.value)}
            placeholder={`输入${phoneOwnerLabel(phoneOwner)}手机号`}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
          />
        </label>

        <div className="flex gap-2 mb-3">
          <input
            value={code}
            onChange={event => setCode(event.target.value)}
            placeholder="输入验证码"
            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={() => showToast(`验证码已发送给${phoneOwnerLabel(phoneOwner)}手机号`)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 flex-shrink-0"
          >
            获取验证码
          </button>
        </div>
        <button
          onClick={addBoundPhone}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
        >
          验证并绑定
        </button>
      </SectionCard>

      <SectionCard title="登录设备">
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">当前设备 · iPhone</p>
            <p className="text-xs text-gray-500">
              {user ? `已登录：${user.email || '邮箱用户'}` : '访客模式'}
            </p>
          </div>
        </div>
      </SectionCard>

      <button
        onClick={handleLogout}
        className="w-full py-2.5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        退出登录
      </button>
    </div>
  );

  const renderAbout = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderSettingsHeader('关于与免责声明')}

      <SectionCard title="App 定位">
        <p className="text-sm text-gray-600 leading-relaxed">
          帕金森照护助手是面向患者和家人的日常照护记录工具，用于整理用药提醒、药物库存、症状记录、Apple Watch 数据、照护者状态和就诊前摘要。
        </p>
      </SectionCard>

      <SectionCard title="医疗免责声明">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {`本应用提供的信息仅用于健康管理记录和就诊沟通准备，不构成医学诊断、治疗方案、处方建议或紧急医疗服务。

任何药物剂量、服药频率、联合用药、补药或停药决定，都应由主治医生、药剂师或其他合格医疗专业人员决定。`}
        </p>
      </SectionCard>

      <SectionCard title="AI 免责声明">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {`AI 生成的摘要仅用于帮助整理已有记录。AI 可能遗漏信息或生成不准确的判断，不能替代医生评估。请勿仅凭 AI 内容作出诊断或用药决定。`}
        </p>
      </SectionCard>
    </div>
  );

  if (showSettings && settingPage === 'reminders') return renderReminderSettings();
  if (showSettings && settingPage === 'privacy') return renderPrivacySettings();
  if (showSettings && settingPage === 'visitInfo') return renderVisitInfo();
  if (showSettings && settingPage === 'security') return renderSecurity();
  if (showSettings && settingPage === 'about') return renderAbout();
  if (showSettings && settingPage === 'manageMeds') return renderManageMeds();
  if (showSettings && settingPage === 'recentReport') return renderRecentReport();
  if (showSettings && settingPage === 'apiSettings') return <ApiSettings onBack={() => setSettingPage(null)} />;
  if (editingProfile) return renderEditProfile();

  if (showSettings) {
    const settingsList = [
      { icon: Bell, label: '提醒设置', page: 'reminders' as const },
      { icon: Lock, label: '隐私与授权', page: 'privacy' as const },
      { icon: FileText, label: '生成就诊信息', page: 'visitInfo' as const },
      { icon: Cpu, label: 'AI 服务配置', page: 'apiSettings' as const },
      { icon: Shield, label: '账号安全', page: 'security' as const },
      { icon: UserRound, label: '关于与免责声明', page: 'about' as const },
    ];

    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(false)} className="p-1">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('profile.settings')}</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {settingsList.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => openSettingPage(item.page)}
                className="flex items-center justify-between w-full px-4 py-3.5 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={17} className="text-gray-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center justify-between w-full px-4 py-3.5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm text-gray-600">中/En</span>
              <span className="text-sm font-medium text-gray-900">{t('profile.language')}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {lang === 'zh' ? 'English' : '中文'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-28 space-y-6">
      {renderToast()}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t('tab.profile')}</h1>
        <button onClick={() => setShowSettings(true)} className="p-1">
          <Settings size={22} className="text-gray-700" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-2xl p-5">
        <div className="w-[72px] h-[72px] rounded-2xl bg-gray-100 flex items-center justify-center">
          <UserRound size={34} className="text-gray-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-3">{profileInfo.displayName}</h2>
        <p className="text-xs text-gray-500 mt-1">共同账号 · 帕金森患者与家属一起维护</p>
        <p className="text-xs text-gray-500 mt-0.5">主治医生：{profileInfo.primaryDoctor} · 诊断时间：{profileInfo.diagnosisTime}</p>
        <button
          onClick={() => setEditingProfile(true)}
          className="mt-3 text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50"
        >
          {t('profile.editProfile')}
        </button>
      </div>

      <button
        onClick={() => {
          setShowSettings(true);
          setSettingPage('recentReport');
        }}
        className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
      >
        <FileText size={16} />
        {t('profile.exportReport')}
      </button>

      <SectionCard title="帕金森档案">
        <div className="space-y-2.5">
          {[
            ['诊断时间', profileInfo.diagnosisTime],
            ['主要症状', profileInfo.mainSymptoms],
            ['是否有吞咽困难', profileInfo.swallowingDiff],
            ['是否有跌倒史', profileInfo.fallHistory],
            ['是否佩戴手表', profileInfo.wearWatch],
            ['紧急联系人', profileInfo.emergencyContact],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 flex-shrink-0">{label}</span>
              <span className="text-gray-900 text-right">{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="当前药物清单">
        <div className="space-y-2">
          {medications.map(med => (
            <div key={med.id} className="flex items-center gap-2 text-sm text-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {med.label}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              setShowSettings(true);
              setSettingPage('manageMeds');
            }}
            className="flex-1 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700"
          >
            管理药物
          </button>
          <button
            onClick={() => {
              setShowSettings(true);
              setSettingPage('visitInfo');
            }}
            className="flex-1 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700"
          >
            生成就诊信息
          </button>
        </div>
      </SectionCard>

      <SectionCard title="共享权限">
        <p className="text-xs text-gray-500 mb-2">在「设置 → 隐私与授权」中管理全部共享权限。</p>
        <button
          onClick={() => {
            setShowSettings(true);
            setSettingPage('privacy');
          }}
          className="w-full py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700"
        >
          前往隐私设置
        </button>
      </SectionCard>
    </div>
  );
};

export default ProfileTab;
