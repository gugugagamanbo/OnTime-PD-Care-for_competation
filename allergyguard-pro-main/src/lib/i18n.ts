import { createContext, useContext } from 'react';

export type Language = 'zh' | 'en';

export const translations = {
  // Screen 0
  appName: { zh: 'AllergyGuard', en: 'AllergyGuard' },
  tagline: { zh: '知道你吃的。吃得无忧。', en: 'Know what you eat. Eat without fear.' },
  getCode: { zh: '获取验证码', en: 'Get Code' },
  resendIn: { zh: '秒后重新发送', en: 'Resend in' },
  login: { zh: '登录', en: 'Continue' },
  loginDisclaimer: { zh: '登录即代表你同意我们的隐私政策与服务条款', en: 'By logging in you agree to our Privacy Policy & Terms of Service' },

  // Screen 1
  welcomeTitle: { zh: '你好！先告诉我们一些关于你的事', en: "Hi! Tell us a bit about yourself" },
  welcomeSubtitle: { zh: '只需 1 分钟，我们为你建立专属饮食档案', en: 'Just 1 minute to build your personalized diet profile' },
  welcomeValue1: { zh: '扫描食品时获得个人专属安全结果', en: 'Get personalized safety results when scanning food' },
  welcomeValue2: { zh: '聚餐时自动匹配所有人的饮食需求', en: 'Auto-match dietary needs when dining together' },
  welcomeValue3: { zh: '连接有相同经历的饮食社区', en: 'Connect with your dietary community' },
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
  profileCaregiverSub: { zh: '护士、营养师或家庭照护', en: 'Nurse, dietitian, or home care' },
  next: { zh: '下一步', en: 'Next' },

  // Screen 3
  restrictionTitle: { zh: '你的饮食限制主要是？', en: 'What type of dietary restriction?' },
  restrictionSubtitle: { zh: '这帮助我们调整提醒的敏感程度', en: 'This helps us calibrate alert sensitivity' },
  restrictionAllergy: { zh: '经医生确诊的食物过敏', en: 'Doctor-diagnosed food allergy' },
  restrictionAllergySub: { zh: '可能引发严重反应', en: 'May cause severe reactions' },
  restrictionIntolerance: { zh: '食物不耐受', en: 'Food intolerance' },
  restrictionIntoleranceSub: { zh: '吃了会不舒服，但非过敏反应', en: 'Causes discomfort, not an allergic reaction' },
  restrictionPreference: { zh: '饮食偏好 / 宗教饮食', en: 'Diet preference / Religious diet' },
  restrictionPreferenceSub: { zh: '如纯素、清真、犹太洁食', en: 'e.g. Vegan, Halal, Kosher' },
  restrictionUnsure: { zh: '我不确定', en: "I'm not sure" },
  restrictionUnsureSub: { zh: '先填一下，之后可随时修改', en: 'Fill in now, change anytime' },

  // Screen 4
  avoidTitle: { zh: '你需要避免哪些食物？', en: 'Which foods do you need to avoid?' },
  avoidSubtitle: { zh: '可多选，之后随时修改', en: 'Select multiple. Change anytime.' },
  skipText: { zh: '没有以上任何一种？点击跳过', en: "None of the above? Tap to skip" },

  // Screen 4B
  dietPrefTitle: { zh: '你的饮食偏好是？', en: 'What are your diet preferences?' },
  dietPrefSubtitle: { zh: '可多选，之后随时修改', en: 'Select multiple. Change anytime.' },

  // Screen 5
  severityTitle: { zh: '每种食物对你有多危险？', en: 'How dangerous is each food to you?' },
  severitySubtitle: { zh: '这影响扫描时我们给你的提醒强度', en: 'This affects alert intensity when scanning' },
  setAllSevere: { zh: '全部设为严重 ⚡', en: 'Set all severe ⚡' },
  mild: { zh: '轻微', en: 'Mild' },
  mildDesc: { zh: '吃了不适，无需就医', en: 'Discomfort, no medical help needed' },
  moderate: { zh: '中度', en: 'Moderate' },
  moderateDesc: { zh: '需要服药处理', en: 'Needs medication' },
  severe: { zh: '严重 ⚡', en: 'Severe ⚡' },
  severeDesc: { zh: '可能危及生命，携带 EpiPen', en: 'Life-threatening, carry EpiPen' },

  // Screen 6
  reportTitle: { zh: '有过敏检测报告？', en: 'Have an allergy test report?' },
  reportSubtitle: { zh: 'AI 可以自动读取你的病历，精准建立档案', en: 'AI can auto-read your medical records to build an accurate profile' },
  reportCardTitle: { zh: '你可以在「扫描」Tab 中进行病历信息上传', en: 'Upload medical records in the "Scan" tab' },
  reportCardDesc: { zh: '拍摄或上传过敏检测报告，AI 会自动识别过敏原，无需手动输入', en: 'Take a photo or upload your allergy report. AI will auto-detect allergens.' },
  reportPrivacy: { zh: '🔒 上传的图片仅在你的设备本地处理，不会上传至任何服务器', en: '🔒 Uploaded images are processed locally on your device only.' },
  scanLabel: { zh: '扫描', en: 'Scan' },
  gotIt: { zh: '我知道了，继续', en: 'Got it' },

  // Screen 7
  lastStepTitle: { zh: 'One last step!', en: 'One last step!' },
  lastStepSubtitle: { zh: '扫描食品时，我们用 3 种结果告诉你能不能吃', en: 'When scanning food, we use 3 results to tell you if it\'s safe' },
  scanHint: { zh: '扫描后你会看到 3 种图标：', en: 'After scanning you\'ll see 3 icons:' },
  canEat: { zh: '可以吃', en: 'Can eat' },
  limitThis: { zh: '注意限量', en: 'Limit this' },
  avoid: { zh: '避免', en: 'Avoid' },
  whatDoTheyMean: { zh: '这些评级是什么意思？', en: 'What do these ratings mean?' },

  // Screen 8
  profileReady: { zh: 'Your profile is ready!', en: 'Your profile is ready!' },
  check1: { zh: 'Personalizing your food safety scanner', en: 'Personalizing your food safety scanner' },
  check2: { zh: 'Matching your profile with 1M+ products', en: 'Matching your profile with 1M+ products' },
  check3: { zh: 'Connecting you with your allergy community', en: 'Connecting you with your allergy community' },
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
