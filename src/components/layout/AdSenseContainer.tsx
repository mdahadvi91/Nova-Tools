import React from 'react';
import { Info } from 'lucide-react';

interface AdSenseContainerProps {
  slotId?: string;
  format?: 'horizontal-banner' | 'rectangle';
  className?: string;
}

export const AdSenseContainer: React.FC<AdSenseContainerProps> = ({
  format = 'horizontal-banner',
  className = '',
}) => {
  return (
    <div
      className={`my-8 p-4 rounded-2xl liquid-glass-subtle border border-dashed border-slate-300 dark:border-slate-700/70 text-center transition-all ${className}`}
      role="region"
      aria-label="Advertisement Area"
    >
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
        <Info className="w-3 h-3" />
        <span>Advertisement</span>
      </div>

      <div
        className={`mx-auto flex flex-col items-center justify-center rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 text-xs py-8 px-4 ${
          format === 'horizontal-banner' ? 'max-w-3xl min-h-[90px]' : 'max-w-sm min-h-[250px]'
        }`}
      >
        <p className="font-medium text-slate-500 dark:text-slate-400 mb-1">
          Google AdSense Compliant Banner Slot
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md">
          Non-intrusive advertising space separated distinctly from utility inputs, downloads, and interactive buttons.
        </p>
      </div>
    </div>
  );
};
