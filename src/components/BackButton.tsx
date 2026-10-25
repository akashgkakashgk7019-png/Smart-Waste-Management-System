import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface BackButtonProps {
  onClick?: () => void;
  setCurrentTab?: (tab: string) => void;
  fallbackTab?: string;
  label?: string;
  previousTabName?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  setCurrentTab,
  fallbackTab = 'home',
  label,
  previousTabName,
  className = ''
}) => {
  const { language } = useLanguage();

  const defaultLabel =
    language === 'kn'
      ? previousTabName
        ? `← ಹಿಂದಕ್ಕೆ (${previousTabName})`
        : '← ಹಿಂದಕ್ಕೆ'
      : language === 'hi'
      ? previousTabName
        ? `← वापस (${previousTabName})`
        : '← वापस'
      : previousTabName
      ? `← Back to ${previousTabName}`
      : '← Back';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (setCurrentTab) {
      setCurrentTab(fallbackTab);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back step by step"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer group ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-emerald-700 transition-transform group-hover:-translate-x-0.5" />
      <span>{label || defaultLabel}</span>
    </button>
  );
};
