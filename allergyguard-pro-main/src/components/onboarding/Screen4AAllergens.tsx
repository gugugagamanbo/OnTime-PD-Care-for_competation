import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import OnboardingShell from './OnboardingShell';
import CtaButton from './CtaButton';

interface Props {
  onNext: (allergens: string[]) => void;
  onBack: () => void;
}

const allergens = [
  { id: 'peanut', emoji: '🥜', zh: '花生', en: 'Peanut' },
  { id: 'treenut', emoji: '🌰', zh: '坚果', en: 'Tree Nut' },
  { id: 'milk', emoji: '🥛', zh: '牛奶', en: 'Milk' },
  { id: 'egg', emoji: '🥚', zh: '鸡蛋', en: 'Egg' },
  { id: 'gluten', emoji: '🌾', zh: '麸质', en: 'Gluten' },
  { id: 'soy', emoji: '🫘', zh: '大豆', en: 'Soy' },
  { id: 'fish', emoji: '🐟', zh: '鱼类', en: 'Fish' },
  { id: 'shellfish', emoji: '🦐', zh: '贝类', en: 'Shellfish' },
  { id: 'sesame', emoji: '🌿', zh: '芝麻', en: 'Sesame' },
];

const extraAllergens = [
  { id: 'corn', emoji: '🌽', zh: '玉米', en: 'Corn' },
  { id: 'stonefruit', emoji: '🍑', zh: '核果类', en: 'Stone Fruit' },
  { id: 'custom', emoji: '➕', zh: '自定义添加', en: 'Custom' },
];

const Screen4AAllergens: React.FC<Props> = ({ onNext, onBack }) => {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <OnboardingShell bgColor="#DCEDC8" step={4} progressColor="#66BB6A" onBack={onBack}>
      <div className="pt-4">
        <h1 className="font-heading font-bold text-[26px] leading-tight" style={{ color: '#1A1A1A' }}>
          {t('avoidTitle')}
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          {t('avoidSubtitle')}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {allergens.map(a => {
          const isSelected = selected.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className="flex flex-col items-center py-3 px-2 rounded-xl border-[1.5px] transition-all"
              style={{
                backgroundColor: isSelected ? '#FFF0F0' : 'white',
                borderColor: isSelected ? '#E63946' : '#E0E0E0',
              }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span
                className="text-[11px] font-bold mt-1"
                style={{ color: isSelected ? '#E63946' : '#1A1A1A' }}
              >
                {lang === 'zh' ? a.zh : a.en}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {extraAllergens.map(a => {
          const isSelected = selected.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className="flex items-center gap-1 px-3 py-2 rounded-full border text-xs whitespace-nowrap shrink-0 transition-all"
              style={{
                backgroundColor: isSelected ? '#FFF0F0' : 'white',
                borderColor: isSelected ? '#E63946' : '#E0E0E0',
                color: isSelected ? '#E63946' : '#1A1A1A',
              }}
            >
              <span>{a.emoji}</span>
              <span className="font-bold">{lang === 'zh' ? a.zh : a.en}</span>
            </button>
          );
        })}
      </div>

      <p
        className="text-xs text-center mt-4 cursor-pointer underline"
        style={{ color: '#6B7280' }}
        onClick={() => onNext([])}
      >
        {t('skipText')}
      </p>

      <div className="flex-1" />

      <CtaButton
        label={t('next')}
        onClick={() => onNext(selected)}
        color="#66BB6A"
        disabled={selected.length === 0}
      />
    </OnboardingShell>
  );
};

export default Screen4AAllergens;
