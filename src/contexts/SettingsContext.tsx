import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface AppSettings {
  // Reminder settings
  medReminderEnabled: boolean;
  advanceMinutes: number;
  missedReRemind: boolean;
  nightMode: boolean;
  vibration: boolean;
  largeFont: boolean;
  voiceReminder: boolean;

  // 数据采集权限
  allowAIAnalysis: boolean;
  allowWatchData: boolean;
  savePrescriptionImages: boolean;

  // 家属协作权限
  familyViewMedLog: boolean;
  familyMissedAlert: boolean;
  familyEditMedPlan: boolean;

  // 医生/外部分享权限
  allowReportGen: boolean;
  previewBeforeExport: boolean;
  allowExportToDoctor: boolean;
}

const defaultSettings: AppSettings = {
  medReminderEnabled: true,
  advanceMinutes: 15,
  missedReRemind: true,
  nightMode: false,
  vibration: true,
  largeFont: false,
  voiceReminder: false,

  allowAIAnalysis: true,
  allowWatchData: true,
  savePrescriptionImages: false,

  familyViewMedLog: true,
  familyMissedAlert: true,
  familyEditMedPlan: false,

  allowReportGen: true,
  previewBeforeExport: true,
  allowExportToDoctor: false,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const settingsKeyFor = (userId?: string, isGuest?: boolean) => {
  if (userId) return `pd_care_settings_${userId}`;
  if (isGuest) return 'pd_care_settings_guest';
  return 'pd_care_settings_anonymous';
};

const loadSettings = (key: string): AppSettings => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
  } catch {
    return defaultSettings;
  }
  return defaultSettings;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const storageKey = useMemo(() => settingsKeyFor(user?.id, isGuest), [isGuest, user?.id]);
  const [loadedKey, setLoadedKey] = useState(storageKey);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings(storageKey));

  useEffect(() => {
    setSettings(loadSettings(storageKey));
    setLoadedKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (loadedKey !== storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [loadedKey, settings, storageKey]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
