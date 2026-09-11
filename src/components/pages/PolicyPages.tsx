import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Send,
  HelpCircle,
  FileText,
  AlertTriangle,
  Info,
  DollarSign,
  Briefcase,
  Cpu,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  Mail,
  User,
  MessageSquare,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ==========================================
// 1. PRIVACY POLICY PAGE
// ==========================================
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          Privacy First Commitment
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: March 2026 • Compliant with GDPR, CCPA/CPRA, and Google AdSense Policies</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6">
        {/* Core Guarantee Card */}
        <div className="p-5 rounded-2xl liquid-glass border border-emerald-500/30 flex items-start gap-3.5 text-emerald-900 dark:text-emerald-200 shadow-md">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm sm:text-base">Core Privacy Guarantee: 100% Local Browser Execution</p>
            <p className="text-xs sm:text-sm opacity-90">
              Nova Tools processes all file conversions, QR code generations, image resizings, document merges, and career utilities directly within your web browser using HTML5 Canvas, Web APIs, and Web Workers. <strong>Your images, PDFs, resumes, passwords, and sensitive inputs are never transmitted to, inspected by, or stored on remote cloud servers.</strong>
            </p>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          1. Technical Architecture of Local Operations
        </h2>
        <p>
          Unlike legacy utility websites that force users to upload gigabytes of sensitive files to centralized cloud storage buckets, Nova Tools executes computational tasks entirely in your device&apos;s volatile RAM:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
          <li><strong>Image Conversion & Compression:</strong> Handled using the browser&apos;s native HTML5 Canvas API and OffscreenCanvas threads without network transmission.</li>
          <li><strong>PDF Merging & Splitting:</strong> Binary byte manipulation is performed in-memory via client-side libraries (<code className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">pdf-lib</code> and <code className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">jsPDF</code>).</li>
          <li><strong>QR Code Generation & Scanning:</strong> Vector paths and camera frame decoding are executed on the local CPU; camera streams never exit your device hardware.</li>
          <li><strong>Text & Developer Tools:</strong> Formatting, Base64 encoding, URL encoding, and JSON tree validations are calculated strictly via local JavaScript engines.</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          2. Information We Do Not Collect
        </h2>
        <p>
          We deliberately engineered Nova Tools to eliminate user data risk. We do NOT:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
          <li>Collect, retain, or read the files you convert, resize, or merge.</li>
          <li>Store passwords generated through our Password Generator.</li>
          <li>Maintain databases of resume text, employment histories, or contact details entered into career tools.</li>
          <li>Sell, lease, or monetize your personal content or inputs.</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          3. Google Analytics 4 (Telemetry & Reliability)
        </h2>
        <p>
          To maintain system stability, identify software bugs, and understand which utilities provide the greatest utility, we utilize Google Analytics 4 (Measurement ID: <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">G-N4MHBT57FE</code>).
        </p>
        <p>
          Google Analytics captures aggregated, non-personally identifiable telemetry such as device category (mobile/desktop), browser type, referring source, and user interactions (e.g., tool completion, tool download, search queries). IP anonymization/masking is enabled by default. Uploaded files, generated images, and personal text are strictly excluded from analytics pings.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          4. Google AdSense & Advertising Cookies
        </h2>
        <p>
          To ensure Nova Tools remains 100% free and unrestricted without paywalls or subscriptions, we display non-intrusive advertisements served by Google AdSense (Publisher ID: <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">ca-pub-5216241068377334</code>).
        </p>
        <p>
          Google and its advertising partners utilize cookies and web beacons to serve advertisements based on prior visits to our site or other websites across the Internet. Our authorized seller status is publicly verifiable via our domain record at <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">/ads.txt</code>.
        </p>
        <p>
          You may customize your Google advertising preferences or opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline hover:text-emerald-400">Google Ads Settings</a> or <a href="https://aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline hover:text-emerald-400">AboutAds Choices</a>.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          5. Google Consent Mode v2 & European / UK / Swiss Privacy
        </h2>
        <p>
          For visitors residing in the European Economic Area (EEA), United Kingdom, and Switzerland, Nova Tools operates strictly under Google Consent Mode v2 in compliance with the General Data Protection Regulation (GDPR) and the ePrivacy Directive:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
          <li><strong>Default Denied:</strong> All non-essential advertising and analytics signals (<code className="text-xs font-mono text-emerald-400">analytics_storage</code>, <code className="text-xs font-mono text-emerald-400">ad_storage</code>, <code className="text-xs font-mono text-emerald-400">ad_user_data</code>, <code className="text-xs font-mono text-emerald-400">ad_personalization</code>) are set to denied until you affirmatively grant consent.</li>
          <li><strong>Right to Revoke:</strong> You may modify or revoke your consent preferences at any time.</li>
        </ul>

        {/* Re-open Consent Preferences Trigger */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 not-prose">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Manage Your Cookie Preferences</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize or update your Google Consent Mode choices at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('nova:open-consent-modal'));
              }
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            Open Consent Preferences
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          6. Local Storage & Client-Side Preferences
        </h2>
        <p>
          We utilize your browser&apos;s native <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-xs font-mono">localStorage</code> solely to preserve client-side user experience settings, such as your dark/light theme preference, pinned favorite tools, and recent tool history. This data remains on your physical device and can be cleared instantly by wiping browser website data.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          7. Statutory Rights (GDPR & CCPA/CPRA)
        </h2>
        <p>
          Depending on your regional jurisdiction, you hold statutory rights including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
          <li><strong>Right of Access & Transparency:</strong> Understanding what data is processed. Since all file execution is client-side, we store zero user documents.</li>
          <li><strong>Right to Opt-Out:</strong> Opting out of behavioral analytics or personalized advertising via our Consent Banner or Google Ads Settings.</li>
          <li><strong>Right to Erasure:</strong> Clearing your device cache removes all locally saved tool history and bookmarks.</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          8. Contacting Our Data Privacy Team
        </h2>
        <p>
          If you have questions regarding this Privacy Policy or wish to exercise data protection rights, please contact our privacy desk via our <a href="/contact" className="text-emerald-500 underline hover:text-emerald-400">Contact Portal</a> or by email at <a href="mailto:privacy@novatools.dev" className="text-emerald-500 underline hover:text-emerald-400">privacy@novatools.dev</a>.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. TERMS OF SERVICE PAGE
// ==========================================
export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          Legal & Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">Effective Date: March 2026 • Please read carefully before using Nova Tools</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using the Nova Tools platform, including any associated web applications, tools, APIs, and services (collectively, &quot;the Service&quot;), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the Service immediately.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          2. Permitted & Acceptable Use Policy
        </h2>
        <p>
          Nova Tools is provided for legitimate personal, academic, and commercial utility workflows. You agree not to misuse or abuse the Service. In particular, you agree NOT to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
          <li>Use the QR code suite to generate links pointing to phishing sites, malware distribution vectors, spyware, or fraudulent content.</li>
          <li>Deploy automated scripts, bots, scrapers, or high-concurrency requests designed to overwhelm platform infrastructure, bypass rate-limits, or impair service availability.</li>
          <li>Reverse-engineer or exploit any server-side security protections or rate-limiting safeguards.</li>
          <li>Process or convert materials that violate copyright laws, trademark protections, or the legal rights of third parties without proper authorization.</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          3. Intellectual Property & User Ownership
        </h2>
        <p>
          <strong>You retain 100% ownership, copyright, and title to all files, images, documents, and content you process using Nova Tools.</strong> Because our platform processes operations locally on your hardware, we never claim any ownership, licensing, or intellectual property rights over your inputs or generated outputs.
        </p>
        <p>
          The Nova Tools name, brand assets, source architecture, user interface designs, and documentation are protected by applicable intellectual property and copyright laws.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          4. Tool Accuracy & Limitations of Client-Side Computing
        </h2>
        <p>
          While we rigorously test all algorithms for mathematical and visual precision, conversion and calculation fidelity depends on your browser environment, operating system codecs, and device hardware capabilities. Nova Tools does not warrant that:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
          <li>File compression will always meet specific file-size targets without visual alterations.</li>
          <li>Financial or mathematical calculations will be suitable for binding legal, banking, or tax computations.</li>
          <li>Generated PDF documents or QR codes will be compatible with every legacy third-party hardware scanner or reader.</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          5. Third-Party Services & Advertising
        </h2>
        <p>
          The Service displays advertisements served by Google AdSense and may contain links to external third-party websites or services. Nova Tools does not control, endorse, or assume responsibility for the content, privacy practices, or products of third-party advertisers or external websites.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          6. User Responsibility & Backup Duty
        </h2>
        <p>
          You are solely responsible for maintaining independent backup copies of all files before processing them. You agree that Nova Tools shall have no liability for any loss of data, corrupted files, or unintended conversion outcomes resulting from local browser interruptions or device limitations.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          7. Disclaimer of Warranties & Limitation of Liability
        </h2>
        <p>
          THE SERVICE IS PROVIDED STRICTLY ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NOVA TOOLS DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL NOVA TOOLS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SERVICE.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          8. Modifications to Terms
        </h2>
        <p>
          We reserve the right to modify or replace these Terms of Service at any time. Material updates will be reflected by the &quot;Effective Date&quot; at the top of this document. Continued use of the platform following updates constitutes acceptance of the revised Terms.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 3. ABOUT NOVA TOOLS PAGE
// ==========================================
export const AboutPage: React.FC = () => {
  const { navigateToCategory } = useApp();

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          Our Story & Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          About Nova Tools
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          A high-performance online utility platform built on the uncompromising principle that essential digital tools must be blazing-fast, completely free, and strictly private.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">100% Client-Side</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your images, PDFs, passwords, and sensitive documents never travel to remote servers. All computation executes locally inside your web browser.
          </p>
        </div>

        <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Paywalls</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No mandatory user registration, no hidden file-size traps, and no artificial download timers. Every tool is immediately accessible to everyone.
          </p>
        </div>

        <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Human-First Craft</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Engineered with high optical contrast, responsive fluid layouts, and accessibility standards so you accomplish tasks in seconds.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Why We Built Nova Tools
        </h2>
        <p>
          For over two decades, converting an image from PNG to JPG or merging two PDF pages meant uploading confidential personal files to mysterious cloud servers, enduring intrusive popups, or battling aggressive monthly subscription walls.
        </p>
        <p>
          We recognized that modern web browsers possess remarkable computational power through HTML5 Canvas, WebAssembly, and native Web APIs. Nova Tools was designed to challenge the legacy paradigm: by shifting execution entirely into client-side RAM, we deliver instantaneous conversions while making privacy breaches physically impossible.
        </p>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          Who We Serve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Job Seekers & Professionals</span>
            </h4>
            <p className="text-xs text-slate-400">
              ATS-optimized resume formatting, cover letter tailoring, and professional career tracking without subscription software.
            </p>
          </div>

          <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Software Engineers & Designers</span>
            </h4>
            <p className="text-xs text-slate-400">
              JSON formatting, Base64 encoding, color contrast audits, and CSS gradient generators that integrate into developer workflows.
            </p>
          </div>

          <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Students & Educators</span>
            </h4>
            <p className="text-xs text-slate-400">
              Instant PDF merging, page splitting, image conversions, and document rotation without watermarks or page limits.
            </p>
          </div>

          <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy Advocates</span>
            </h4>
            <p className="text-xs text-slate-400">
              Users who demand verifiable assurance that their passports, IDs, contracts, and confidential photos never touch external cloud servers.
            </p>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8">
          Our Advertising & Transparency Policy
        </h2>
        <p>
          Nova Tools is proudly independent and sustained through transparent, policy-compliant digital advertising via Google AdSense. We do not sell user data, we do not bundle affiliate adware, and we will never lock everyday utilities behind premium subscription tiers.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 4. CONTACT & SUPPORT PAGE (REAL BACKEND DELIVERY)
// ==========================================
export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('tool-request');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [hpWebsite, setHpWebsite] = useState(''); // Honeypot field for bot detection
  const [formStartTime, setFormStartTime] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<{
    ticketId: string;
    receivedAt: string;
    message: string;
  } | null>(null);

  // Capture render time to detect bot instant-submissions
  useEffect(() => {
    setFormStartTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation checks
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please provide your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid, deliverable email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please provide a detailed message (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          subject: subject.trim() || `${category} inquiry`,
          message: message.trim(),
          hp_website: hpWebsite, // Bot honeypot check
          formStartTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deliver message. Please try again.');
      }

      setDeliveryResult({
        ticketId: data.ticketId || 'NT-CONFIRMED',
        receivedAt: data.receivedAt || new Date().toISOString(),
        message: data.message || 'Your message has been delivered to our engineering desk.',
      });
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMessage(err.message || 'Unable to connect to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setCategory('tool-request');
    setSubject('');
    setMessage('');
    setHpWebsite('');
    setFormStartTime(Date.now());
    setDeliveryResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fade-in">
      <div className="space-y-3 text-center">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          Support & Suggestions Desk
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Contact Nova Tools
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Need assistance, spotted a bug, or have an idea for a new utility? Every submission is assigned a verified ticket and delivered to our engineering desk.
        </p>
      </div>

      {deliveryResult ? (
        /* Real Verified Delivery Confirmation */
        <div className="p-6 sm:p-8 rounded-2xl liquid-glass border border-emerald-500/30 text-center space-y-5 shadow-2xl animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-wide">
              Delivered Successfully
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Ticket Confirmed
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {deliveryResult.message}
            </p>
          </div>

          {/* Ticket Metadata Card */}
          <div className="p-4 rounded-xl bg-black/20 border border-white/10 text-left space-y-2 font-mono text-xs max-w-md mx-auto">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">Ticket Reference:</span>
              <span className="font-bold text-emerald-400">{deliveryResult.ticketId}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-slate-300">{new Date(deliveryResult.receivedAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Target Desk:</span>
              <span className="text-slate-300 capitalize">{category.replace('-', ' ')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Send Another Inquiry</span>
          </button>
        </div>
      ) : (
        /* Contact Form with Validation & Spam Protection */
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl"
        >
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Honeypot field (hidden from human users, catches spam bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_website">Website URL (leave empty)</label>
            <input
              id="hp_website"
              type="text"
              name="hp_website"
              tabIndex={-1}
              autoComplete="off"
              value={hpWebsite}
              onChange={(e) => setHpWebsite(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Your Name *</span>
              </label>
              <input
                required
                type="text"
                maxLength={100}
                placeholder="e.g. Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Address *</span>
              </label>
              <input
                required
                type="email"
                maxLength={150}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Topic Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-100 bg-[#0c1410] focus:border-emerald-500 outline-none transition-colors"
              >
                <option value="tool-request">New Tool Suggestion</option>
                <option value="bug-report">Bug or Conversion Issue</option>
                <option value="privacy">Privacy & Data Governance</option>
                <option value="partnership">Advertising & Partnership</option>
                <option value="general">General Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Subject (Optional)</span>
              </label>
              <input
                type="text"
                maxLength={120}
                placeholder="Brief summary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Detailed Message *</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {message.length} / 3000 chars
              </span>
            </div>
            <textarea
              required
              rows={5}
              maxLength={3000}
              placeholder="Describe your suggestion, tool requirements, or problem in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Delivering Message to Server...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Deliver Message (Assign Ticket)</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            🔒 Protected by honeypot anti-spam & rate limiting. Your email is used solely to respond to this ticket.
          </p>
        </form>
      )}
    </div>
  );
};

// ==========================================
// 5. DISCLAIMER PAGE (CRUCIAL FOR ADSENSE TRUST)
// ==========================================
export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
          Important Notices & Disclaimers
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          General & Specialized Disclaimers
        </h1>
        <p className="text-xs text-slate-400">Last updated: March 2026 • Please read regarding tool outputs, calculators, and AI features</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-6">
        {/* Notice Banner */}
        <div className="p-5 rounded-2xl liquid-glass border border-amber-500/30 flex items-start gap-3.5 text-amber-900 dark:text-amber-200 shadow-md">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm sm:text-base">Educational & Productivity Informational Notice</p>
            <p className="text-xs sm:text-sm opacity-90">
              Nova Tools provides online utility software designed for productivity and educational convenience. While we strive for absolute algorithmic precision, outputs are provided &quot;as is&quot; and must be independently verified by the user prior to critical financial, career, legal, or commercial reliance.
            </p>
          </div>
        </div>

        {/* 1. Financial Tools Disclaimer */}
        <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 not-prose">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>1. Financial & Calculation Utilities Disclaimer</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The financial calculators provided on Nova Tools (including but not limited to the <strong>Loan Calculator</strong>, <strong>Compound Interest Calculator</strong>, <strong>Tip Calculator</strong>, and <strong>Discount Calculator</strong>) are built purely for educational, illustrative, and informational estimation.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li><strong>Not Certified Financial Advice:</strong> The mathematical models do not constitute certified financial, accounting, tax, lending, or investment counsel.</li>
            <li><strong>Variable Conditions:</strong> Calculations assume fixed parameters and do not incorporate localized taxes, bank fees, variable interest rates, compounding variations, or inflation.</li>
            <li><strong>Consult Licensed Advisors:</strong> You must consult a licensed financial advisor, accredited accountant, or lending institution before signing binding loans or financial contracts.</li>
          </ul>
        </div>

        {/* 2. Career & Resume Tools Disclaimer */}
        <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 not-prose">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>2. Career, Resume & Cover Letter Tools Disclaimer</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our career utilities (including the <strong>ATS Resume Builder</strong>, <strong>Resume Analyzer</strong>, and <strong>Cover Letter Generator</strong>) provide structural formatting and heuristic writing recommendations based on general industry recruitment standards.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li><strong>No Guarantee of Employment:</strong> Utilizing our tools does not guarantee job interviews, hiring offers, or passage through every proprietary Applicant Tracking System (ATS).</li>
            <li><strong>User Factual Accuracy:</strong> The candidate is solely responsible for ensuring that all job titles, dates, certifications, and achievements documented are accurate, honest, and verifiable.</li>
          </ul>
        </div>

        {/* 3. AI-Generated Results Disclaimer */}
        <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 not-prose">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>3. Artificial Intelligence (AI) Assisted Features</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Certain assistive tools on Nova Tools utilize machine learning models (such as Google Gemini) or automated algorithmic heuristics to draft cover letters or suggest action verbs for resume bullet points.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li><strong>Assistive Drafting Aids Only:</strong> Generative AI output is intended solely as an assistive drafting starting point. AI models may occasionally produce phrasing that is unsuited to your specific career history.</li>
            <li><strong>Mandatory Human Review:</strong> Users must carefully read, review, and modify all AI-generated suggestions before submitting them to third parties or prospective employers.</li>
          </ul>
        </div>

        {/* 4. Document & Image Conversion Integrity */}
        <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 not-prose">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>4. Document & File Processing Integrity</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Because our conversion engines execute in-browser using standard Web APIs, variations in browser rendering engines (e.g. Chromium, WebKit, Gecko) or device memory constraints may affect font rasterization or image color profiles. Users must always retain master backup copies of original files before conversion, compression, or modification.
          </p>
        </div>

        {/* 5. External Links & Third-Party Advertising */}
        <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 not-prose">
            <Info className="w-5 h-5 text-emerald-400" />
            <span>5. Third-Party Advertisements & External Links</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Nova Tools displays ads served by Google AdSense. We do not personally endorse, investigate, or verify claims made by third-party advertisers. Clicking on third-party advertisements or outbound hyperlinks directs you away from our platform and subject to the respective external site&apos;s policies.
          </p>
        </div>
      </div>
    </div>
  );
};
