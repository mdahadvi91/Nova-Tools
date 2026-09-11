import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOOLS } from '../../data/tools';
import { ToolDefinition } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { getLocalizedToolName, getLocalizedToolDesc } from '../../i18n/translations';
import { getToolUrl } from '../../lib/routes';
import { trackSearch } from '../../lib/analytics';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, navigateToTool, t, language } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search event tracking
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;
    const timer = setTimeout(() => {
      trackSearch(query, filteredTools.length);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredTools = normalizedQuery
    ? TOOLS.filter((tool: ToolDefinition) => {
        const locName = getLocalizedToolName(tool.id, tool.name, language).toLowerCase();
        const locDesc = getLocalizedToolDesc(tool.id, tool.description, language).toLowerCase();
        const nameMatch = tool.name.toLowerCase().includes(normalizedQuery) || locName.includes(normalizedQuery);
        const aliasMatch = tool.aliases.some((a) => a.toLowerCase().includes(normalizedQuery));
        const keywordMatch = tool.keywords.some((k) => k.toLowerCase().includes(normalizedQuery));
        const categoryMatch = tool.category.toLowerCase().includes(normalizedQuery);
        const descMatch = tool.description.toLowerCase().includes(normalizedQuery) || locDesc.includes(normalizedQuery);
        return nameMatch || aliasMatch || keywordMatch || categoryMatch || descMatch;
      })
    : TOOLS.slice(0, 8); // Display first 8 popular by default

  const handleSelectTool = (toolId: string) => {
    setSearchOpen(false);
    navigateToTool(toolId);
  };

  return (
    <div
      id="nova-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setSearchOpen(false)}
    >
      <div
        id="nova-search-modal-content"
        className="relative w-full max-w-2xl rounded-2xl liquid-glass border border-white/60 dark:border-slate-700 shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-700/80">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mr-3 rtl:mr-0 rtl:ml-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
            aria-label="Search tools"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="ml-2 px-2 py-1 text-xs rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              {!normalizedQuery && (
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.popularTools}
                </div>
              )}
              {filteredTools.map((tool) => {
                const locName = getLocalizedToolName(tool.id, tool.name, language);
                const locDesc = getLocalizedToolDesc(tool.id, tool.description, language);
                const catLabel = t.categories[tool.category as keyof typeof t.categories] || tool.category;

                return (
                  <a
                    key={tool.id}
                    href={getToolUrl(tool.id)}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                        e.preventDefault();
                        handleSelectTool(tool.id);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-left rtl:text-right hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <IconRenderer iconName={tool.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {locName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {locDesc}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {catLabel}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 rtl:rotate-180" />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-sm">{t.noResultsFound}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
