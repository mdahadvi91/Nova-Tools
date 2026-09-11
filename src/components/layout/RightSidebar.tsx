import React from 'react';
import {
  X,
  Globe,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  Star,
  FileCheck,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, Theme } from '../../types';
import { TOOLS } from '../../data/tools';

export const RightSidebar: React.FC = () => {
  const {
    rightSidebarOpen,
    closeAllSidebars,
    language,
    setLanguage,
    theme,
    setTheme,
    favorites,
    navigateToTool,
    navigateToLegal,
  } = useApp();

  if (!rightSidebarOpen) return null;

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default' },
    { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
    { code: 'ar', label: 'العربية', sub: 'Arabic (RTL)' },
  ];

  const themes: { code: Theme; label: string; icon: typeof Sun }[] = [
    { code: 'light', label: 'Light', icon: Sun },
    { code: 'dark', label: 'Dark', icon: Moon },
    { code: 'system', label: 'System', icon: Monitor },
  ];

  const favoriteTools = TOOLS.filter((tool) => favorites.includes(tool.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeAllSidebars}
        aria-hidden="true"
      />

      {/* Right Drawer */}
      <div className="relative w-80 sm:w-96 max-w-[90vw] h-full liquid-glass border-s border-white/10 shadow-2xl flex flex-col justify-between z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Preferences & Settings
            </h2>
            <p className="text-[11px] text-slate-400">
              Language, Theme & Configuration
            </p>
          </div>

          <button
            type="button"
            onClick={closeAllSidebars}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Right Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Language Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Language / ভাষা / اللغة</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    language === item.code
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-slate-400">
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Theme Mode
            </div>

            <div className="grid grid-cols-3 gap-2">
              {themes.map((item) => {
                const Icon = item.icon;
                const isCurrent = theme === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setTheme(item.code)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookmarked Favorites */}
          {favoriteTools.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Favorites ({favoriteTools.length})</span>
              </div>

              <div className="space-y-1">
                {favoriteTools.slice(0, 5).map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      navigateToTool(tool.id);
                      closeAllSidebars();
                    }}
                    className="w-full text-start px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span className="truncate">{tool.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Legal and Support */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Information & Support
            </div>

            <button
              type="button"
              onClick={() => {
                navigateToLegal('privacy');
                closeAllSidebars();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Policy</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigateToLegal('terms');
                closeAllSidebars();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terms of Service</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigateToLegal('contact');
                closeAllSidebars();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact & Feedback</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeAllSidebars();

                if (typeof window !== 'undefined') {
                  window.dispatchEvent(
                    new CustomEvent('nova:open-consent-modal')
                  );
                }
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-emerald-400/90 hover:text-emerald-300 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consent Preferences</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/10 bg-black/20 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
