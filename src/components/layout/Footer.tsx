import React from 'react';
import { Sparkles, Shield, Lock, EyeOff, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/tools';
import { Language } from '../../types';
import { getCategoryUrl, getLegalUrl } from '../../lib/routes';

export const Footer: React.FC = () => {
  const {
    navigateToHome,
    navigateToCategory,
    navigateToLegal,
    language,
    setLanguage,
    t,
  } = useApp();

  return (
    <footer
      id="nova-global-footer"
      className="mt-16 border-t border-white/10 liquid-glass text-slate-300 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToHome();
                }
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                NOVA <span className="text-emerald-400 font-medium">TOOLS</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.privacyNotice}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{t.clientSideBadge}</span>
            </div>
          </div>

          {/* Tool Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {t.categories.all}
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={getCategoryUrl(cat.id)}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                        e.preventDefault();
                        navigateToCategory(cat.id);
                      }
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                  >
                    {t.categories[cat.id as keyof typeof t.categories] || cat.id}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={getLegalUrl('privacy')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      navigateToLegal('privacy');
                    }
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                >
                  {t.nav.privacy}
                </a>
              </li>
              <li>
                <a
                  href={getLegalUrl('terms')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      navigateToLegal('terms');
                    }
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                >
                  {t.nav.terms}
                </a>
              </li>
              <li>
                <a
                  href={getLegalUrl('disclaimer')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      navigateToLegal('disclaimer');
                    }
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                >
                  {t.nav.disclaimer}
                </a>
              </li>
              <li>
                <a
                  href={getLegalUrl('about')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      navigateToLegal('about');
                    }
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                >
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a
                  href={getLegalUrl('contact')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      navigateToLegal('contact');
                    }
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                >
                  {t.nav.contact}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('nova:open-consent-modal'));
                    }
                  }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-emerald-400/90 font-medium text-start"
                >
                  Cookie & Consent Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Language & Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Language / ভাষা / لغة
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  language === 'en'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  language === 'bn'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  language === 'ar'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                العربية
              </button>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.footer.madeForWeb}</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclosures */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Nova Tools. {t.footer.rights}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors underline-offset-2 hover:underline"
            >
              XML Sitemap
            </a>
            <span>•</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors underline-offset-2 hover:underline"
            >
              robots.txt
            </a>
            <span>•</span>
            <span>Zero Third-Party Cookies</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
