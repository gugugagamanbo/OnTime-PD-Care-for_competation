import { createContext, useContext } from 'react';

export type Language = 'zh' | 'en';

export const translations = {
  // Screen 0
  appName: { zh: '帕金森照护助手', en: 'Parkinson Care Assistant' },
  tagline: { zh: '按时用药。安心照护。', en: 'Medication on time. Care with confidence.' },
  getCode: { zh: '获取验证码', en: 'Get Code' },
  resendIn: { zh: '秒后重新发送', en: 'Resend in' },
  login: { zh: '登录', en: 'Continue' },
  loginDisclaimer: { zh: '登录即代表你同意我们的隐私政策与服务条款', en: 'By logging in you agree to our Privacy Policy & Terms of Service' },

  // Screen 1
  welcomeTitle: { zh: '你好！先告诉我们一些关于你的事', en: "Hi! Tell us a bit about yourself" },
  welcomeSubtitle: { zh: '只需 1 分钟，建立共同账号下的帕金森照护档案', en: 'Build a shared Parkinson care profile in about 1 minute' },
  welcomeValue1: { zh: '记录每日用药和漏服/延迟情况', en: 'Track daily medication and missed or delayed doses' },
  welcomeValue2: { zh: '整理症状、Apple Watch 数据和照护者状态', en: 'Organize symptoms, Apple Watch data, and caregiver status' },
  welcomeValue3: { zh: '就诊前生成给医生查看的近期报告', en: 'Generate recent visit reports for doctor conversations' },
  welcomePrivacy: { zh: '🔒 你的数据仅存储在你的设备，我们不会出售任何信息', en: '🔒 Your data stays on your device. We never sell your info.' },
  getStarted: { zh: '开始', en: 'Get Started' },

  // Screen 2
  profileForTitle: { zh: '这个档案是为谁建立的？', en: 'Who is this profile for?' },
  profileSelf: { zh: '只为我自己', en: 'Just for me' },
  profileChild: { zh: '为我的孩子', en: 'For my child' },
  profileChildSub: { zh: '12岁以下', en: 'Under 12 years old' },
  profileFamily: { zh: '为我的家人', en: 'For my family' },
  profileFamilySub: { zh: '我会管理多人档案', en: "I'll manage multiple profiles" },
  profileCaregiver: { zh: '我是照护者', en: "I'm a caregiver" },
  profileCaregiverSub: { zh: '家属、护工、医生或药剂师', en: 'Family, care aide, doctor, or pharmacist' },
  next: { zh: '下一步', en: 'Next' },

  // Screen 3
  restrictionTitle: { zh: '你现在最想管理的是？', en: 'What would you like to manage first?' },
  restrictionSubtitle: { zh: '这帮助我们调整提醒和报告重点', en: 'This helps us focus reminders and reports' },
  restrictionAllergy: { zh: '按时用药', en: 'Medication timing' },
  restrictionAllergySub: { zh: '减少漏服和延迟', en: 'Reduce missed or delayed doses' },
  restrictionIntolerance: { zh: '症状波动', en: 'Symptom fluctuations' },
  restrictionIntoleranceSub: { zh: '记录震颤、僵硬、异动症等变化', en: 'Track tremor, rigidity, dyskinesia, and more' },
  restrictionPreference: { zh: '照护协同', en: 'Care coordination' },
  restrictionPreferenceSub: { zh: '患者和家人共同维护信息', en: 'Patient and family maintain information together' },
  restrictionUnsure: { zh: '我不确定', en: "I'm not sure" },
  restrictionUnsureSub: { zh: '先填一下，之后可随时修改', en: 'Fill in now, change anytime' },

  // Screen 4
  avoidTitle: { zh: '你想重点记录哪些症状？', en: 'Which symptoms should we track first?' },
  avoidSubtitle: { zh: '可多选，之后随时修改', en: 'Select multiple. Change anytime.' },
  skipText: { zh: '没有以上任何一种？点击跳过', en: "None of the above? Tap to skip" },

  // Screen 4B
  dietPrefTitle: { zh: '你希望报告重点包含什么？', en: 'What should reports focus on?' },
  dietPrefSubtitle: { zh: '可多选，之后随时修改', en: 'Select multiple. Change anytime.' },

  // Screen 5
  severityTitle: { zh: '这些症状通常有多严重？', en: 'How severe are these symptoms usually?' },
  severitySubtitle: { zh: '这影响报告中的提示优先级', en: 'This affects report priority' },
  setAllSevere: { zh: '全部设为严重 ⚡', en: 'Set all severe ⚡' },
  mild: { zh: '轻微', en: 'Mild' },
  mildDesc: { zh: '轻微影响日常活动', en: 'Mild impact on daily activity' },
  moderate: { zh: '中度', en: 'Moderate' },
  moderateDesc: { zh: '需要家属关注或记录', en: 'Needs caregiver attention or logging' },
  severe: { zh: '严重 ⚡', en: 'Severe ⚡' },
  severeDesc: { zh: '需要尽快与医生讨论', en: 'Discuss with doctor promptly' },

  // Screen 6
  reportTitle: { zh: '有处方或药盒照片？', en: 'Have a prescription or medicine box photo?' },
  reportSubtitle: { zh: 'AI 可以辅助读取药名、剂量和服药时间', en: 'AI can help read medication names, doses, and times' },
  reportCardTitle: { zh: '你可以在「扫码录入」中上传处方或药盒', en: 'Upload prescriptions or medicine boxes in "Scan Rx"' },
  reportCardDesc: { zh: '拍摄处方或药盒，AI 会辅助识别用药计划，保存前仍需人工确认', en: 'Scan a prescription or medicine box. AI assists recognition, and you confirm before saving.' },
  reportPrivacy: { zh: '🔒 上传的图片仅在你的设备本地处理，不会上传至任何服务器', en: '🔒 Uploaded images are processed locally on your device only.' },
  scanLabel: { zh: '扫描', en: 'Scan' },
  gotIt: { zh: '我知道了，继续', en: 'Got it' },

  // Screen 7
  lastStepTitle: { zh: 'One last step!', en: 'One last step!' },
  lastStepSubtitle: { zh: '记录后，我们会把信息整理成就诊摘要', en: 'After logging, we organize information into visit summaries' },
  scanHint: { zh: '摘要会包含 3 类信息：', en: 'Summaries include 3 types of information:' },
  canEat: { zh: '按时用药', en: 'Medication timing' },
  limitThis: { zh: '症状波动', en: 'Symptom changes' },
  avoid: { zh: '照护负担', en: 'Care burden' },
  whatDoTheyMean: { zh: '这些摘要有什么作用？', en: 'How do these summaries help?' },

  // Screen 8
  profileReady: { zh: 'Your profile is ready!', en: 'Your profile is ready!' },
  check1: { zh: '正在建立用药提醒时间轴', en: 'Building your medication timeline' },
  check2: { zh: '正在准备症状和照护记录', en: 'Preparing symptom and care logs' },
  check3: { zh: '正在设置就诊信息摘要', en: 'Setting up visit summaries' },
  continueBtn: { zh: 'Continue', en: 'Continue' },
} as const;

export type TranslationKey = keyof typeof translations;

export interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key) => translations[key]?.zh || key,
});

export const useI18n = () => useContext(I18nContext);
