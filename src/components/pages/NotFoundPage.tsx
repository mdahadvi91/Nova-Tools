import React, { useEffect } from 'react';
import { AlertTriangle, Home, Search, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { IconRenderer } from '../common/IconRenderer';
import { updateSeo } from '../../lib/seo';

interface NotFoundPageProps {
  attemptedSlug?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ attemptedSlug }) => {
  const { navigateToHome, navigateToTool, navigateToCategory, setSearchOpen, t } = useApp();

  useEffect(() => {
    updateSeo({ is404: true });
  }, []);

  const popularTools = TOOLS.filter((t) => t.isPopular).slice(0, 6);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 md:py-16 px-4 space-y-8 animate-fade-in text-center">
      {/* 404 Badge & Graphic */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-xl mx-auto">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            Error 404 - Page Not Found
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            We couldn&apos;t find that tool or page
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            {attemptedSlug ? (
              <>
                The requested tool identifier <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-xs">{attemptedSlug}</code> does not exist or may have been renamed.
              </>
            ) : (
              'The link you clicked may be broken, or the page may have moved.'
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && e.button === 0) {
              e.preventDefault();
              navigateToHome();
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Back to All Tools</span>
        </a>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl liquid-glass border border-white/10 text-slate-200 hover:text-white text-sm font-semibold transition-all active:scale-95"
        >
          <Search className="w-4 h-4 text-emerald-400" />
          <span>Search 45+ Tools (Ctrl+K)</span>
        </button>
      </div>

      {/* Categories Directory */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Browse by Category
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/?category=${cat.id}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToCategory(cat.id);
                }
              }}
              className="px-3 py-1.5 rounded-xl liquid-glass border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              {cat.nameKey}
            </a>
          ))}
        </div>
      </div>

      {/* Popular Tools Recommendations */}
      <div className="pt-6 space-y-4 text-start">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Popular Privacy Tools</span>
          </div>
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateToHome();
              }
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            View all 45+ &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {popularTools.map((tool) => (
            <a
              key={tool.id}
              href={`/?tool=${tool.id}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToTool(tool.id);
                }
              }}
              className="p-4 rounded-2xl liquid-glass-card border border-white/10 hover:border-emerald-500/40 flex items-start gap-3 transition-all text-start group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <IconRenderer iconName={tool.iconName} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                  {tool.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {tool.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
