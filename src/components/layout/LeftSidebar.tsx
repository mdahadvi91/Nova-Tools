import React from 'react';
import {
  Home,
  QrCode,
  Image as ImageIcon,
  FileText,
  Briefcase,
  Wrench,
  Palette,
  Calculator,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ToolCategory } from '../../types';
import { TOOLS } from '../../data/tools';
import { getCategoryUrl } from '../../lib/routes';

interface WorkstationNavItem {
  id: ToolCategory;
  icon: React.FC<{ className?: string }>;
  gradient: string;
}

export const LeftSidebar: React.FC = () => {
  const {
    leftSidebarOpen,
    closeAllSidebars,
    navigateToHome,
    navigateToCategory,
    navState,
    t,
  } = useApp();

  if (!leftSidebarOpen) return null;

  const workstations: WorkstationNavItem[] = [
    {
      id: 'qr',
      icon: QrCode,
      gradient: 'from-emerald-500 to-teal-700',
    },
    {
      id: 'image',
      icon: ImageIcon,
      gradient: 'from-blue-500 to-indigo-700',
    },
    {
      id: 'pdf',
      icon: FileText,
      gradient: 'from-amber-500 to-orange-700',
    },
    {
      id: 'career',
      icon: Briefcase,
      gradient: 'from-violet-500 to-purple-800',
    },
    {
      id: 'utilities',
      icon: Wrench,
      gradient: 'from-teal-500 to-emerald-800',
    },
    {
      id: 'design',
      icon: Palette,
      gradient: 'from-rose-500 to-pink-700',
    },
    {
      id: 'calculators',
      icon: Calculator,
      gradient: 'from-cyan-500 to-blue-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-start animate-fade-in">
      {/* Backdrop: Clicking closes the left sidebar */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeAllSidebars}
        aria-hidden="true"
      />

      {/* Left Drawer Container */}
      <div className="relative w-80 sm:w-92 max-w-[85vw] h-full liquid-glass border-e border-white/10 shadow-2xl flex flex-col justify-between z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{t.allTools}</h2>
              <p className="text-[11px] text-slate-400">{t.clientSideBadge}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAllSidebars}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Left Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 custom-scrollbar">
          {/* Home Link */}
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateToHome();
                closeAllSidebars();
              }
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              navState.view === 'home'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                <Home className="w-4 h-4" />
              </div>
              <div className="text-start">
                <div className="text-sm font-semibold">{t.nav.home}</div>
                <div className="text-[11px] text-slate-400">{t.popularTools}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
          </a>

          <div className="pt-3 pb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t.categories.all}
          </div>

          {workstations.map((ws) => {
            const Icon = ws.icon;
            const count = TOOLS.filter((t) => t.category === ws.id).length;
            const isActive = navState.view === 'category' && navState.category === ws.id;
            const wsInfo = (t.workstations as any)[ws.id];
            const wsName = wsInfo?.name || t.categories[ws.id as keyof typeof t.categories] || ws.id;

            return (
              <a
                key={ws.id}
                href={getCategoryUrl(ws.id)}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    navigateToCategory(ws.id);
                    closeAllSidebars();
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ws.gradient} flex items-center justify-center text-white shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-start">
                    <div className="text-xs sm:text-sm font-semibold">{wsName}</div>
                    <div className="text-[10px] text-slate-400">{count} {t.allTools.toLowerCase()}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
              </a>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-white/10 bg-black/20 text-center">
          <p className="text-[11px] text-slate-400">
            {t.privacyBadge}
          </p>
        </div>
      </div>
    </div>
  );
};
