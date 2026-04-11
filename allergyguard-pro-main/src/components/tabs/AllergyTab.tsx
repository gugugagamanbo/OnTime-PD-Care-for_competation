import { useState } from 'react';
import { Camera, Search, X, Check, FileText } from 'lucide-react';
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

const commonAllergens: AllergenKey[] = [
  'allergy.peanut', 'allergy.dairy', 'allergy.gluten', 'allergy.egg',
  'allergy.treenut', 'allergy.soy', 'allergy.shellfish', 'allergy.fish',
  'allergy.sesame', 'allergy.wheat', 'allergy.celery', 'allergy.mustard',
  'allergy.lupin', 'allergy.molluscs', 'allergy.sulphites',
];

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

type SeverityKey = 'severity.severe' | 'severity.moderate' | 'severity.mild';

const severityCycle: SeverityKey[] = ['severity.severe', 'severity.moderate', 'severity.mild'];

const severityConfig: Record<SeverityKey, { dot: string; ring: string }> = {
  'severity.severe': { dot: 'bg-red-500', ring: 'ring-red-300' },
  'severity.moderate': { dot: 'bg-yellow-400', ring: 'ring-yellow-300' },
  'severity.mild': { dot: 'bg-green-500', ring: 'ring-green-300' },
};

// Mock allergens detected from report (different from already-selected ones)
const mockDetected: AllergenKey[] = ['allergy.shellfish', 'allergy.sesame', 'allergy.egg'];

const AllergyTab = () => {
  const { t } = useLanguage();

  const [selected, setSelected] = useState<Set<AllergenKey>>(
    new Set(['allergy.peanut', 'allergy.dairy', 'allergy.gluten'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Per-allergen severity (editable)
  const [severityState, setSeverityState] = useState<Record<string, SeverityKey>>({
    'allergy.peanut': 'severity.severe',
    'allergy.dairy': 'severity.moderate',
    'allergy.gluten': 'severity.mild',
  });

  // Upload demo state machine
  const [uploadState, setUploadState] = useState<'idle' | 'analyzing' | 'done'>('idle');

  const cycleSeverity = (key: AllergenKey) => {
    setSeverityState(prev => {
      const current = prev[key] || 'severity.mild';
      const idx = severityCycle.indexOf(current);
      const next = severityCycle[(idx + 1) % 3];
      return { ...prev, [key]: next };
    });
  };

  const handleUpload = () => {
    setUploadState('analyzing');
    setTimeout(() => setUploadState('done'), 2000);
  };

  const applyDetected = () => {
    const next = new Set(selected);
    mockDetected.forEach(k => {
      next.add(k);
      if (!severityState[k]) {
        setSeverityState(prev => ({ ...prev, [k]: 'severity.moderate' }));
      }
    });
    setSelected(next);
    setUploadState('idle');
  };

  const toggle = (key: AllergenKey) => {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
      setSeverityState(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } else {
      next.add(key);
      if (!severityState[key]) {
        setSeverityState(prev => ({ ...prev, [key]: 'severity.mild' }));
      }
    }
    setSelected(next);
  };

  const searchResults = searchQuery.trim()
    ? allAllergens.filter(k => t(k).toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const severityItems = Array.from(selected);

  return (
    <div className="px-5 pt-6 pb-28 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('allergy.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('allergy.subtitle')}</p>
      </div>

      {/* Upload card — prominent dashed border with icon box */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-white shadow-sm">
        {uploadState === 'idle' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
              <FileText size={22} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">{t('allergy.upload.title')}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{t('allergy.upload.subtitle')}</p>
              <button
                onClick={handleUpload}
                className="mt-3 border-2 border-gray-400 rounded-lg px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                {t('allergy.upload.button')}
              </button>
            </div>
          </div>
        )}

        {uploadState === 'analyzing' && (
          <div className="flex flex-col items-center py-5 gap-3">
            <div className="w-9 h-9 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-800">{t('allergy.upload.analyzing')}</p>
            <p className="text-xs text-gray-400">{t('allergy.upload.analyzing.sub')}</p>
          </div>
        )}

        {uploadState === 'done' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{t('allergy.upload.found')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockDetected.map(k => (
                <span key={k} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                  {t(k)}
                </span>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={applyDetected}
                className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold"
              >
                {t('allergy.upload.accept')}
              </button>
              <button
                onClick={() => setUploadState('idle')}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500"
              >
                {t('allergy.upload.dismiss')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Common Allergens */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('allergy.common')}</h2>
        <div className="flex flex-wrap gap-2">
          {commonAllergens.map((key) => {
            const isSelected = selected.has(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  isSelected
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {isSelected && <span className="mr-1 text-red-500">×</span>}
                {t(key)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('allergy.search.placeholder')}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {searchQuery.trim() && (
          <div className="mt-2 border border-gray-200 rounded-xl bg-white overflow-hidden">
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">未找到相关过敏原</p>
            ) : (
              searchResults.map((key) => {
                const isSelected = selected.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-left border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-800">{t(key)}</span>
                    {isSelected ? (
                      <Check size={15} className="text-red-500 flex-shrink-0" />
                    ) : (
                      <span className="text-xs text-gray-400">添加</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Severity — title with inline legend, color icons only, clickable to cycle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">{t('allergy.severity')}</h2>
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
        {severityItems.length === 0 ? (
          <p className="text-sm text-gray-400 py-1">请先选择过敏原</p>
        ) : (
          <div className="space-y-2">
            {severityItems.map((key) => {
              const sev = severityState[key] || 'severity.mild';
              const conf = severityConfig[sev];
              return (
                <div key={key} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-gray-900">{t(key)}</span>
                  <button
                    onClick={() => cycleSeverity(key)}
                    className={`w-5 h-5 rounded-full ${conf.dot} ring-2 ${conf.ring} transition-all active:scale-90`}
                    title="点击切换严重程度"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllergyTab;
