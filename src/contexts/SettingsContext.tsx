import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  // Reminder settings
  medReminderEnabled: boolean;
  advanceMinutes: number;
  missedReRemind: boolean;
  familyNotify: boolean;
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
  familyNotify: true,
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

const STORAGE_KEY = 'pd_care_settings';

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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

