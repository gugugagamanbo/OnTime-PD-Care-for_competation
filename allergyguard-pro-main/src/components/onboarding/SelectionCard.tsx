import React from 'react';

interface SelectionCardProps {
  emoji: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ emoji, title, subtitle, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 border-[1.5px]"
      style={{
        backgroundColor: selected ? '#F0FFF4' : 'white',
        borderColor: selected ? '#2D6A4F' : '#E0E0E0',
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{emoji}</span>
        <div>
          <div className="font-heading font-bold text-[15px]" style={{ color: '#1A1A1A' }}>{title}</div>
          {subtitle && <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{subtitle}</div>}
        </div>
      </div>
    </button>
  );
};

export default SelectionCard;
