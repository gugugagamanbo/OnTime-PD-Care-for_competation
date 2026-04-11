import React from 'react';

interface CtaButtonProps {
  label: string;
  onClick: () => void;
  color: string;
  textColor?: string;
  disabled?: boolean;
  delay?: number;
}

const CtaButton: React.FC<CtaButtonProps> = ({ label, onClick, color, textColor = '#1A1A1A', disabled = false, delay }) => {
  const [visible, setVisible] = React.useState(!delay);

  React.useEffect(() => {
    if (delay) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  if (!visible) return <div className="h-14" />;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 rounded-full font-heading font-bold text-base transition-all duration-300 disabled:opacity-40"
      style={{
        backgroundColor: disabled ? '#E0E0E0' : color,
        color: disabled ? '#9E9E9E' : textColor,
      }}
    >
      {label}
    </button>
  );
};

export default CtaButton;
