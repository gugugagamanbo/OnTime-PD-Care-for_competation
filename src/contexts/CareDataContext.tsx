import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type CareRole = '护工' | '家属' | '医生' | '药剂师';
export type MedicationInstructionKey = 'med.beforeMeal' | 'med.afterMeal' | 'med.beforeSleep';
export type MedStatus = 'taken' | 'late' | 'pending' | 'missed';
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface CareTeamMember {
  id: number;
  name: string;
  role: CareRole;
  status: string;
  contact?: string;
  hospital?: string;
  department?: string;
  availableTime?: string;
  notes?: string;
  dbId?: string;
}

export interface MedicationPlanItem {
  id: number;
  label: string;
  name: string;
  dose: string;
  instructionKey: MedicationInstructionKey;
  times: string[];
  stockRemaining: number;
  stockDays: number;
  stockUnit: string;
  dbId?: string;
}

export interface ProfileInfo {
  displayName: string;
  diagnosisTime: string;
  primaryDoctor: string;
  mainSymptoms: string;
  swallowingDiff: string;
  fallHistory: string;
  wearWatch: string;
  emergencyContact: string;
}

export interface SymptomLog {
  id: number;
  symptom: string;
  severity: SymptomSeverity;
  time: string;
  note: string;
  sharedTo: string[];
  loggedAt?: string;
  dbId?: string;
}

export interface MedicationLog {
  id: number;
  scheduledTime: string;
  status: MedStatus;
  medicationDbId?: string | null;
  actualTime?: string | null;
  lateBy?: string | null;
  loggedAt?: string;
  dbId?: string;
}

interface CareDataContextType {
  careTeam: CareTeamMember[];
  setCareTeam: React.Dispatch<React.SetStateAction<CareTeamMember[]>>;
  saveCareTeam: (nextCareTeam?: CareTeamMember[]) => Promise<CareTeamMember[]>;
  medications: MedicationPlanItem[];
  setMedications: React.Dispatch<React.SetStateAction<MedicationPlanItem[]>>;
  saveMedications: (nextMedications?: MedicationPlanItem[]) => Promise<MedicationPlanItem[]>;
  profileInfo: ProfileInfo;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfo>>;
  saveProfileInfo: (nextProfileInfo?: ProfileInfo) => Promise<void>;
  symptomLogs: SymptomLog[];
  saveSymptomLog: (log: Omit<SymptomLog, 'id' | 'dbId' | 'loggedAt'>) => Promise<SymptomLog | null>;
  medicationLogs: MedicationLog[];
  logMedicationStatus: (log: {
    medicationDbId?: string | null;
    scheduledTime: string;
    status: MedStatus;
    lateBy?: string | null;
  }) => Promise<MedicationLog | null>;
  dataLoading: boolean;
}

export const defaultProfileInfo: ProfileInfo = {
  displayName: '周慧兰与家人',
  diagnosisTime: '2021年3月',
  primaryDoctor: '许明轩医生',
  mainSymptoms: '右手静止性震颤、午后僵硬、动作变慢',
  swallowingDiff: '偶尔饮水呛咳',
  fallHistory: '近3个月1次',
  wearWatch: 'Apple Watch',
  emergencyContact: '周岚（女儿）',
};

const demoTeam: CareTeamMember[] = [
  { id: 1, name: '周岚', role: '家属', status: '共同账号使用者', contact: '021-5555-0198', notes: '女儿，负责晚间服药确认、库存补药和复诊陪同。Demo 虚构联系人。' },
  { id: 2, name: '许明轩医生', role: '医生', status: '主治医生', contact: '021-5555-0101', hospital: '明和神经医学中心（Demo）', department: '神经内科', availableTime: '周二 09:00-11:30；周四 14:00-16:00', notes: '负责帕金森病复诊和用药方案评估，复诊时展示近期报告。' },
  { id: 3, name: '林若晴药师', role: '药剂师', status: '用药核对', contact: '021-5555-0102', hospital: '明和神经医学中心（Demo）', department: '临床药学部', availableTime: '工作日 14:00-16:30', notes: '协助核对处方扫描结果、药物相互作用和库存补药。' },
  { id: 4, name: '赵阿姨', role: '护工', status: '白天照护', contact: '021-5555-0199', notes: '工作日 09:00-17:00 协助服药提醒、步行训练和跌倒风险观察。Demo 虚构联系人。' },
];

const demoMeds: MedicationPlanItem[] = [
  { id: 1, label: '多巴丝肼片 125mg（美多芭）', name: '多巴丝肼片', dose: '1片', instructionKey: 'med.beforeMeal', times: ['07:00', '11:00', '15:00', '19:00'], stockRemaining: 18, stockDays: 4, stockUnit: '片' },
  { id: 2, label: '恩他卡朋片 200mg', name: '恩他卡朋片', dose: '1片', instructionKey: 'med.beforeMeal', times: ['07:00', '11:00', '15:00'], stockRemaining: 21, stockDays: 7, stockUnit: '片' },
  { id: 3, label: '普拉克索缓释片 0.375mg', name: '普拉克索缓释片', dose: '1片', instructionKey: 'med.afterMeal', times: ['08:00'], stockRemaining: 12, stockDays: 12, stockUnit: '片' },
  { id: 4, label: '雷沙吉兰片 1mg', name: '雷沙吉兰片', dose: '1片', instructionKey: 'med.afterMeal', times: ['08:00'], stockRemaining: 25, stockDays: 25, stockUnit: '片' },
  { id: 5, label: '左旋多巴/卡比多巴控释片 50/200mg', name: '左旋多巴/卡比多巴控释片', dose: '1片', instructionKey: 'med.beforeSleep', times: ['22:00'], stockRemaining: 8, stockDays: 8, stockUnit: '片' },
];

const demoSymptomLogs: SymptomLog[] = [
  { id: 1, symptom: '僵硬', severity: 'moderate', time: '14:35', note: '午后药效过去后更明显', sharedTo: ['家属', '医生'] },
  { id: 2, symptom: '震颤', severity: 'mild', time: '09:20', note: '晨起轻微，服药后缓解', sharedTo: ['家属'] },
];

const instructionKeyMap: Record<string, MedicationInstructionKey> = {
  'med.beforeMeal': 'med.beforeMeal',
  'med.afterMeal': 'med.afterMeal',
  'med.beforeSleep': 'med.beforeSleep',
};

const statusMap: Record<string, MedStatus> = {
  taken: 'taken',
  late: 'late',
  pending: 'pending',
  missed: 'missed',
};

const severityMap: Record<string, SymptomSeverity> = {
  mild: 'mild',
  moderate: 'moderate',
  severe: 'severe',
};

const CareDataContext = createContext<CareDataContextType | null>(null);

const mapMedicationRow = (row: {
  id: string;
  label: string;
  name: string;
  dose: string;
  instruction_key: string | null;
  times: string[] | null;
  stock_remaining: number | null;
  stock_days: number | null;
  stock_unit: string | null;
}, index: number, fallbackId?: number): MedicationPlanItem => ({
  id: fallbackId ?? index + 1,
  dbId: row.id,
  label: row.label,
  name: row.name,
  dose: row.dose,
  instructionKey: instructionKeyMap[row.instruction_key || 'med.beforeMeal'] || 'med.beforeMeal',
  times: row.times || [],
  stockRemaining: row.stock_remaining ?? 0,
  stockDays: row.stock_days ?? 0,
  stockUnit: row.stock_unit || '片',
});

const mapCareContactRow = (row: {
  id: string;
  name: string;
  role: string;
  status: string | null;
  contact: string | null;
  hospital: string | null;
  department: string | null;
  available_time: string | null;
  notes: string | null;
}, index: number, fallbackId?: number): CareTeamMember => ({
  id: fallbackId ?? index + 1,
  dbId: row.id,
  name: row.name,
  role: row.role as CareRole,
  status: row.status || '',
  contact: row.contact || undefined,
  hospital: row.hospital || undefined,
  department: row.department || undefined,
  availableTime: row.available_time || undefined,
  notes: row.notes || undefined,
});

export const CareDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(demoTeam);
  const [medications, setMedications] = useState<MedicationPlanItem[]>(demoMeds);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfileInfo);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(demoSymptomLogs);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCareTeam(demoTeam);
      setMedications(demoMeds);
      setProfileInfo(defaultProfileInfo);
      setSymptomLogs(demoSymptomLogs);
      setMedicationLogs([]);
      return;
    }

    const loadData = async () => {
      setDataLoading(true);
      try {
        const [{ data: profileData }, { data: medsData }, { data: contactsData }, { data: symptomsData }, { data: logsData }] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('medications').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('care_contacts').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('symptoms').select('*').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(200),
          supabase.from('medication_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(300),
        ]);

        setProfileInfo({
          displayName: profileData?.display_name || user.email || defaultProfileInfo.displayName,
          diagnosisTime: profileData?.diagnosis_time || '',
          primaryDoctor: profileData?.primary_doctor || '',
          mainSymptoms: profileData?.main_symptoms || '',
          swallowingDiff: profileData?.swallowing_difficulty || '',
          fallHistory: profileData?.fall_history || '',
          wearWatch: profileData?.wearable_device || '',
          emergencyContact: profileData?.emergency_contact || '',
        });

        setMedications((medsData || []).map((m, i) => mapMedicationRow(m, i)));
        setCareTeam((contactsData || []).map((c, i) => mapCareContactRow(c, i)));
        setSymptomLogs((symptomsData || []).map((s, i) => ({
          id: i + 1,
          dbId: s.id,
          symptom: s.symptom,
          severity: severityMap[s.severity] || 'mild',
          time: s.time || '',
          note: s.note || '',
          sharedTo: s.shared_to || [],
          loggedAt: s.logged_at,
        })));
        setMedicationLogs((logsData || []).map((log, i) => ({
          id: i + 1,
          dbId: log.id,
          medicationDbId: log.medication_id,
          scheduledTime: log.scheduled_time,
          status: statusMap[log.status] || 'pending',
          actualTime: log.actual_time,
          lateBy: log.late_by,
          loggedAt: log.logged_at,
        })));
      } catch (err) {
        console.error('Failed to load care data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user]);

  const saveMedications = useCallback(async (nextMedications?: MedicationPlanItem[]) => {
    const source = nextMedications ?? medications;
    if (!user) {
      setMedications(source);
      return source;
    }

    const { data: existingData, error: existingError } = await supabase
      .from('medications')
      .select('id')
      .eq('user_id', user.id);
    if (existingError) throw existingError;

    const nextDbIds = new Set(source.map(m => m.dbId).filter(Boolean) as string[]);
    const deleteIds = (existingData || [])
      .map(row => row.id)
      .filter(id => !nextDbIds.has(id));

    if (deleteIds.length > 0) {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('user_id', user.id)
        .in('id', deleteIds);
      if (error) throw error;
    }

    const saved: MedicationPlanItem[] = [];
    for (const item of source) {
      const payload = {
        user_id: user.id,
        label: item.label,
        name: item.name,
        dose: item.dose,
        instruction_key: item.instructionKey,
        times: item.times,
        stock_remaining: item.stockRemaining,
        stock_days: item.stockDays,
        stock_unit: item.stockUnit,
      };

      if (item.dbId) {
        const { data, error } = await supabase
          .from('medications')
          .update(payload)
          .eq('user_id', user.id)
          .eq('id', item.dbId)
          .select()
          .single();
        if (error) throw error;
        saved.push(mapMedicationRow(data, saved.length, item.id));
      } else {
        const { data, error } = await supabase
          .from('medications')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        saved.push(mapMedicationRow(data, saved.length, item.id));
      }
    }

    setMedications(saved);
    return saved;
  }, [medications, user]);

  const saveCareTeam = useCallback(async (nextCareTeam?: CareTeamMember[]) => {
    const source = nextCareTeam ?? careTeam;
    if (!user) {
      setCareTeam(source);
      return source;
    }

    const { data: existingData, error: existingError } = await supabase
      .from('care_contacts')
      .select('id')
      .eq('user_id', user.id);
    if (existingError) throw existingError;

    const nextDbIds = new Set(source.map(member => member.dbId).filter(Boolean) as string[]);
    const deleteIds = (existingData || [])
      .map(row => row.id)
      .filter(id => !nextDbIds.has(id));

    if (deleteIds.length > 0) {
      const { error } = await supabase
        .from('care_contacts')
        .delete()
        .eq('user_id', user.id)
        .in('id', deleteIds);
      if (error) throw error;
    }

    const saved: CareTeamMember[] = [];
    for (const item of source) {
      const payload = {
        user_id: user.id,
        name: item.name,
        role: item.role,
        status: item.status,
        contact: item.contact || null,
        hospital: item.hospital || null,
        department: item.department || null,
        available_time: item.availableTime || null,
        notes: item.notes || null,
      };

      if (item.dbId) {
        const { data, error } = await supabase
          .from('care_contacts')
          .update(payload)
          .eq('user_id', user.id)
          .eq('id', item.dbId)
          .select()
          .single();
        if (error) throw error;
        saved.push(mapCareContactRow(data, saved.length, item.id));
      } else {
        const { data, error } = await supabase
          .from('care_contacts')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        saved.push(mapCareContactRow(data, saved.length, item.id));
      }
    }

    setCareTeam(saved);
    return saved;
  }, [careTeam, user]);

  const saveProfileInfo = useCallback(async (nextProfileInfo?: ProfileInfo) => {
    const source = nextProfileInfo ?? profileInfo;
    setProfileInfo(source);
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        display_name: source.displayName,
        diagnosis_time: source.diagnosisTime || null,
        primary_doctor: source.primaryDoctor || null,
        main_symptoms: source.mainSymptoms || null,
        swallowing_difficulty: source.swallowingDiff || null,
        fall_history: source.fallHistory || null,
        wearable_device: source.wearWatch || null,
        emergency_contact: source.emergencyContact || null,
      }, { onConflict: 'user_id' });
    if (error) throw error;
  }, [profileInfo, user]);

  const saveSymptomLog = useCallback(async (log: Omit<SymptomLog, 'id' | 'dbId' | 'loggedAt'>) => {
    if (!user) {
      const localLog: SymptomLog = { ...log, id: Date.now() };
      setSymptomLogs(prev => [localLog, ...prev]);
      return localLog;
    }

    const { data, error } = await supabase
      .from('symptoms')
      .insert({
        user_id: user.id,
        symptom: log.symptom,
        severity: log.severity,
        time: log.time || null,
        note: log.note || null,
        shared_to: log.sharedTo,
      })
      .select()
      .single();
    if (error) throw error;

    const savedLog: SymptomLog = {
      id: Date.now(),
      dbId: data.id,
      symptom: data.symptom,
      severity: severityMap[data.severity] || 'mild',
      time: data.time || '',
      note: data.note || '',
      sharedTo: data.shared_to || [],
      loggedAt: data.logged_at,
    };
    setSymptomLogs(prev => [savedLog, ...prev]);
    return savedLog;
  }, [user]);

  const logMedicationStatus = useCallback(async (log: {
    medicationDbId?: string | null;
    scheduledTime: string;
    status: MedStatus;
    lateBy?: string | null;
  }) => {
    const actualTime = log.status === 'taken' || log.status === 'late' ? new Date().toISOString() : null;
    if (!user) {
      const localLog: MedicationLog = {
        id: Date.now(),
        medicationDbId: log.medicationDbId || null,
        scheduledTime: log.scheduledTime,
        status: log.status,
        actualTime,
        lateBy: log.lateBy || null,
        loggedAt: new Date().toISOString(),
      };
      setMedicationLogs(prev => [localLog, ...prev]);
      return localLog;
    }

    const { data, error } = await supabase
      .from('medication_logs')
      .insert({
        user_id: user.id,
        medication_id: log.medicationDbId || null,
        scheduled_time: log.scheduledTime,
        actual_time: actualTime,
        status: log.status,
        late_by: log.lateBy || null,
      })
      .select()
      .single();
    if (error) throw error;

    if (log.status === 'missed') {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'missed_dose',
          title: '漏服提醒',
          body: `${log.scheduledTime} 的用药已标记为未服用`,
        });
      if (notificationError) {
        console.error('Failed to create missed-dose notification:', notificationError);
      }
    }

    const savedLog: MedicationLog = {
      id: Date.now(),
      dbId: data.id,
      medicationDbId: data.medication_id,
      scheduledTime: data.scheduled_time,
      status: statusMap[data.status] || 'pending',
      actualTime: data.actual_time,
      lateBy: data.late_by,
      loggedAt: data.logged_at,
    };
    setMedicationLogs(prev => [savedLog, ...prev]);
    return savedLog;
  }, [user]);

  return (
    <CareDataContext.Provider
      value={{
        careTeam,
        setCareTeam,
        saveCareTeam,
        medications,
        setMedications,
        saveMedications,
        profileInfo,
        setProfileInfo,
        saveProfileInfo,
        symptomLogs,
        saveSymptomLog,
        medicationLogs,
        logMedicationStatus,
        dataLoading,
      }}
    >
      {children}
    </CareDataContext.Provider>
  );
};

export const useCareData = () => {
  const ctx = useContext(CareDataContext);
  if (!ctx) throw new Error('useCareData must be used within CareDataProvider');
  return ctx;
};
