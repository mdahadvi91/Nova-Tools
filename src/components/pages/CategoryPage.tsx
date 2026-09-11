import React, { useState } from 'react';
import { ArrowRight, Star, Search, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolCategory } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { getLocalizedToolName, getLocalizedToolDesc } from '../../i18n/translations';
import { AdSenseBanner } from '../common/AdSenseBanner';
import { getToolUrl } from '../../lib/routes';

interface CategoryPageProps {
  category: ToolCategory;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { navigateToHome, navigateToTool, favorites, toggleFavorite, t, language } = useApp();
  const [searchFilter, setSearchFilter] = useState('');

  const categoryDef = CATEGORIES.find((c) => c.id === category);
  const categoryTitle =
    t.categories[category as keyof typeof t.categories] ||
    categoryDef?.nameKey ||
    category;

  const workstationInfo = (t.workstations as any)[category] || null;

  const categoryTools = TOOLS.filter((tool) => {
    if (category === 'popular') return tool.isPopular;
    return tool.category === category;
  });

  const filteredTools = categoryTools.filter((tool) => {
    const locName = getLocalizedToolName(tool.id, tool.name, language).toLowerCase();
    const locDesc = getLocalizedToolDesc(tool.id, tool.description, language).toLowerCase();
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      locName.includes(q) ||
      locDesc.includes(q) ||
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        <button
          type="button"
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl liquid-glass border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-colors"
          aria-label={t.actions.back}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t.actions.back}</span>
        </button>

        <Breadcrumbs currentCategory={category} />
      </div>

      {/* Workstation Header Banner */}
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl liquid-glass border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shadow-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg">
            <IconRenderer iconName={categoryDef?.iconName || 'Grid'} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-0.5 sm:mb-1">
              {workstationInfo?.badge || t.categories[category as keyof typeof t.categories] || 'Workstation'}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {workstationInfo?.name || categoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 sm:mt-1 max-w-2xl">
              {workstationInfo?.description || `${categoryTools.length} ${t.workstationToolsCount}`}
            </p>
          </div>
        </div>

        {/* Quick Filter Input */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t.filterPlaceholder}
              className="w-full ps-9 pe-3 py-2 rounded-xl bg-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 border border-white/10"
            />
          </div>
        </div>
      </div>

      {/* Tools Grid - Responsive Mobile (1 col), Tablet (2 cols), Desktop (3 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {filteredTools.map((tool) => {
          const isFav = favorites.includes(tool.id);
          const localizedName = getLocalizedToolName(tool.id, tool.name, language);
          const localizedDesc = getLocalizedToolDesc(tool.id, tool.description, language);

          return (
            <a
              key={tool.id}
              href={getToolUrl(tool.id)}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToTool(tool.id);
                }
              }}
              className="group relative cursor-pointer p-4 sm:p-5 md:p-6 rounded-2xl liquid-glass-card border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3 sm:space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <IconRenderer iconName={tool.iconName} className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tool.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t.categories.popular}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFavorite(tool.id);
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {localizedName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed">
                    {localizedDesc}
                  </p>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <span>{t.launchTool}</span>
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-8 text-center rounded-2xl liquid-glass border border-white/10 text-slate-300">
          {t.noResultsFound}
        </div>
      )}

      {/* AdSense Compliant Banner */}
      <AdSenseBanner slotId="category-footer" />
    </div>
  );
};
