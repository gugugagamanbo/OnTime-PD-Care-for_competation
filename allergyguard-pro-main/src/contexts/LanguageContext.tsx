import React, { createContext, useContext, useState } from 'react';

type Lang = 'zh' | 'en';

const translations = {
  // Tab names
  'tab.allergy': { zh: '过敏', en: 'Allergy' },
  'tab.community': { zh: '社区', en: 'Community' },
  'tab.scan': { zh: '扫描', en: 'Scan' },
  'tab.profile': { zh: '我的', en: 'Profile' },

  // Allergy tab
  'allergy.title': { zh: '我的过敏源', en: 'My Allergies' },
  'allergy.subtitle': { zh: '设置你的个人过敏档案', en: 'Set up your personal allergy profile' },
  'allergy.upload.title': { zh: '上传医疗报告', en: 'Upload Medical Report' },
  'allergy.upload.subtitle': { zh: 'AI自动识别你的过敏检测结果', en: 'AI reads your allergy test results automatically' },
  'allergy.upload.button': { zh: '拍照 / 上传', en: 'Take Photo / Upload' },
  'allergy.upload.analyzing': { zh: 'AI 正在分析报告...', en: 'AI is analyzing your report...' },
  'allergy.upload.analyzing.sub': { zh: '请稍候，正在识别过敏原', en: 'Please wait, identifying allergens' },
  'allergy.upload.found': { zh: '已识别到过敏原，请确认', en: 'Allergens detected, please confirm' },
  'allergy.upload.accept': { zh: '应用到我的档案', en: 'Add to my profile' },
  'allergy.upload.dismiss': { zh: '忽略', en: 'Dismiss' },
  'allergy.common': { zh: '常见过敏原', en: 'Common Allergens' },
  'allergy.severity': { zh: '严重程度', en: 'Severity Level' },
  'allergy.search.placeholder': { zh: '搜索过敏原...', en: 'Search allergens...' },
  // Core 14 EU allergens + extras
  'allergy.peanut': { zh: '花生', en: 'Peanut' },
  'allergy.dairy': { zh: '乳制品', en: 'Dairy' },
  'allergy.gluten': { zh: '麸质', en: 'Gluten' },
  'allergy.egg': { zh: '鸡蛋', en: 'Egg' },
  'allergy.treenut': { zh: '坚果', en: 'Tree Nut' },
  'allergy.soy': { zh: '大豆', en: 'Soy' },
  'allergy.shellfish': { zh: '贝类', en: 'Shellfish' },
  'allergy.fish': { zh: '鱼类', en: 'Fish' },
  'allergy.sesame': { zh: '芝麻', en: 'Sesame' },
  'allergy.wheat': { zh: '小麦', en: 'Wheat' },
  'allergy.celery': { zh: '芹菜', en: 'Celery' },
  'allergy.mustard': { zh: '芥末', en: 'Mustard' },
  'allergy.lupin': { zh: '羽扇豆', en: 'Lupin' },
  'allergy.molluscs': { zh: '软体动物', en: 'Molluscs' },
  'allergy.sulphites': { zh: '亚硫酸盐', en: 'Sulphites' },
  'allergy.fruit': { zh: '水果', en: 'Fruit' },
  'allergy.spice': { zh: '香料', en: 'Spice' },
  'allergy.cocoa': { zh: '可可', en: 'Cocoa' },
  'allergy.corn': { zh: '玉米', en: 'Corn' },
  'allergy.mushroom': { zh: '蘑菇', en: 'Mushroom' },
  'allergy.garlic': { zh: '大蒜', en: 'Garlic' },
  'allergy.tomato': { zh: '番茄', en: 'Tomato' },
  'allergy.kiwi': { zh: '猕猴桃', en: 'Kiwi' },
  'allergy.beef': { zh: '牛肉', en: 'Beef' },
  'allergy.pork': { zh: '猪肉', en: 'Pork' },
  'allergy.alcohol': { zh: '酒精', en: 'Alcohol' },
  'allergy.caffeine': { zh: '咖啡因', en: 'Caffeine' },
  'allergy.avocado': { zh: '牛油果', en: 'Avocado' },
  'allergy.peach': { zh: '桃子', en: 'Peach' },
  'allergy.strawberry': { zh: '草莓', en: 'Strawberry' },
  'allergy.onion': { zh: '洋葱', en: 'Onion' },
  'allergy.yeast': { zh: '酵母', en: 'Yeast' },
  'allergy.latex': { zh: '乳胶', en: 'Latex' },
  'allergy.mango': { zh: '芒果', en: 'Mango' },
  'allergy.apple': { zh: '苹果', en: 'Apple' },
  'severity.mild': { zh: '轻度', en: 'Mild' },
  'severity.moderate': { zh: '中度', en: 'Moderate' },
  'severity.severe': { zh: '重度', en: 'Severe' },
  'severity.danger': { zh: '危险', en: 'Danger' },
  'severity.caution': { zh: '慎重', en: 'Caution' },
  'severity.safe': { zh: '安全', en: 'Safe' },

  // Community tab
  'community.title': { zh: '社区', en: 'Community' },
  'community.all': { zh: '全部', en: 'All' },
  'community.other': { zh: '其他', en: 'Other' },
  'community.cloudtable': { zh: '云餐桌', en: 'Cloud Table' },
  'community.cloudtable.subtitle': { zh: '和朋友聚餐？创建共享餐桌，让每个人都吃得安心。', en: 'Dining with friends? Create a shared table so everyone can eat safely.' },
  'community.cloudtable.button': { zh: '创建餐桌', en: 'Create Table' },
  'community.likes': { zh: '赞', en: 'likes' },
  'community.comments': { zh: '评论', en: 'comments' },
  'community.post.title': { zh: '发布帖子', en: 'New Post' },
  'community.post.placeholder': { zh: '分享你的过敏餐饮经验...', en: 'Share your allergy dining experience...' },
  'community.post.tag.placeholder': { zh: '输入标签，如：#花生过敏', en: 'Add tag, e.g. #PeanutAllergy' },
  'community.post.publish': { zh: '发布', en: 'Publish' },
  'community.post.cancel': { zh: '取消', en: 'Cancel' },
  'community.post.published': { zh: '帖子已发布！', en: 'Post published!' },

  // Scan tab
  'scan.title': { zh: '扫描食物', en: 'Scan Food' },
  'scan.subtitle': { zh: '扫描条形码或拍照识别成分', en: 'Scan a barcode or photo ingredients' },
  'scan.tap': { zh: '点击扫描条形码', en: 'Tap to scan barcode' },
  'scan.photo': { zh: '拍照', en: 'Photo' },
  'scan.search': { zh: '搜索', en: 'Search' },
  'scan.recent': { zh: '最近扫描', en: 'Recent Scans' },
  'scan.safe': { zh: '安全', en: 'SAFE' },
  'scan.caution': { zh: '注意', en: 'CAUTION' },
  'scan.danger': { zh: '危险', en: 'DANGER' },
  'scan.analyzing': { zh: '正在识别食物...', en: 'Analyzing food...' },
  'scan.analyzing.sub': { zh: '匹配成分与你的过敏档案', en: 'Matching ingredients with your allergy profile' },
  'scan.oatmilk': { zh: '燕麦奶 原味', en: 'Oat Milk Original' },
  'scan.oatmilk.detail': { zh: '未检测到过敏原', en: 'No allergens detected' },
  'scan.oatmilk.description': { zh: '纯植物来源燕麦饮品，无乳成分，适合乳糖不耐受人群。富含膳食纤维与维生素 B，口感顺滑，热量适中。', en: 'A plant-based oat drink with no dairy. Suitable for lactose intolerant individuals. Rich in dietary fiber and vitamin B with a smooth taste.' },
  'scan.oatmilk.calories': { zh: '热量约 46 千卡 / 100ml', en: 'Approx. 46 kcal per 100ml' },
  'scan.oatmilk.brand': { zh: '品牌：OatlyFarm · 净含量：1L', en: 'Brand: OatlyFarm · Net: 1L' },
  'scan.granola': { zh: '坚果燕麦棒', en: 'Granola Crunch Bar' },
  'scan.granola.detail': { zh: '可能含有坚果', en: 'May contain tree nuts' },
  'scan.bread': { zh: '经典面包', en: 'Classic Bread Loaf' },
  'scan.bread.detail': { zh: '含有：小麦、麸质', en: 'Contains: Wheat, Gluten' },
  'scan.results.title': { zh: '识别结果', en: 'Scan Results' },
  'scan.results.current': { zh: '当前扫描', en: 'Current Scan' },
  'scan.results.ingredients': { zh: '成分列表', en: 'Ingredients' },
  'scan.results.description': { zh: '食物介绍', en: 'Food Info' },
  'scan.ingredient.oat': { zh: '燕麦', en: 'Oat' },
  'scan.ingredient.water': { zh: '水', en: 'Water' },
  'scan.ingredient.salt': { zh: '盐', en: 'Salt' },
  'scan.family.title': { zh: '家人过敏提示', en: 'Family Allergy Alert' },
  'scan.family.safe': { zh: '无风险', en: 'No risk' },
  'scan.family.risk': { zh: '含过敏原', en: 'Contains allergen' },

  // Profile tab
  'profile.editProfile': { zh: '编辑资料', en: 'Edit Profile' },
  'profile.subtitle': { zh: '3种过敏 · 47次扫描 · 2024年加入', en: '3 allergies · 47 scans · Member since 2024' },
  'profile.allergyProfile': { zh: '我的过敏档案', en: 'My Allergy Profile' },
  'profile.editAllergies': { zh: '编辑过敏原', en: 'Edit Allergies' },
  'profile.family': { zh: '家庭档案', en: 'Family Profiles' },
  'profile.me': { zh: '我', en: 'Me' },
  'profile.add': { zh: '+ 添加成员', en: '+ Add Member' },
  'profile.activity': { zh: '我的活动', en: 'My Activity' },
  'profile.scans': { zh: '扫描', en: 'Scans' },
  'profile.posts': { zh: '帖子', en: 'Posts' },
  'profile.tables': { zh: '餐桌', en: 'Tables' },
  'profile.settings': { zh: '设置', en: 'Settings' },
  'profile.notifications': { zh: '通知', en: 'Notifications' },
  'profile.privacy': { zh: '隐私', en: 'Privacy' },
  'profile.export': { zh: '导出过敏卡', en: 'Export Allergy Card' },
  'profile.about': { zh: '关于与免责声明', en: 'About & Disclaimer' },
  'profile.language': { zh: '语言切换', en: 'Language' },
  'profile.tabAllergens': { zh: '过敏原', en: 'Allergens' },
  'profile.lang.zh': { zh: '中文', en: '中文' },
  'profile.lang.en': { zh: 'English', en: 'English' },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('zh');
  const t = (key: TranslationKey) => translations[key]?.[lang] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
