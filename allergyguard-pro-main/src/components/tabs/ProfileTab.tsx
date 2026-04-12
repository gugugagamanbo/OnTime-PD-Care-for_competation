import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
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

type SettingPage = 'reminders' | 'privacy' | 'visitInfo' | 'security' | 'about' | 'manageMeds' | 'recentReport' | null;

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

const initialProfileInfo: ProfileInfo = {
  displayName: '陈阿姨与家人',
  diagnosisTime: '2021年',
  primaryDoctor: '王医生',
  mainSymptoms: '震颤、僵硬、动作变慢',
  swallowingDiff: '偶尔',
  fallHistory: '近3个月1次',
  wearWatch: 'Apple Watch',
  emergencyContact: '妈妈',
};

const initialCurrentMeds = [
  '左旋多巴/卡比多巴 25/100mg',
  '多巴胺受体激动剂 0.5mg',
  '睡前缓释片',
];

const contacts = [
  '王医生 · 上海市第一人民医院 · 神经内科',
  '李药师 · 上海市第一人民医院 · 临床药学部',
];

const reminderOptions = [
  ['服药提醒', '按每日时间轴发送提醒', true],
  ['漏服后再次提醒', '漏服超过30分钟后再次提醒', true],
  ['通知共同使用账号的家属', '患者未确认时提醒共同账号使用者', true],
  ['夜间免打扰', '22:00 - 07:00 不发送非紧急提醒', false],
  ['震动提醒', '适合外出和安静场景', true],
  ['大字体提醒', '弹出提醒时使用更大字体', true],
  ['语音提醒', '播报药物名称和剂量', false],
] as const;

const privacyOptions = [
  ['允许生成近期报告', true],
  ['允许 Apple Watch 数据加入分析', true],
  ['允许将报告导出给医生查看', false],
  ['保存处方图片', false],
] as const;

const shareOptions = [
  ['生成近期报告前需要共同账号确认', true],
  ['Apple Watch 数据参与 AI 分析', true],
  ['导出给医生前显示预览', true],
  ['紧急情况下显示用药护照', false],
] as const;

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
  const [showSettings, setShowSettings] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [settingPage, setSettingPage] = useState<SettingPage>(null);
  const [toast, setToast] = useState('');
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(initialProfileInfo);
  const [currentMeds, setCurrentMeds] = useState<string[]>(initialCurrentMeds);
  const [newMed, setNewMed] = useState('');
  const [visitInfoGenerated, setVisitInfoGenerated] = useState(false);
  const [recentReportGenerated, setRecentReportGenerated] = useState(false);
  const [sharePrefs, setSharePrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(shareOptions.map(([label, checked]) => [label, checked]))
  );
  const [reminderPrefs, setReminderPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(reminderOptions.map(([label, , checked]) => [label, checked]))
  );
  const [privacyPrefs, setPrivacyPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(privacyOptions.map(([label, checked]) => [label, checked]))
  );
  const [selectedAdvanceTime, setSelectedAdvanceTime] = useState('提前15分钟');
  const [phone, setPhone] = useState('138****6688');
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

  const renderReminderSettings = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('提醒设置')}

      <SectionCard title="提前提醒时间">
        <div className="grid grid-cols-3 gap-2">
          {['提前10分钟', '提前15分钟', '提前30分钟'].map(option => (
            <button
              key={option}
              onClick={() => setSelectedAdvanceTime(option)}
              className={`py-2 rounded-xl text-xs font-medium border ${
                selectedAdvanceTime === option
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="提醒开关">
        <div className="space-y-4">
          {reminderOptions.map(([label, desc]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={reminderPrefs[label]}
                onClick={() => setReminderPrefs(prev => ({ ...prev, [label]: !prev[label] }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="铃声与震动">
        <div className="flex items-center justify-between text-sm text-gray-700 py-1">
          <span>提醒铃声</span>
          <span className="font-medium text-gray-900">柔和提示音</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 py-1">
          <span>震动模式</span>
          <span className="font-medium text-gray-900">标准</span>
        </div>
      </SectionCard>
    </div>
  );

  const renderManageMeds = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('管理药物')}

      <SectionCard title="当前药物清单">
        <div className="space-y-3">
          {currentMeds.map((med, index) => (
            <div key={`${med}-${index}`} className="flex items-center gap-2">
              <input
                value={med}
                onChange={event => {
                  const next = [...currentMeds];
                  next[index] = event.target.value;
                  setCurrentMeds(next);
                }}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={() => setCurrentMeds(prev => prev.filter((_, i) => i !== index))}
                className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500"
              >
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
            placeholder="例如：左旋多巴/卡比多巴 25/100mg"
            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={() => {
              if (!newMed.trim()) {
                showToast('请先填写药物信息');
                return;
              }
              setCurrentMeds(prev => [...prev, newMed.trim()]);
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
        onClick={() => {
          setSettingPage(null);
          showToast('药物清单已保存');
        }}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
      >
        保存药物清单
      </button>
    </div>
  );

  const renderRecentReport = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('近期报告')}

      <SectionCard title="报告将包含">
        <div className="space-y-2 text-sm text-gray-700">
          <p>· 最近 7 天用药记录、漏服和延迟情况</p>
          <p>· 快速记录的震颤、僵硬、吞咽困难和跌倒/近跌倒情况</p>
          <p>· Apple Watch 震颤、异动症、步数、睡眠和夜间活动摘要</p>
          <p>· AI 生成的医生摘要和照护者状态总结</p>
          <p>· 医生/药剂师联系人信息</p>
        </div>
      </SectionCard>

      <SectionCard title="报告预览">
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p><span className="font-semibold text-gray-900">用药：</span>本周按时率 86%，漏服 1 次，平均延迟 12 分钟。</p>
          <p><span className="font-semibold text-gray-900">症状：</span>下午 14:00-16:00 僵硬记录增加，近跌倒 1 次。</p>
          <p><span className="font-semibold text-gray-900">设备：</span>日均震颤 42 分钟，步数较上周下降 12%。</p>
          <p><span className="font-semibold text-gray-900">照护：</span>夜间活动次数增加，照护者标记需要支持。</p>
        </div>
      </SectionCard>

      <button
        onClick={() => {
          setRecentReportGenerated(true);
          showToast('近期报告已生成');
        }}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
      >
        生成近期报告
      </button>

      {recentReportGenerated && (
        <button
          onClick={() => showToast('近期报告下载已开始')}
          className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800"
        >
          下载近期报告
        </button>
      )}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('隐私与授权')}

      <SectionCard title="数据授权">
        <div className="space-y-4">
          {privacyOptions.map(([label]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-gray-900 flex-1">{label}</p>
              <Toggle
                checked={privacyPrefs[label]}
                onClick={() => setPrivacyPrefs(prev => ({ ...prev, [label]: !prev[label] }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="数据导出说明">
        <p className="text-sm text-gray-600 leading-relaxed">
          您的数据用于患者和家人共同账号下的日常照护整理。医生和药剂师没有独立端口，报告由患者或家属主动导出、复制或就诊时展示。
        </p>
      </SectionCard>

      <SectionCard title="知情同意说明">
        <p className="text-sm text-gray-600 leading-relaxed">
          本应用仅用于帕金森药物提醒和照护信息整理，不提供医疗诊断或治疗建议。AI 功能仅辅助总结信息，不能替代专业医疗判断。
        </p>
      </SectionCard>

      <button
        onClick={() => showToast('本地记录已清空')}
        className="w-full py-2.5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-semibold"
      >
        删除本地记录/清空示例数据
      </button>
    </div>
  );

  const renderVisitInfo = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('生成就诊信息')}

      <SectionCard title="当前药物清单">
        <div className="space-y-2">
          {currentMeds.map(med => (
            <p key={med} className="text-sm text-gray-800">· {med}</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="最近用药依从性">
        <div className="grid grid-cols-3 gap-2">
          {[
            ['近7天', '86%'],
            ['近14天', '84%'],
            ['近30天', '82%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="近期摘要">
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p><span className="font-semibold text-gray-900">最近症状摘要：</span>下午 14:00-16:00 僵硬记录增加，近跌倒 1 次。</p>
          <p><span className="font-semibold text-gray-900">Apple Watch 数据摘要：</span>日均震颤 42 分钟，异动症 15 分钟，步数较上周下降 12%。</p>
          <p><span className="font-semibold text-gray-900">照护者状态摘要：</span>夜间活动次数增加，照护者标记需要支持。</p>
        </div>
      </SectionCard>

      <SectionCard title="医生/药剂师联系人">
        <div className="space-y-2">
          {contacts.map(contact => (
            <p key={contact} className="text-sm text-gray-800">· {contact}</p>
          ))}
        </div>
      </SectionCard>

      <button
        onClick={() => {
          setVisitInfoGenerated(true);
          showToast('就诊信息已生成');
        }}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
      >
        生成并导出就诊信息
      </button>

      {visitInfoGenerated && (
        <button
          onClick={() => showToast('就诊信息下载已开始')}
          className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800"
        >
          下载就诊信息
        </button>
      )}
    </div>
  );

  const renderSecurity = () => (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {renderToast()}
      {renderSettingsHeader('账号安全')}

      <SectionCard title="手机验证码">
        <label className="block mb-3">
          <span className="text-xs font-medium text-gray-500">当前绑定手机号</span>
          <input
            value={phone}
            onChange={event => setPhone(event.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
          />
        </label>
        <div className="flex gap-2 mb-3">
          <input
            value={code}
            onChange={event => setCode(event.target.value)}
            placeholder="输入验证码"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={() => showToast('验证码已发送')}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700"
          >
            获取验证码
          </button>
        </div>
        <button
          onClick={() => showToast('验证成功')}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
        >
          验证并保存
        </button>
      </SectionCard>

      <SectionCard title="登录设备">
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">当前设备 · iPhone</p>
            <p className="text-xs text-gray-500">上次登录：今天 09:20</p>
          </div>
        </div>
      </SectionCard>

      <button
        onClick={() => showToast('已退出登录')}
        className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 flex items-center justify-center gap-2"
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
          帕金森照护助手是一款帕金森药物提醒、症状记录、Apple Watch 数据整理和就诊信息生成工具，面向患者和家人共同账号使用。
        </p>
      </SectionCard>

      <SectionCard title="医疗免责声明">
        <p className="text-sm text-gray-600 leading-relaxed">
          本工具不提供诊断，不自动调整药物剂量，不能替代医生建议。所有用药改变都应咨询主治医生。
        </p>
      </SectionCard>

      <SectionCard title="AI 免责声明">
        <p className="text-sm text-gray-600 leading-relaxed">
          AI 总结仅用于辅助整理信息，可能不完整或存在误差，不应作为诊断或治疗的唯一依据。
        </p>
      </SectionCard>

      <SectionCard title="Apple Watch 数据免责声明">
        <p className="text-sm text-gray-600 leading-relaxed">
          Apple Watch 数据仅作参考，不能单独作为临床判断依据，可能受佩戴方式、设备状态和环境影响。
        </p>
      </SectionCard>

      <SectionCard title="隐私说明">
        <p className="text-sm text-gray-600 leading-relaxed">
          信息由患者和家人共同账号管理。导出或展示给医生需由用户主动操作，医生和药剂师没有独立端口访问数据。
        </p>
      </SectionCard>

      <SectionCard title="紧急情况提示">
        <p className="text-sm text-gray-600 leading-relaxed">
          如出现严重吞咽困难、跌倒受伤、意识混乱、胸痛、呼吸困难或突发高热，应及时就医或拨打急救电话。
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
  if (editingProfile) return renderEditProfile();

  if (showSettings) {
    const settings = [
      { icon: Bell, label: '提醒设置', page: 'reminders' as const },
      { icon: Lock, label: '隐私与授权', page: 'privacy' as const },
      { icon: FileText, label: '生成就诊信息', page: 'visitInfo' as const },
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
          {settings.map(item => {
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
          {currentMeds.map(med => (
            <div key={med} className="flex items-center gap-2 text-sm text-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {med}
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
        <p className="text-xs text-gray-500 mb-3">用于共同账号内的数据管理。医生和药剂师没有独立登录入口。</p>
        <div className="space-y-4">
          {shareOptions.map(([label]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-700 min-w-0 flex-1 leading-snug">{label}</span>
              <Toggle
                checked={sharePrefs[label]}
                onClick={() => setSharePrefs(prev => ({ ...prev, [label]: !prev[label] }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default ProfileTab;
