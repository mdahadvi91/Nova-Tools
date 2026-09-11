import React from 'react';
import {
  QrCode,
  Image as ImageIcon,
  FileText,
  Briefcase,
  Wrench,
  Palette,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ToolCategory } from '../../types';
import { TOOLS } from '../../data/tools';
import { AdSenseBanner } from '../common/AdSenseBanner';
import { getCategoryUrl } from '../../lib/routes';

interface WorkstationConfig {
  id: ToolCategory;
  icon: React.FC<{ className?: string }>;
  gradient: string;
  borderHover: string;
}

const workstationConfigs: WorkstationConfig[] = [
  {
    id: 'qr',
    icon: QrCode,
    gradient: 'from-emerald-500 to-teal-700',
    borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
  },
  {
    id: 'image',
    icon: ImageIcon,
    gradient: 'from-blue-500 to-indigo-700',
    borderHover: 'hover:border-blue-500/60 hover:shadow-blue-500/20',
  },
  {
    id: 'pdf',
    icon: FileText,
    gradient: 'from-amber-500 to-orange-700',
    borderHover: 'hover:border-amber-500/60 hover:shadow-amber-500/20',
  },
  {
    id: 'career',
    icon: Briefcase,
    gradient: 'from-violet-500 to-purple-800',
    borderHover: 'hover:border-violet-500/60 hover:shadow-violet-500/20',
  },
  {
    id: 'utilities',
    icon: Wrench,
    gradient: 'from-teal-500 to-emerald-800',
    borderHover: 'hover:border-teal-500/60 hover:shadow-teal-500/20',
  },
  {
    id: 'design',
    icon: Palette,
    gradient: 'from-rose-500 to-pink-700',
    borderHover: 'hover:border-rose-500/60 hover:shadow-rose-500/20',
  },
  {
    id: 'calculators',
    icon: Calculator,
    gradient: 'from-cyan-500 to-blue-700',
    borderHover: 'hover:border-cyan-500/60 hover:shadow-cyan-500/20',
  },
];

export const HomePage: React.FC = () => {
  const { navigateToCategory, t } = useApp();

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-6 md:py-8 lg:py-10 space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in">
      {/* Top Title Section - Responsive Typography */}
      <div className="text-center space-y-2 sm:space-y-3 px-2 sm:px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full liquid-glass border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-semibold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.privacyBadge}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          {t.heroHeadline}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow px-2">
          {t.heroSubheadline}
        </p>
      </div>

      {/* Workstations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6 px-1 sm:px-0">
        {workstationConfigs.map((cfg) => {
          const Icon = cfg.icon;
          const wsInfo = (t.workstations as any)[cfg.id];
          const toolsCount = TOOLS.filter((t) => t.category === cfg.id).length;

          if (!wsInfo) return null;

          return (
            <a
              key={cfg.id}
              href={getCategoryUrl(cfg.id)}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToCategory(cfg.id);
                }
              }}
              className={`group relative cursor-pointer p-4 sm:p-5 md:p-6 lg:p-7 rounded-2xl liquid-glass-card flex flex-col justify-between transition-all duration-300 ${cfg.borderHover}`}
            >
              <div className="space-y-3.5 sm:space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-lg p-2.5 sm:p-3 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/10 text-emerald-300 border border-white/10 backdrop-blur-sm">
                    {toolsCount} {t.allTools.toLowerCase()}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {wsInfo.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {wsInfo.description}
                  </p>
                </div>

                {/* Popular tools preview list */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                    {t.popularTools}
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {wsInfo.popularFeatures.map((feat: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/5 text-slate-200 border border-white/5"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3.5 sm:pt-4 md:pt-5 mt-3 sm:mt-4 border-t border-white/10 flex items-center justify-between text-emerald-400 font-semibold text-xs sm:text-sm group-hover:text-emerald-300 transition-colors">
                <span>{t.launchTool}</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-180" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* AdSense Compliant Banner Slot */}
      <AdSenseBanner slotId="homepage-middle-slot" />

      {/* Subtle Trust Footer Note */}
      <div className="text-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.clientSideBadge}</span>
        </div>
      </div>
    </div>
  );
};
