import React from 'react';
import { Sparkles, Shield, Lock, CheckCircle2, ShieldCheck, Zap, Mail, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/tools';
import { getCategoryUrl, getLegalUrl } from '../../lib/routes';

export const Footer: React.FC = () => {
  const {
    navigateToHome,
    navigateToCategory,
    navigateToLegal,
    t,
  } = useApp();

  return (
    <footer
      id="nova-global-footer"
      className="mt-16 border-t border-slate-200/80 dark:border-white/10 liquid-glass text-slate-600 dark:text-slate-300 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* 1. Brand & Mission */}
          <div className="space-y-3">
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
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                NOVA <span className="text-emerald-600 dark:text-emerald-400 font-medium">TOOLS</span>
              </span>
            </a>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.footer.privacyNotice}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{t.clientSideBadge}</span>
            </div>
          </div>

          {/* 2. Tool Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
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

          {/* 3. Security & Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Security & Guarantee
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>100% In-Browser Execution</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Zero File Uploads to Cloud</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>High Performance Client RAM</span>
              </p>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{t.footer.madeForWeb}</span>
            </div>
          </div>

          {/* 4. Direct Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Direct Support
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Have questions, feedback, or tool ideas? Reach out directly to our engineering team:
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <a
                  href="mailto:vnai6050@gmail.com"
                  className="font-mono text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors break-all"
                >
                  vnai6050@gmail.com
                </a>
              </div>
              <a
                href="mailto:vnai6050@gmail.com?subject=Nova%20Tools%20User%20Inquiry"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Send Email via Gmail</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and Beautiful Legal & Trust Links */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400 text-center lg:text-left">
            © {new Date().getFullYear()} Nova Tools. {t.footer.rights}
          </p>

          <nav aria-label="Legal & Trust Links" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a
              href={getLegalUrl('privacy')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToLegal('privacy');
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
            <a
              href={getLegalUrl('terms')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToLegal('terms');
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Terms of Service
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
            <a
              href={getLegalUrl('disclaimer')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToLegal('disclaimer');
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Disclaimer
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
            <a
              href={getLegalUrl('about')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToLegal('about');
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              About Nova Tools
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
            <a
              href={getLegalUrl('contact')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateToLegal('contact');
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Contact Us
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('nova:open-consent-modal'));
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Cookie & Consent Preferences
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};
