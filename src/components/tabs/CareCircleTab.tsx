import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  ChevronLeft,
  Copy,
  FileText,
  Heart,
  Save,
  Send,
  Plus,
  Trash2,
  Users,
  Watch,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type CareRole, type CareTeamMember, useCareData } from '@/contexts/CareDataContext';

type SymptomKey =
  | 'symptom.tremor'
  | 'symptom.rigidity'
  | 'symptom.slowMovement'
  | 'symptom.dyskinesia'
  | 'symptom.freezing'
  | 'symptom.unsteady'
  | 'symptom.dizziness'
  | 'symptom.nausea'
  | 'symptom.swallowing'
  | 'symptom.depression'
  | 'symptom.anxiety'
  | 'symptom.hallucination'
  | 'symptom.sleep'
  | 'symptom.constipation'
  | 'symptom.fall';

interface SymptomLog {
  symptom: string;
  severity: string;
  time: string;
  note: string;
  sharedTo: string[];
}

const symptomKeys: SymptomKey[] = [
  'symptom.tremor',
  'symptom.rigidity',
  'symptom.slowMovement',
  'symptom.dyskinesia',
  'symptom.freezing',
  'symptom.unsteady',
  'symptom.dizziness',
  'symptom.nausea',
  'symptom.swallowing',
  'symptom.depression',
  'symptom.anxiety',
  'symptom.hallucination',
  'symptom.sleep',
  'symptom.constipation',
  'symptom.fall',
];

const initialLogs: SymptomLog[] = [
  { symptom: '僵硬', severity: '中', time: '14:35', note: '午后药效过去后更明显', sharedTo: ['家属', '医生'] },
  { symptom: '震颤', severity: '轻', time: '09:20', note: '晨起轻微，服药后缓解', sharedTo: ['家属'] },
];

const watchMetrics = [
  { label: '震颤时长', value: '42 分钟', trend: '较昨日 +8 分钟' },
  { label: '异动症时长', value: '15 分钟', trend: '轻度增加' },
  { label: '步数/活动量', value: '3,200 步', trend: '较上周 -12%' },
  { label: '静息心率', value: '68 bpm', trend: '稳定' },
  { label: '睡眠时长', value: '6.5 小时', trend: '夜间活动 3 次' },
  { label: '可能 OFF 时间段', value: '14:00-16:00', trend: '与手动记录吻合' },
];

const familyAlertRules = [
  '连续2次未确认服药',
  '记录严重吞咽困难',
  '发生跌倒/近跌倒',
  '患者主动请求帮助',
];

const careRoleOptions: CareRole[] = ['护工', '家属', '医生', '药剂师'];

const CareCircleTab = () => {
  const { t } = useLanguage();
  const { careTeam, setCareTeam } = useCareData();
  const [editingMember, setEditingMember] = useState<CareTeamMember | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomKey | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [syncFamily, setSyncFamily] = useState(true);
  const [syncDoctor, setSyncDoctor] = useState(false);
  const [logs, setLogs] = useState<SymptomLog[]>(initialLogs);
  const [toast, setToast] = useState('');
  const [doctorAiVisible, setDoctorAiVisible] = useState(true);
  const [caregiverAiVisible, setCaregiverAiVisible] = useState(false);
  const [summarySent, setSummarySent] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSaveSymptom = () => {
    if (!selectedSymptom || !severity) return;
    const sharedTo: string[] = [];
    if (syncFamily) sharedTo.push('家属');
    if (syncDoctor) sharedTo.push('医生');

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setLogs(prev => [
      {
        symptom: t(selectedSymptom),
        severity,
        time: timeStr,
        note,
        sharedTo,
      },
      ...prev,
    ]);
    setSelectedSymptom(null);
    setSeverity(null);
    setNote('');
    showToast('已保存并同步');
  };

  const updateEditingMember = (field: keyof CareTeamMember, value: string) => {
    if (!editingMember) return;
    setEditingMember({ ...editingMember, [field]: value });
  };

  const startAddMember = () => {
    setEditingMember({
      id: Date.now(),
      name: '',
      role: '家属',
      status: '联系人信息',
      contact: '',
      hospital: '',
      department: '',
      availableTime: '',
      notes: '',
    });
    setConfirmingDelete(false);
  };

  const saveEditingMember = () => {
    if (!editingMember) return;
    const normalizedMember: CareTeamMember = ['医生', '药剂师'].includes(editingMember.role)
      ? editingMember
      : { ...editingMember, hospital: '', department: '', availableTime: '' };
    setCareTeam(prev => {
      const exists = prev.some(member => member.id === normalizedMember.id);
      return exists
        ? prev.map(member => (member.id === normalizedMember.id ? normalizedMember : member))
        : [...prev, normalizedMember];
    });
    setEditingMember(null);
    setConfirmingDelete(false);
    showToast(t('care.editTeam.saved'));
  };

  const deleteEditingMember = () => {
    if (!editingMember) return;
    setCareTeam(prev => prev.filter(member => member.id !== editingMember.id));
    setEditingMember(null);
    setConfirmingDelete(false);
    showToast('已删除照护团队成员');
  };

  const aiDoctorSections = [
    [t('care.doctorAi.sectionMeds'), t('care.doctorAi.sectionMedsText')],
    [t('care.doctorAi.sectionSymptoms'), t('care.doctorAi.sectionSymptomsText')],
    [t('care.doctorAi.sectionWatch'), t('care.doctorAi.sectionWatchText')],
    [t('care.doctorAi.sectionAttention'), t('care.doctorAi.sectionAttentionText')],
  ];

  const severityOptions = [t('care.mild'), t('care.moderate'), t('care.severe')];

  if (editingMember) {
    const showClinicalFields = editingMember.role === '医生' || editingMember.role === '药剂师';
    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={() => setEditingMember(null)} className="p-1">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('care.editTeam.title')}</h1>
            <p className="text-xs text-gray-500 mt-0.5">仅作为联系人信息，不是医生端口或独立登录。</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500">{t('care.editTeam.name')}</span>
            <input
              value={editingMember.name}
              onChange={event => updateEditingMember('name', event.target.value)}
              placeholder="请输入姓名"
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </label>

          <div>
            <span className="text-xs font-medium text-gray-500">{t('care.editTeam.role')}</span>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {careRoleOptions.map(role => (
                <button
                  key={role}
                  onClick={() => updateEditingMember('role', role)}
                  className={`py-2 rounded-xl border text-xs font-semibold ${
                    editingMember.role === role
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {[
            ['contact', t('care.editTeam.contact'), editingMember.contact || ''],
            ...(showClinicalFields
              ? [
                  ['hospital', t('care.editTeam.hospital'), editingMember.hospital || ''],
                  ['department', t('care.editTeam.department'), editingMember.department || ''],
                  ['availableTime', t('care.editTeam.availableTime'), editingMember.availableTime || ''],
                ]
              : []),
            ['notes', t('care.editTeam.notes'), editingMember.notes || ''],
          ].map(([field, label, value]) => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <input
                value={value}
                onChange={event => updateEditingMember(field as keyof CareTeamMember, event.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
              />
            </label>
          ))}

          {!showClinicalFields && (
            <p className="text-xs text-gray-500 leading-relaxed">
              护工和家属只记录联系方式和备注，不需要填写医院、科室和可沟通时间。
            </p>
          )}
        </div>

        <button
          onClick={saveEditingMember}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Save size={15} />
          {t('care.editTeam.save')}
        </button>

        <div className="bg-white border border-red-100 rounded-2xl p-4">
          {confirmingDelete ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-red-700">确认删除这个成员？</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                删除后，这个成员的联系人卡片会从照护团队中移除。此操作只影响本地前端原型数据。
              </p>
              <div className="flex gap-2">
                <button
                  onClick={deleteEditingMember}
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold"
                >
                  确认删除
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="w-full py-2.5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 size={15} />
              删除成员
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-28 space-y-5">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('care.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">患者和家人共同使用同一个账号，医生与药剂师仅作为联系人维护。</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users size={17} className="text-gray-600" />
          <h2 className="text-base font-semibold text-gray-900">{t('care.team')}</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {careTeam.map(member => (
            <button
              key={member.id}
              onClick={() => {
                setEditingMember(member);
                setConfirmingDelete(false);
              }}
              className="min-w-[148px] bg-white border border-gray-200 rounded-2xl p-3 flex-shrink-0 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 mb-2">
                {member.name[0]}
              </div>
              <p className="text-sm font-semibold text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
              <p className="text-xs text-gray-400 mt-1">{member.status}</p>
              <p className="text-[11px] text-gray-500 mt-2">点开编辑信息</p>
            </button>
          ))}
          <button
            onClick={startAddMember}
            className="min-w-[120px] bg-white border border-dashed border-gray-300 rounded-2xl p-3 flex-shrink-0 text-left flex flex-col items-center justify-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <Plus size={18} className="text-gray-700" />
            </div>
            <p className="text-sm font-semibold text-gray-900">新增成员</p>
            <p className="text-[11px] text-gray-500">护工/家属/医生/药剂师</p>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('care.quickLog')}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {symptomKeys.map(key => (
            <button
              key={key}
              onClick={() => {
                setSelectedSymptom(key);
                setSeverity(null);
              }}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                selectedSymptom === key
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>

        {selectedSymptom && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">{t('care.severity')}</p>
              <div className="flex gap-2">
                {severityOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setSeverity(option)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      severity === option
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={note}
              onChange={event => setNote(event.target.value)}
              placeholder={t('care.notePlaceholder')}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setSyncFamily(!syncFamily)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  syncFamily ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {t('care.syncFamily')}
              </button>
              <button
                onClick={() => setSyncDoctor(!syncDoctor)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  syncDoctor ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {t('care.syncDoctor')}
              </button>
            </div>

            <button
              onClick={handleSaveSymptom}
              disabled={!severity}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
            >
              {t('care.saveSync')}
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('care.recentLogs')}</h2>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={`${log.time}-${index}`} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{log.symptom}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    log.severity === t('care.severe')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : log.severity === t('care.moderate')
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {log.severity}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{log.time}</span>
              </div>
              {log.note && <p className="text-xs text-gray-500 mt-1">{log.note}</p>}
              {log.sharedTo.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {log.sharedTo.map(target => (
                    <span key={target} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      同步到 {target}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Watch size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('care.watch.title')}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {watchMetrics.map(metric => (
            <div key={metric.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-[11px] text-gray-500">{metric.label}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{metric.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{metric.trend}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Brain size={15} className="text-blue-700" />
            <p className="text-xs font-semibold text-blue-900">{t('care.ai.title')}</p>
          </div>
          <p className="text-xs text-blue-900 leading-relaxed">{t('care.ai.insight')}</p>
          <p className="text-[11px] text-blue-700 mt-2">{t('care.ai.disclaimer')}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('care.doctorSummary')}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">大模型会综合用药记录、症状记录、Apple Watch 数据和照护者状态生成就诊摘要。</p>
        {doctorAiVisible && (
          <div className="space-y-3 mb-3">
            {aiDoctorSections.map(([title, body]) => (
              <div key={title} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{body}</p>
              </div>
            ))}
          </div>
        )}
        {summarySent ? (
          <p className="text-xs text-green-600 font-medium">{t('care.sent')}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDoctorAiVisible(true)}
              className="py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold"
            >
              {t('care.doctorAi.generate')}
            </button>
            <button
              onClick={() => showToast(t('care.doctorAi.copied'))}
              className="py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex items-center justify-center gap-1"
            >
              <Copy size={12} />
              {t('care.doctorAi.copy')}
            </button>
            <button
              onClick={() => showToast(t('care.doctorAi.addedToReport'))}
              className="py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
            >
              {t('care.doctorAi.addToReport')}
            </button>
          </div>
        )}
        <button
          onClick={() => setSummarySent(true)}
          className="mt-2 w-full py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5"
        >
          <Send size={13} />
          {t('care.sendToDoctor')}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('care.familyAlerts')}</h3>
        </div>
        <div className="space-y-2">
          {familyAlertRules.map(rule => (
            <div key={rule} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
              {rule}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{t('care.caregiverStatus')}</h3>
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700">· {t('care.stressQuestion')}</p>
          <p className="text-sm text-gray-700">· {t('care.fallQuestion')}</p>
          <p className="text-sm text-gray-700">· {t('care.sleepQuestion')}</p>
          <p className="text-sm text-gray-700">· {t('care.visitQuestion')}</p>
        </div>
        {caregiverAiVisible && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity size={15} className="text-blue-700" />
              <p className="text-xs font-semibold text-blue-900">AI 照护者状态总结</p>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">{t('care.caregiverAi.summary')}</p>
          </div>
        )}
        {supportSent ? (
          <p className="text-xs text-green-600 font-medium">{t('care.supportSent')}</p>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => showToast('已记录：本周状态稳定')}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
            >
              {t('care.stable')}
            </button>
            <button
              onClick={() => setSupportSent(true)}
              className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
            >
              {t('care.needSupport')}
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => setCaregiverAiVisible(true)}
            className="py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
          >
            {t('care.caregiverAi.generate')}
          </button>
          <button
            onClick={() => showToast(t('care.caregiverAi.addedToReport'))}
            className="py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
          >
            {t('care.caregiverAi.addToReport')}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          AI 仅辅助整理信息，不提供诊断，也不会自动调整药物剂量。医生和药剂师没有独立端口，报告由患者或家属主动展示。
        </p>
      </div>
    </div>
  );
};

export default CareCircleTab;
