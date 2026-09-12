import React, { useState } from 'react';
import {
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileCode,
  Lightbulb,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { ToolDefinition, FaqItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { IconRenderer } from './IconRenderer';
import { getLocalizedToolName, getLocalizedToolDesc } from '../../i18n/translations';
import { AdSenseBanner } from './AdSenseBanner';
import { getToolSeoContent } from '../../data/toolSeoContent';
import { getToolUrl, getCategoryUrl } from '../../lib/routes';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  howToUseSteps?: string[];
  helpfulInfo?: string;
  faqs?: FaqItem[];
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  children,
  howToUseSteps,
  helpfulInfo,
  faqs,
}) => {
  const { navigateToCategory, navigateToTool, t, language } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const localizedName = getLocalizedToolName(tool.id, tool.name, language);
  const localizedDesc = getLocalizedToolDesc(tool.id, tool.description, language);
  const categoryLabel = t.categories[tool.category as keyof typeof t.categories] || tool.category;

  // Retrieve rich, people-first SEO data for this tool
  const seoData = getToolSeoContent(tool.id, localizedName, localizedDesc, tool.category);

  // Use props if provided, otherwise fallback to handcrafted SEO dataset
  const activeSteps = howToUseSteps && howToUseSteps.length > 0 ? howToUseSteps : seoData.howToUse;
  const activeFaqs = faqs && faqs.length > 0 ? faqs : seoData.faqs;
  const activeFeatures = seoData.features;
  const activeUseCases = seoData.useCases;

  // Curate related tools: prioritize tool-specific related IDs, then category peers
  const relatedTools: ToolDefinition[] = (seoData.relatedToolIds.length > 0
    ? seoData.relatedToolIds.map((id) => TOOLS.find((tItem) => tItem.id === id)).filter(Boolean) as ToolDefinition[]
    : TOOLS.filter((tItem) => tItem.category === tool.category && tItem.id !== tool.id).slice(0, 4)
  ).slice(0, 4);

  // Popular tools for deep footer linking
  const popularTools = TOOLS.filter((tItem) => tItem.isPopular && tItem.id !== tool.id).slice(0, 6);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-3 sm:py-6 space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in">
      {/* 1. Top Bar: Back to Category + Crawlable Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
        <a
          href={getCategoryUrl(tool.category)}
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && e.button === 0) {
              e.preventDefault();
              navigateToCategory(tool.category);
            }
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl liquid-glass border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-xs sm:text-sm font-medium transition-colors"
          aria-label={`Back to ${categoryLabel}`}
        >
          <ArrowRight className="w-4 h-4 rotate-180 rtl:rotate-0" />
          <span>{categoryLabel}</span>
        </a>

        <Breadcrumbs
          items={[
            {
              label: categoryLabel,
              href: getCategoryUrl(tool.category),
              onClick: () => navigateToCategory(tool.category),
            },
            { label: localizedName },
          ]}
        />
      </div>

      {/* 2. Tool Header Title & Unique Introduction */}
      <header className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Client-Side • Private & Local</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            No Upload Required
          </span>
        </div>

        {/* Unique H1 */}
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <span className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 inline-flex flex-shrink-0">
            <IconRenderer iconName={tool.iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <span>{seoData.h1}</span>
        </h1>

        {/* Unique Introduction */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          {seoData.introduction}
        </p>
      </header>

      {/* 3. Primary Real Tool UI (Interactive Workspace) */}
      <section aria-label="Interactive Tool Workspace" className="rounded-2xl sm:rounded-3xl liquid-glass p-3 sm:p-6 md:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 transition-all">
        {children}
      </section>

      {/* AdSense Compliant Banner */}
      <AdSenseBanner slotId="tool-workspace-banner" />

      {/* 4. How to Use Step-by-Step */}
      <section className="rounded-2xl liquid-glass p-5 sm:p-7 space-y-4 border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>How to Use {localizedName}</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Step-by-step guide
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {activeSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Key Features */}
      {activeFeatures && activeFeatures.length > 0 && (
        <section className="rounded-2xl liquid-glass p-5 sm:p-7 space-y-4 border border-slate-200/80 dark:border-white/10">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Key Features & Capabilities</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {activeFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Supported Formats & Technical Specifications */}
      <section className="rounded-2xl liquid-glass p-5 sm:p-7 space-y-3 border border-slate-200/80 dark:border-white/10">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Supported Formats & Technical Standards</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {seoData.supportedFormats}
        </p>
        {helpfulInfo && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            {helpfulInfo}
          </div>
        )}
      </section>

      {/* 7. Privacy Explanation */}
      <section className="rounded-2xl liquid-glass p-5 sm:p-7 space-y-3 border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
          <Lock className="w-5 h-5" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            100% Client-Side Privacy Guarantee
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {seoData.privacyExplanation}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Zero Server Uploads
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Runs in Browser Memory (RAM)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            GDPR & CCPA Compliant
          </span>
        </div>
      </section>

      {/* 8. Use Cases */}
      {activeUseCases && activeUseCases.length > 0 && (
        <section className="rounded-2xl liquid-glass p-5 sm:p-7 space-y-4 border border-slate-200/80 dark:border-white/10">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Common Real-World Use Cases</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {activeUseCases.map((uc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5"
              >
                <h3 className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {uc.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Frequently Asked Questions (FAQ Accordion) */}
      <section className="rounded-2xl liquid-glass p-5 sm:p-7 space-y-4 border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeFaqs.length} answers
          </span>
        </div>
        <div className="divide-y divide-slate-200/80 dark:divide-white/10">
          {activeFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left rtl:text-right gap-4 group"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Related Tools (Internal Linking) */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Related Utilities in {categoryLabel}
            </h2>
            <a
              href={getCategoryUrl(tool.category)}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToCategory(tool.category);
                }
              }}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>View all {categoryLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rel) => {
              const relName = getLocalizedToolName(rel.id, rel.name, language);
              const relDesc = getLocalizedToolDesc(rel.id, rel.description, language);
              const relUrl = getToolUrl(rel.id);

              return (
                <a
                  key={rel.id}
                  href={relUrl}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      navigateToTool(rel.id);
                    }
                  }}
                  className="flex flex-col text-left rtl:text-right p-4 rounded-2xl liquid-glass-card hover:border-emerald-500/50 border border-slate-200/80 dark:border-white/10 transition-all hover:scale-[1.02] shadow-sm group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-500/30 transition-colors">
                    <IconRenderer iconName={rel.iconName} className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {relName}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-snug flex-1">
                    {relDesc}
                  </p>
                  <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                    <span>{t.launchTool}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 11. Deep Internal Linking Directory: Category Links + Popular Tools */}
      <section className="pt-6 border-t border-slate-200/80 dark:border-white/10 space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Explore All Utility Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={getCategoryUrl(cat.id)}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    navigateToCategory(cat.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                  cat.id === tool.category
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-100/90 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.categories[cat.id as keyof typeof t.categories] || cat.id}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Popular Free Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((pop) => (
              <a
                key={pop.id}
                href={getToolUrl(pop.id)}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    navigateToTool(pop.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100/90 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <IconRenderer iconName={pop.iconName} className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{getLocalizedToolName(pop.id, pop.name, language)}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
