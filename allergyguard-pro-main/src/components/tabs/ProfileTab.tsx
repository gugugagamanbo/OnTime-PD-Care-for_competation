import { useState } from 'react';
import { Settings, ChevronRight, ChevronLeft, X, Plus, Search, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type AllergenKey =
  | 'allergy.peanut' | 'allergy.dairy' | 'allergy.gluten' | 'allergy.egg'
  | 'allergy.treenut' | 'allergy.soy' | 'allergy.shellfish' | 'allergy.fish'
  | 'allergy.sesame' | 'allergy.wheat' | 'allergy.celery' | 'allergy.mustard'
  | 'allergy.lupin' | 'allergy.molluscs' | 'allergy.sulphites' | 'allergy.fruit'
  | 'allergy.spice' | 'allergy.cocoa' | 'allergy.corn' | 'allergy.mushroom'
  | 'allergy.garlic' | 'allergy.tomato' | 'allergy.kiwi' | 'allergy.beef'
  | 'allergy.pork' | 'allergy.alcohol' | 'allergy.caffeine' | 'allergy.avocado'
  | 'allergy.peach' | 'allergy.strawberry' | 'allergy.onion' | 'allergy.yeast'
  | 'allergy.latex' | 'allergy.mango' | 'allergy.apple';

type SeverityKey = 'severity.severe' | 'severity.moderate' | 'severity.mild';

const allAllergens: AllergenKey[] = [
  'allergy.peanut', 'allergy.dairy', 'allergy.gluten', 'allergy.egg',
  'allergy.treenut', 'allergy.soy', 'allergy.shellfish', 'allergy.fish',
  'allergy.sesame', 'allergy.wheat', 'allergy.celery', 'allergy.mustard',
  'allergy.lupin', 'allergy.molluscs', 'allergy.sulphites',
  'allergy.fruit', 'allergy.spice', 'allergy.cocoa', 'allergy.corn',
  'allergy.mushroom', 'allergy.garlic', 'allergy.tomato', 'allergy.kiwi',
  'allergy.beef', 'allergy.pork', 'allergy.alcohol', 'allergy.caffeine',
  'allergy.avocado', 'allergy.peach', 'allergy.strawberry', 'allergy.onion',
  'allergy.yeast', 'allergy.latex', 'allergy.mango', 'allergy.apple',
];

const severityCycle: SeverityKey[] = ['severity.severe', 'severity.moderate', 'severity.mild'];

const severityConfig: Record<SeverityKey, { dot: string; ring: string }> = {
  'severity.severe': { dot: 'bg-red-500', ring: 'ring-red-300' },
  'severity.moderate': { dot: 'bg-yellow-400', ring: 'ring-yellow-300' },
  'severity.mild': { dot: 'bg-green-500', ring: 'ring-green-300' },
};

// Default severity for initial allergens
const defaultSeverityMap: Partial<Record<AllergenKey, SeverityKey>> = {
  'allergy.peanut': 'severity.severe',
  'allergy.dairy': 'severity.moderate',
  'allergy.gluten': 'severity.mild',
};

interface FamilyMember {
  id: number;
  name: string;
  allergies: AllergenKey[];
  severityMap: Partial<Record<AllergenKey, SeverityKey>>;
}

const ProfileTab = () => {
  const { t, lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'allergens' | 'activity'>('allergens');
  const [showSettings, setShowSettings] = useState(false);

  // My allergies + per-allergen severity
  const [myAllergies, setMyAllergies] = useState<AllergenKey[]>([
    'allergy.peanut', 'allergy.dairy', 'allergy.gluten',
  ]);
  const [mySeverity, setMySeverity] = useState<Partial<Record<AllergenKey, SeverityKey>>>(defaultSeverityMap);
  const [editingAllergies, setEditingAllergies] = useState(false);
  const [allergySearch, setAllergySearch] = useState('');

  // Family members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 1, name: 'Alex Jr.', allergies: ['allergy.egg', 'allergy.dairy'], severityMap: { 'allergy.egg': 'severity.moderate', 'allergy.dairy': 'severity.mild' } },
  ]);
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const stats = [
    { value: '47', label: t('profile.scans') },
    { value: '12', label: t('profile.posts') },
    { value: '3', label: t('profile.tables') },
  ];

  const settings = [
    { icon: '🔔', label: t('profile.notifications') },
    { icon: '🔒', label: t('profile.privacy') },
    { icon: '📤', label: t('profile.export') },
    { icon: 'ℹ️', label: t('profile.about') },
  ];

  const cycleMySeverity = (key: AllergenKey) => {
    setMySeverity(prev => {
      const current = prev[key] || 'severity.mild';
      const idx = severityCycle.indexOf(current);
      const next = severityCycle[(idx + 1) % 3];
      return { ...prev, [key]: next };
    });
  };

  const removeMyAllergy = (key: AllergenKey) => {
    setMyAllergies(prev => prev.filter(k => k !== key));
    setMySeverity(prev => { const c = { ...prev }; delete c[key]; return c; });
  };

  const toggleMyAllergy = (key: AllergenKey) => {
    if (myAllergies.includes(key)) {
      removeMyAllergy(key);
    } else {
      setMyAllergies(prev => [...prev, key]);
      if (!mySeverity[key]) {
        setMySeverity(prev => ({ ...prev, [key]: 'severity.mild' }));
      }
    }
  };

  const allergySearchResults = allergySearch.trim()
    ? allAllergens.filter(k => t(k).toLowerCase().includes(allergySearch.toLowerCase()))
    : allAllergens.slice(0, 12);

  const addFamilyMember = () => {
    if (newMemberName.trim()) {
      setFamilyMembers(prev => [...prev, { id: Date.now(), name: newMemberName.trim(), allergies: [], severityMap: {} }]);
      setNewMemberName('');
      setShowAddMember(false);
    }
  };

  const removeFamilyMember = (id: number) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    if (activeMemberId === id) setActiveMemberId(null);
  };

  const toggleMemberAllergy = (memberId: number, key: AllergenKey) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const hasIt = m.allergies.includes(key);
      const newAllergies = hasIt ? m.allergies.filter(k => k !== key) : [...m.allergies, key];
      const newSev = hasIt
        ? (() => { const c = { ...m.severityMap }; delete c[key]; return c; })()
        : { ...m.severityMap, [key]: 'severity.mild' as SeverityKey };
      return { ...m, allergies: newAllergies, severityMap: newSev };
    }));
  };

  const cycleMemberSeverity = (memberId: number, key: AllergenKey) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const current = m.severityMap[key] || 'severity.mild';
      const idx = severityCycle.indexOf(current);
      const next = severityCycle[(idx + 1) % 3];
      return { ...m, severityMap: { ...m.severityMap, [key]: next } };
    }));
  };

  const activeMember = familyMembers.find(m => m.id === activeMemberId) || null;

  if (showSettings) {
    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(false)} className="p-1">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('profile.settings')}</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {settings.map((s, i) => (
            <button key={i} className="flex items-center justify-between w-full px-4 py-3.5 text-left">
              <div className="flex items-center gap-3">
                <span>{s.icon}</span>
                <span className="text-sm font-medium text-gray-900">{s.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center justify-between w-full px-4 py-3.5 text-left"
          >
            <div className="flex items-center gap-3">
              <span>🌐</span>
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

  if (editingAllergies) {
    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditingAllergies(false); setAllergySearch(''); }} className="p-1">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('profile.editAllergies')}</h1>
        </div>

        {myAllergies.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">已选过敏原</p>
            <div className="flex flex-wrap gap-2">
              {myAllergies.map(key => (
                <span
                  key={key}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                >
                  {t(key)}
                  <button onClick={() => removeMyAllergy(key)} className="ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="relative mb-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={allergySearch}
              onChange={e => setAllergySearch(e.target.value)}
              placeholder="搜索过敏原..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden max-h-72 overflow-y-auto">
            {allergySearchResults.map(key => {
              const isSelected = myAllergies.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleMyAllergy(key)}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-left border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-800">{t(key)}</span>
                  {isSelected
                    ? <Check size={15} className="text-red-500 flex-shrink-0" />
                    : <Plus size={15} className="text-gray-400 flex-shrink-0" />
                  }
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => { setEditingAllergies(false); setAllergySearch(''); }}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium"
        >
          完成
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-28 space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t('tab.profile')}</h1>
        <button onClick={() => setShowSettings(true)} className="p-1">
          <Settings size={22} className="text-gray-700" />
        </button>
      </div>

      {/* Account Hero */}
      <div className="flex flex-col items-center text-center">
        <div className="w-[72px] h-[72px] rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
          👤
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-3">Alex Chen</h2>
        <p className="text-xs text-gray-500 mt-1">{t('profile.subtitle')}</p>
        <button className="mt-2 text-xs border border-gray-200 rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-50">
          {t('profile.editProfile')}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('allergens')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'allergens' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {t('profile.tabAllergens')}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'activity' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {t('profile.activity')}
        </button>
      </div>

      {activeTab === 'allergens' ? (
        <div className="space-y-6">
          {/* Allergy Profile — same severity UI as AllergyTab */}
          <div>
            {/* Section header with legend */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">{t('profile.allergyProfile')}</h3>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block flex-shrink-0" />
                  <span className="text-xs text-gray-500">{t('severity.danger')}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block flex-shrink-0" />
                  <span className="text-xs text-gray-500">{t('severity.caution')}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block flex-shrink-0" />
                  <span className="text-xs text-gray-500">{t('severity.safe')}</span>
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2.5">
              {myAllergies.length === 0 ? (
                <p className="text-sm text-gray-400 py-1">暂未添加过敏原</p>
              ) : (
                myAllergies.map((key) => {
                  const sev = mySeverity[key] || 'severity.mild';
                  const conf = severityConfig[sev];
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{t(key)}</span>
                      <button
                        onClick={() => cycleMySeverity(key)}
                        className={`w-5 h-5 rounded-full ${conf.dot} ring-2 ${conf.ring} transition-all active:scale-90`}
                        title="点击切换严重程度"
                      />
                    </div>
                  );
                })
              )}
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => setEditingAllergies(true)}
                  className="text-sm text-gray-700 font-medium hover:text-gray-900"
                >
                  {t('profile.editAllergies')} →
                </button>
              </div>
            </div>
          </div>

          {/* Family Profiles */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">{t('profile.family')}</h3>

            {/* Member pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setActiveMemberId(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeMemberId === null
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {t('profile.me')}
              </button>
              {familyMembers.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMemberId(activeMemberId === m.id ? null : m.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeMemberId === m.id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {m.name}
                  {m.allergies.length > 0 && (
                    <span className="ml-1.5 text-xs opacity-60">{m.allergies.length}</span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setShowAddMember(true)}
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:border-gray-400"
              >
                + 添加
              </button>
            </div>

            {/* Add member form */}
            {showAddMember && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addFamilyMember()}
                  placeholder="输入成员姓名"
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
                <button onClick={addFamilyMember} className="px-3 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium">
                  添加
                </button>
                <button
                  onClick={() => { setShowAddMember(false); setNewMemberName(''); }}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500"
                >
                  取消
                </button>
              </div>
            )}

            {/* Active member detail — uses same severity dot UI */}
            {activeMember && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                {/* Member header with legend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">{activeMember.name} 的过敏原</span>
                    {/* Mini legend */}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                      <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFamilyMember(activeMember.id)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    删除成员
                  </button>
                </div>

                {/* Member's allergens with severity dots */}
                {activeMember.allergies.length === 0 ? (
                  <p className="text-sm text-gray-400">暂未添加过敏原</p>
                ) : (
                  <div className="space-y-2">
                    {activeMember.allergies.map(key => {
                      const sev = activeMember.severityMap[key] || 'severity.mild';
                      const conf = severityConfig[sev];
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMemberAllergy(activeMember.id, key)}
                              className="text-gray-300 hover:text-red-400 transition-colors"
                            >
                              <X size={13} />
                            </button>
                            <span className="text-sm text-gray-800">{t(key)}</span>
                          </div>
                          <button
                            onClick={() => cycleMemberSeverity(activeMember.id, key)}
                            className={`w-5 h-5 rounded-full ${conf.dot} ring-2 ${conf.ring} transition-all active:scale-90`}
                            title="点击切换严重程度"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick-add */}
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">快速添加</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allAllergens
                      .filter(k => !activeMember.allergies.includes(k))
                      .slice(0, 8)
                      .map(key => (
                        <button
                          key={key}
                          onClick={() => toggleMemberAllergy(activeMember.id, key)}
                          className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-400"
                        >
                          + {t(key)}
                        </button>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl py-3 text-center">
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
