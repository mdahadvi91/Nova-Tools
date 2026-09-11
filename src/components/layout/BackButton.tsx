import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BackButtonProps {
  fallbackLabel?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const { navigateBack, t } = useApp();

  return (
    <button
      id="nova-back-button"
      type="button"
      onClick={navigateBack}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 liquid-glass hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-200 hover:text-white active:scale-95 shadow-sm ${className}`}
      title="Back"
      aria-label="Back"
    >
      <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
      <span>Back</span>
    </button>
  );
};
