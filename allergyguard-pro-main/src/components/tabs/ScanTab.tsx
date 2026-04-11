import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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

// Mock family members — in a real app these would come from shared state
interface FamilyMember {
  id: number;
  name: string;
  allergies: AllergenKey[];
}

const mockFamilyMembers: FamilyMember[] = [
  { id: 1, name: 'Alex Jr.', allergies: ['allergy.egg', 'allergy.dairy'] },
];

const results = [
  { dot: 'bg-green-500', name: 'scan.oatmilk' as const, detail: 'scan.oatmilk.detail' as const, badge: 'scan.safe' as const, badgeColor: 'text-green-600' },
  { dot: 'bg-yellow-400', name: 'scan.granola' as const, detail: 'scan.granola.detail' as const, badge: 'scan.caution' as const, badgeColor: 'text-yellow-600' },
  { dot: 'bg-red-500', name: 'scan.bread' as const, detail: 'scan.bread.detail' as const, badge: 'scan.danger' as const, badgeColor: 'text-red-600' },
];

const mockCurrentScan = {
  dot: 'bg-green-500',
  name: 'scan.oatmilk' as const,
  detail: 'scan.oatmilk.detail' as const,
  description: 'scan.oatmilk.description' as const,
  calories: 'scan.oatmilk.calories' as const,
  brand: 'scan.oatmilk.brand' as const,
  badge: 'scan.safe' as const,
  badgeColor: 'text-green-600',
  badgeBg: 'bg-green-50 border-green-200',
  // Allergens present in this product
  containsAllergens: [] as AllergenKey[],
  ingredients: ['scan.ingredient.oat' as const, 'scan.ingredient.water' as const, 'scan.ingredient.salt' as const],
};

const ScanTab = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<'camera' | 'scanning' | 'analyzing' | 'results'>('camera');

  const handleCapture = () => {
    setView('scanning');
    setTimeout(() => setView('analyzing'), 1400);
    setTimeout(() => setView('results'), 2200);
  };

  // Compute family member risk for current scan
  const familyRisk = mockFamilyMembers.map(member => {
    const risky = member.allergies.filter(a => mockCurrentScan.containsAllergens.includes(a));
    return { member, risky, safe: risky.length === 0 };
  });

  const hasFamilyMembers = mockFamilyMembers.length > 0;

  if (view === 'results') {
    return (
      <div className="px-5 pt-6 pb-28 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('camera')} className="p-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('scan.results.title')}</h1>
        </div>

        {/* Current scan card — detailed */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">{t('scan.results.current')}</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${mockCurrentScan.dot} flex-shrink-0`} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t(mockCurrentScan.name)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t(mockCurrentScan.brand)}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${mockCurrentScan.badgeBg} ${mockCurrentScan.badgeColor}`}>
                {t(mockCurrentScan.badge)}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 mb-1.5">{t('scan.results.description')}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{t(mockCurrentScan.description)}</p>
              <p className="text-xs text-gray-400 mt-1.5">{t(mockCurrentScan.calories)}</p>
            </div>

            {/* Ingredients */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">{t('scan.results.ingredients')}</p>
              <div className="flex flex-wrap gap-2">
                {mockCurrentScan.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    {t(ing)}
                  </span>
                ))}
              </div>
            </div>

            {/* Family allergy section — only shown if family members exist */}
            {hasFamilyMembers && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">{t('scan.family.title')}</p>
                <div className="flex flex-wrap gap-2">
                  {familyRisk.map(({ member, safe, risky }) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                        safe
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${safe ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>{member.name}</span>
                      <span className="opacity-70">
                        {safe ? t('scan.family.safe') : t('scan.family.risk')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent scans */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">{t('scan.recent')}</h2>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className={`w-2.5 h-2.5 rounded-full ${r.dot} mr-3 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">{t(r.name)}</p>
                  <p className="text-xs text-gray-500">{t(r.detail)}</p>
                </div>
                <span className={`text-xs font-semibold ml-2 flex-shrink-0 ${r.badgeColor}`}>
                  {t(r.badge)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Analyzing overlay
  if (view === 'analyzing') {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black gap-4">
        <div className="w-10 h-10 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        <p className="text-white font-semibold text-base">{t('scan.analyzing')}</p>
        <p className="text-white/50 text-sm">{t('scan.analyzing.sub')}</p>
      </div>
    );
  }

  // Camera / scanning view
  return (
    <>
      <style>{`
        @keyframes scan-sweep {
          0%   { transform: translateY(0); opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(var(--box-height, 200px)); opacity: 0; }
        }
        .scan-line {
          animation: scan-sweep 1.2s ease-in infinite;
        }
      `}</style>
      <div className="fixed inset-0 z-40 flex flex-col bg-black">
        {/* Viewfinder */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Dimmed overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Scan box */}
          <div
            className="relative z-10 w-[calc(100%-48px)] max-w-[342px] aspect-[3/2] bg-transparent overflow-hidden"
            style={{ '--box-height': '200px' } as React.CSSProperties}
          >
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg" />

            {/* Animated scan line — only during 'scanning' state */}
            {view === 'scanning' && (
              <div className="scan-line absolute left-2 right-2 top-0 h-0.5 bg-white/70 shadow-[0_0_8px_2px_rgba(255,255,255,0.4)]" />
            )}
          </div>

          {/* Hint text */}
          <p className="absolute bottom-[calc(50%-70px)] left-0 right-0 text-center text-white/70 text-xs mt-4 translate-y-[calc(100%+100px)]">
            {view === 'scanning' ? (t('scan.analyzing') ) : '将条形码置于框内'}
          </p>

          {/* Flash overlay on capture */}
          {view === 'scanning' && (
            <div className="absolute inset-0 bg-white/10 z-20" />
          )}
        </div>

        {/* Shutter button */}
        <div className="pb-24 pt-6 flex items-center justify-center bg-black">
          <button
            onClick={handleCapture}
            disabled={view === 'scanning'}
            className="w-16 h-16 rounded-full border-[3px] border-white/80 flex items-center justify-center transition-transform active:scale-90"
          >
            <div className={`w-[52px] h-[52px] rounded-full bg-white transition-opacity ${view === 'scanning' ? 'opacity-40' : 'opacity-100'}`} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ScanTab;
