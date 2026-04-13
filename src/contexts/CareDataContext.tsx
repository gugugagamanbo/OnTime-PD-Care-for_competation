import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type CareRole = '护工' | '家属' | '医生' | '药剂师';

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
}

export type MedicationInstructionKey = 'med.beforeMeal' | 'med.afterMeal' | 'med.beforeSleep';

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
  dbId?: string; // Supabase UUID
}

interface CareDataContextType {
  careTeam: CareTeamMember[];
  setCareTeam: React.Dispatch<React.SetStateAction<CareTeamMember[]>>;
  medications: MedicationPlanItem[];
  setMedications: React.Dispatch<React.SetStateAction<MedicationPlanItem[]>>;
  saveMedications: () => Promise<void>;
  saveCareTeam: () => Promise<void>;
  dataLoading: boolean;
}

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

const instructionKeyMap: Record<string, MedicationInstructionKey> = {
  'med.beforeMeal': 'med.beforeMeal',
  'med.afterMeal': 'med.afterMeal',
  'med.beforeSleep': 'med.beforeSleep',
};

const CareDataContext = createContext<CareDataContextType | null>(null);

export const CareDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(demoTeam);
  const [medications, setMedications] = useState<MedicationPlanItem[]>(demoMeds);
  const [dataLoading, setDataLoading] = useState(false);

  // Load from Supabase when user is logged in
  useEffect(() => {
    if (!user) {
      // Reset to demo data for guests
      setCareTeam(demoTeam);
      setMedications(demoMeds);
      return;
    }

    const loadData = async () => {
      setDataLoading(true);
      try {
        // Load medications
        const { data: medsData } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at');

        if (medsData && medsData.length > 0) {
          setMedications(medsData.map((m, i) => ({
            id: i + 1,
            dbId: m.id,
            label: m.label,
            name: m.name,
            dose: m.dose,
            instructionKey: instructionKeyMap[m.instruction_key || 'med.beforeMeal'] || 'med.beforeMeal',
            times: m.times || [],
            stockRemaining: m.stock_remaining ?? 0,
            stockDays: m.stock_days ?? 0,
            stockUnit: m.stock_unit || '片',
          })));
        }

        // Load care contacts
        const { data: contactsData } = await supabase
          .from('care_contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at');

        if (contactsData && contactsData.length > 0) {
          setCareTeam(contactsData.map((c, i) => ({
            id: i + 1,
            name: c.name,
            role: c.role as CareRole,
            status: c.status || '',
            contact: c.contact || undefined,
            hospital: c.hospital || undefined,
            department: c.department || undefined,
            availableTime: c.available_time || undefined,
            notes: c.notes || undefined,
          })));
        }
      } catch (err) {
        console.error('Failed to load care data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user]);

  const saveMedications = useCallback(async () => {
    if (!user) return;

    // Delete existing and re-insert (simple sync strategy)
    await supabase.from('medications').delete().eq('user_id', user.id);

    const rows = medications.map(m => ({
      user_id: user.id,
      label: m.label,
      name: m.name,
      dose: m.dose,
      instruction_key: m.instructionKey,
      times: m.times,
      stock_remaining: m.stockRemaining,
      stock_days: m.stockDays,
      stock_unit: m.stockUnit,
    }));

    if (rows.length > 0) {
      await supabase.from('medications').insert(rows);
    }
  }, [user, medications]);

  const saveCareTeam = useCallback(async () => {
    if (!user) return;

    await supabase.from('care_contacts').delete().eq('user_id', user.id);

    const rows = careTeam.map(c => ({
      user_id: user.id,
      name: c.name,
      role: c.role,
      status: c.status,
      contact: c.contact || null,
      hospital: c.hospital || null,
      department: c.department || null,
      available_time: c.availableTime || null,
      notes: c.notes || null,
    }));

    if (rows.length > 0) {
      await supabase.from('care_contacts').insert(rows);
    }
  }, [user, careTeam]);

  return (
    <CareDataContext.Provider value={{ careTeam, setCareTeam, medications, setMedications, saveMedications, saveCareTeam, dataLoading }}>
      {children}
    </CareDataContext.Provider>
  );
};

export const useCareData = () => {
  const ctx = useContext(CareDataContext);
  if (!ctx) throw new Error('useCareData must be used within CareDataProvider');
  return ctx;
};
