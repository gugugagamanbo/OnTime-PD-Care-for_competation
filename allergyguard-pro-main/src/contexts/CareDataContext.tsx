import React, { createContext, useContext, useState } from 'react';

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
}

interface CareDataContextType {
  careTeam: CareTeamMember[];
  setCareTeam: React.Dispatch<React.SetStateAction<CareTeamMember[]>>;
  medications: MedicationPlanItem[];
  setMedications: React.Dispatch<React.SetStateAction<MedicationPlanItem[]>>;
}

const initialCareTeam: CareTeamMember[] = [
  {
    id: 1,
    name: '周岚',
    role: '家属',
    status: '共同账号使用者',
    contact: '021-5555-0198',
    notes: '女儿，负责晚间服药确认、库存补药和复诊陪同。Demo 虚构联系人。',
  },
  {
    id: 2,
    name: '许明轩医生',
    role: '医生',
    status: '主治医生',
    contact: '021-5555-0101',
    hospital: '明和神经医学中心（Demo）',
    department: '神经内科',
    availableTime: '周二 09:00-11:30；周四 14:00-16:00',
    notes: '负责帕金森病复诊和用药方案评估，复诊时展示近期报告。',
  },
  {
    id: 3,
    name: '林若晴药师',
    role: '药剂师',
    status: '用药核对',
    contact: '021-5555-0102',
    hospital: '明和神经医学中心（Demo）',
    department: '临床药学部',
    availableTime: '工作日 14:00-16:30',
    notes: '协助核对处方扫描结果、药物相互作用和库存补药。',
  },
  {
    id: 4,
    name: '赵阿姨',
    role: '护工',
    status: '白天照护',
    contact: '021-5555-0199',
    notes: '工作日 09:00-17:00 协助服药提醒、步行训练和跌倒风险观察。Demo 虚构联系人。',
  },
];

const initialMedications: MedicationPlanItem[] = [
  {
    id: 1,
    label: '多巴丝肼片 125mg（美多芭）',
    name: '多巴丝肼片',
    dose: '1片',
    instructionKey: 'med.beforeMeal',
    times: ['07:00', '11:00', '15:00', '19:00'],
    stockRemaining: 18,
    stockDays: 4,
    stockUnit: '片',
  },
  {
    id: 2,
    label: '恩他卡朋片 200mg',
    name: '恩他卡朋片',
    dose: '1片',
    instructionKey: 'med.beforeMeal',
    times: ['07:00', '11:00', '15:00'],
    stockRemaining: 21,
    stockDays: 7,
    stockUnit: '片',
  },
  {
    id: 3,
    label: '普拉克索缓释片 0.375mg',
    name: '普拉克索缓释片',
    dose: '1片',
    instructionKey: 'med.afterMeal',
    times: ['08:00'],
    stockRemaining: 12,
    stockDays: 12,
    stockUnit: '片',
  },
  {
    id: 4,
    label: '雷沙吉兰片 1mg',
    name: '雷沙吉兰片',
    dose: '1片',
    instructionKey: 'med.afterMeal',
    times: ['08:00'],
    stockRemaining: 25,
    stockDays: 25,
    stockUnit: '片',
  },
  {
    id: 5,
    label: '左旋多巴/卡比多巴控释片 50/200mg',
    name: '左旋多巴/卡比多巴控释片',
    dose: '1片',
    instructionKey: 'med.beforeSleep',
    times: ['22:00'],
    stockRemaining: 8,
    stockDays: 8,
    stockUnit: '片',
  },
];

const CareDataContext = createContext<CareDataContextType | null>(null);

export const CareDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(initialCareTeam);
  const [medications, setMedications] = useState<MedicationPlanItem[]>(initialMedications);

  return (
    <CareDataContext.Provider value={{ careTeam, setCareTeam, medications, setMedications }}>
      {children}
    </CareDataContext.Provider>
  );
};

export const useCareData = () => {
  const ctx = useContext(CareDataContext);
  if (!ctx) throw new Error('useCareData must be used within CareDataProvider');
  return ctx;
};
