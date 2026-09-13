import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Settings2, Check, Lock, BarChart3, Megaphone, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getStoredConsent,
  updateGoogleConsent,
  ConsentSettings,
  GA_MEASUREMENT_ID,
  ADSENSE_CLIENT_ID,
} from '../../lib/analytics';

export const CookieConsentBanner: React.FC = () => {
  const { language, navigateToLegal } = useApp();
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Modal custom state
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(true);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      // First-time user: show consent banner
      setBannerVisible(true);
    } else {
      setAnalyticsEnabled(existing.analytics);
      setAdvertisingEnabled(existing.advertising);
    }

    // Listen for manual trigger to open consent modal (e.g. from footer, sidebar, privacy page)
    const handleOpenModal = () => {
      const current = getStoredConsent();
      if (current) {
        setAnalyticsEnabled(current.analytics);
        setAdvertisingEnabled(current.advertising);
      }
      setModalOpen(true);
    };

    window.addEventListener('nova:open-consent-modal', handleOpenModal);
    return () => window.removeEventListener('nova:open-consent-modal', handleOpenModal);
  }, []);

  const handleAcceptAll = () => {
    const settings: ConsentSettings = {
      necessary: true,
      analytics: true,
      advertising: true,
      timestamp: new Date().toISOString(),
      version: 2,
    };
    updateGoogleConsent(settings);
    setAnalyticsEnabled(true);
    setAdvertisingEnabled(true);
    setBannerVisible(false);
    setModalOpen(false);
  };

  const handleRejectNonEssential = () => {
    const settings: ConsentSettings = {
      necessary: true,
      analytics: false,
      advertising: false,
      timestamp: new Date().toISOString(),
      version: 2,
    };
    updateGoogleConsent(settings);
    setAnalyticsEnabled(false);
    setAdvertisingEnabled(false);
    setBannerVisible(false);
    setModalOpen(false);
  };

  const handleSavePreferences = () => {
    const settings: ConsentSettings = {
      necessary: true,
      analytics: analyticsEnabled,
      advertising: advertisingEnabled,
      timestamp: new Date().toISOString(),
      version: 2,
    };
    updateGoogleConsent(settings);
    setBannerVisible(false);
    setModalOpen(false);
  };

  // Text labels localized
  const isBn = language === 'bn';
  const isAr = language === 'ar';

  const strings = {
    bannerTitle: isBn
      ? 'গোপনীয়তা ও সম্মতি সেটিংস (Privacy & Consent)'
      : isAr
      ? 'إعدادات الخصوصية والموافقة'
      : 'Privacy & Cookie Consent Preferences',
    bannerText: isBn
      ? 'আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। আপনার ফাইল বা ডেটা কখনো আমাদের সার্ভারে জমা হয় না। সাইটের কার্যক্ষমতা পরিমাপ (GA4) ও বিনামূল্যে টুলস প্রদান বজায় রাখতে (AdSense) সম্মতি প্রদান করুন। (EEA / UK / CH নির্দেশিকা অনুসারে)'
      : isAr
      ? 'نحن نحترم خصوصيتك تماماً. تعمل جميع أدواتنا داخل متصفحك دون رفع ملفاتك إلى خوادم خارجية. نستخدم تحليلات Google وإعلانات AdSense لدعم الأدوات المجانية وفقاً لمعايير الخصوصية الأوروبية (GDPR).'
      : 'We value your digital privacy. All tools operate 100% client-side in your browser with zero file uploads. We use Google Analytics 4 (G-NPEXBRERPT) and Google AdSense (ca-pub-5216241068377334) to maintain free utilities in compliance with EEA, UK, and Swiss GDPR directives.',
    acceptAll: isBn ? 'সব অনুমোদন করুন' : isAr ? 'قبول الكل' : 'Accept All',
    rejectNonEssential: isBn ? 'শুধুমাত্র প্রয়োজনীয়' : isAr ? 'رفض غير الضرورية' : 'Reject Non-Essential',
    customize: isBn ? 'পছন্দ কাস্টমাইজ করুন' : isAr ? 'تخصيص الخيارات' : 'Customize Preferences',
    modalTitle: isBn ? 'সম্মতি ব্যবস্থাপনা (Consent Preferences)' : isAr ? 'إدارة تفضيلات الموافقة' : 'Consent & Cookie Preferences',
    necessaryTitle: isBn ? '১. অত্যাবশ্যকীয় ও কার্যকরী (Strictly Necessary)' : isAr ? '١. ضرورية لتشغيل الموقع' : '1. Strictly Necessary & Core Storage',
    necessaryDesc: isBn
      ? 'সাইটের কার্যক্ষমতা, ডার্ক/লাইট মোড, ভাষা সংরক্ষণ ও ব্রাউজার মেমরিতে স্থানীয় প্রসেসিং পরিচালনার জন্য অপরিহার্য। এটি বন্ধ করা যায় না।'
      : isAr
      ? 'ملفات تعريف أساسية لتذكر تفضيلاتك (السمة، اللغة) وضمان معالجة العمليات محلياً داخل المتصفح. لا يمكن تعطيلها.'
      : 'Required for core platform functionality, persisting your theme and language choices, and enabling client-side WebAssembly computation. Always active.',
    analyticsTitle: isBn ? '২. বিশ্লেষণ ও পারফরম্যান্স (Google Analytics 4)' : isAr ? '٢. التحليلات والأداء (Google Analytics 4)' : '2. Analytics & Performance (Google Analytics 4)',
    analyticsDesc: isBn
      ? `অজ্ঞাতনামা (Anonymous) ট্রাফিক ডেটা ও টুল ব্যবহার পরিসংখ্যান পরিমাপ করে সাইটের গতি ও অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয় (ID: ${GA_MEASUREMENT_ID})।`
      : isAr
      ? `جمع إحصاءات استخدام مجهولة الهوية لمساعدتنا في تحسين سرعة وجودة الأدوات عبر معرف القياس (${GA_MEASUREMENT_ID}).`
      : `Anonymously measures tool usage metrics, feature latency, and navigation flow to help us optimize utilities (Measurement ID: ${GA_MEASUREMENT_ID}). No personally identifiable information is collected.`,
    adTitle: isBn ? '৩. বিজ্ঞাপন ও পারসোনালাইজেশন (Google AdSense)' : isAr ? '٣. الإعلانات والقياس (Google AdSense)' : '3. Advertising & Measurement (Google AdSense)',
    adDesc: isBn
      ? `বিনামূল্যে অনলাইন ইউটিলিটি প্রদান অব্যাহত রাখতে Google AdSense দ্বারা প্রাসঙ্গিক ও নিরাপদ বিজ্ঞাপন প্রদর্শনে ব্যবহৃত হয় (Publisher: ${ADSENSE_CLIENT_ID})।`
      : isAr
      ? `تساعد في دعم استمرار الخدمة مجاناً عبر عرض إعلانات آمنة وغير مزعجة من Google AdSense (الناشر: ${ADSENSE_CLIENT_ID}).`
      : `Allows Google AdSense (Publisher: ${ADSENSE_CLIENT_ID}) to display non-intrusive, relevant advertisements that support free, unlimited access to our utilities.`,
    alwaysActive: isBn ? 'সর্বদা সক্রিয়' : isAr ? 'مفعل دائماً' : 'Always Active',
    savePreferences: isBn ? 'পছন্দ সংরক্ষণ করুন' : isAr ? 'حفظ التفضيلات' : 'Save My Preferences',
    privacyLink: isBn ? 'গোপনীয়তা নীতি পড়ুন' : isAr ? 'سياسة الخصوصية' : 'Read Privacy Policy',
  };

  return (
    <>
      {/* 1. First-Time Floating Consent Banner */}
      {bannerVisible && (
        <aside
          aria-label="Privacy and cookie consent banner"
          className="fixed bottom-3 inset-x-3 sm:left-auto sm:right-4 sm:max-w-xl z-50 p-5 rounded-2xl bg-[#0a120e]/95 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl animate-fade-in"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {strings.bannerTitle}
                </h3>
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {strings.bannerText}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{strings.acceptAll}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-medium text-xs transition-colors"
                >
                  {strings.rejectNonEssential}
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-white/15 hover:border-emerald-400/40 text-emerald-400 hover:text-emerald-300 font-medium text-xs transition-colors flex items-center gap-1"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>{strings.customize}</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Detailed Cookie & Consent Preferences Modal (Accessible anytime) */}
      {modalOpen && (
        <div
          id="nova-consent-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1612] border border-emerald-500/30 text-white shadow-2xl p-6 sm:p-8 space-y-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="consent-modal-title" className="text-lg sm:text-xl font-bold text-white">
                    {strings.modalTitle}
                  </h2>
                  <p className="text-xs text-slate-400">
                    GDPR • UK GDPR • Swiss FADP • ePrivacy Aligned
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Granular Categories */}
            <div className="space-y-4">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm text-white">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>{strings.necessaryTitle}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {strings.alwaysActive}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {strings.necessaryDesc}
                </p>
              </div>

              {/* Category 2: Analytics & Performance (GA4) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm text-white">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>{strings.analyticsTitle}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {strings.analyticsDesc}
                </p>
              </div>

              {/* Category 3: Advertising & Measurement (Google AdSense) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm text-white">
                    <Megaphone className="w-4 h-4 text-emerald-400" />
                    <span>{strings.adTitle}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={advertisingEnabled}
                      onChange={(e) => setAdvertisingEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {strings.adDesc}
                </p>
              </div>
            </div>

            {/* Privacy Link */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  navigateToLegal('privacy');
                }}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>{strings.privacyLink}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <span>Consent Version 2.0</span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
              >
                {strings.rejectNonEssential}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-400 hover:text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
              >
                {strings.acceptAll}
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg active:scale-95 transition-all"
              >
                {strings.savePreferences}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
