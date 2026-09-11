import { Language } from '../types';

export interface WorkstationTranslation {
  name: string;
  badge: string;
  description: string;
  popularFeatures: string[];
}

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  searchPlaceholder: string;
  searchModalTitle: string;
  noResultsFound: string;
  privacyBadge: string;
  clientSideBadge: string;
  popularTools: string;
  allTools: string;
  launchTool: string;
  filterPlaceholder: string;
  workstationToolsCount: string;
  advertisement: string;
  cookieNotice: string;
  accept: string;
  categories: {
    all: string;
    popular: string;
    image: string;
    pdf: string;
    qr: string;
    career: string;
    utilities: string;
    design: string;
    calculators: string;
    ai: string;
  };
  workstations: {
    qr: WorkstationTranslation;
    image: WorkstationTranslation;
    pdf: WorkstationTranslation;
    career: WorkstationTranslation;
    utilities: WorkstationTranslation;
    design: WorkstationTranslation;
    calculators: WorkstationTranslation;
  };
  actions: {
    back: string;
    upload: string;
    dragDrop: string;
    browse: string;
    process: string;
    processing: string;
    download: string;
    reset: string;
    copy: string;
    copied: string;
    options: string;
    preview: string;
    result: string;
    remove: string;
    apply: string;
    openLink: string;
  };
  toolLabels: {
    format: string;
    quality: string;
    width: string;
    height: string;
    maintainAspect: string;
    originalSize: string;
    outputSize: string;
    reduction: string;
    overlayPosition: string;
    safeMargin: string;
    qrSize: string;
    qrData: string;
    qrDataPlaceholder: string;
    photoInput: string;
    scanabilityGood: string;
    scanabilityWarning: string;
    selectProfession: string;
    generateBio: string;
    uploadPhoto: string;
  };
  nav: {
    home: string;
    tools: string;
    privacy: string;
    terms: string;
    about: string;
    contact: string;
    disclaimer: string;
  };
  footer: {
    rights: string;
    privacyNotice: string;
    legal: string;
    quickLinks: string;
    madeForWeb: string;
  };
  toolTitles: Record<string, string>;
  toolDescriptions: Record<string, string>;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Nova Tools',
    tagline: 'Privacy-First Online Utility Platform',
    heroHeadline: 'Fast, Real Utilities Directly in Your Browser',
    heroSubheadline: 'Process images, manipulate PDFs, compose photo QR overlays, generate resumes, and run developer utilities with zero tracking and zero server uploads.',
    searchPlaceholder: 'Search...',
    searchModalTitle: 'Search Nova Tools Directory',
    noResultsFound: 'No tools found matching your query.',
    privacyBadge: '100% Client-Side Processing',
    clientSideBadge: 'Files never leave your device',
    popularTools: 'Popular Utilities',
    allTools: 'Tool Directory',
    launchTool: 'Launch Tool',
    filterPlaceholder: 'Filter tools in workstation...',
    workstationToolsCount: 'real utilities operating 100% in your browser.',
    advertisement: 'Advertisement',
    cookieNotice: 'Nova Tools uses privacy-compliant cookies and Google AdSense to provide free online utilities directly in your browser without collecting your personal data.',
    accept: 'Accept & Close',
    categories: {
      all: 'All Tools',
      popular: 'Popular',
      image: 'Image Tools',
      pdf: 'PDF Tools',
      qr: 'QR & Overlay',
      career: 'Career & Cards',
      utilities: 'Everyday Utilities',
      design: 'Design Tools',
      calculators: 'Calculators & Finance',
      ai: 'AI Assistance',
    },
    workstations: {
      qr: {
        name: 'QR & Photo Overlay Workstation',
        badge: 'QR Suite',
        description: 'Generate high-resolution QR codes and seamlessly overlay them onto photos and flyers with live contrast inspection.',
        popularFeatures: ['Photo + QR Overlay', 'Wi-Fi QR', 'vCard Contact', 'WhatsApp QR', 'Bulk QR Generator'],
      },
      image: {
        name: 'Image Suite Workstation',
        badge: 'Image Studio',
        description: 'Convert between PNG, JPG, and WebP, shrink file sizes, crop with preset aspect ratios, and generate official passport photos.',
        popularFeatures: ['Format Converter', 'Lossless Compressor', 'Resizer & Cropper', 'Passport Maker'],
      },
      pdf: {
        name: 'PDF Suite Workstation',
        badge: 'Document Studio',
        description: 'Merge multiple PDF documents, split and extract specific pages, convert image collections into PDFs, and add watermarks.',
        popularFeatures: ['Merge PDFs', 'Split & Extract', 'Images to PDF', 'Watermark & Encrypt'],
      },
      career: {
        name: 'Career & Resume Workstation',
        badge: 'Career Hub',
        description: 'Build modern ATS-compliant resumes with photo and profession bio generation, scan match percentages, and track pipelines.',
        popularFeatures: ['Photo Resume Maker', 'Profession Bio Generator', 'ATS Match Analyzer', 'Job Tracker'],
      },
      utilities: {
        name: 'Developer & Utilities Workstation',
        badge: 'Dev Tools',
        description: 'Format & validate JSON, encode/decode Base64 and URLs, convert Unix timestamps, and generate strong passwords.',
        popularFeatures: ['JSON Formatter', 'Base64 & URL', 'Timestamp Converter', 'Password Generator', 'Unit Converter'],
      },
      design: {
        name: 'Design & Color Workstation',
        badge: 'Color Studio',
        description: 'Verify WCAG AA/AAA accessibility contrast, extract palette swatches from images, and build CSS linear/radial gradients.',
        popularFeatures: ['Contrast Auditor', 'Image Color Extractor', 'CSS Gradient Generator'],
      },
      calculators: {
        name: 'Calculators & Finance Workstation',
        badge: 'Calculators',
        description: 'Compute loan amortizations and EMIs, project compound investment returns, split dining bills, and calculate date durations.',
        popularFeatures: ['Loan & EMI Calculator', 'Compound Interest', 'Tip & Splitter', 'Date Duration'],
      },
    },
    actions: {
      back: 'Back',
      upload: 'Choose File',
      dragDrop: 'Drag and drop your file here, or click to browse',
      browse: 'Browse Files',
      process: 'Process',
      processing: 'Processing...',
      download: 'Download Result',
      reset: 'Reset',
      copy: 'Copy to Clipboard',
      copied: 'Copied!',
      options: 'Tool Options',
      preview: 'Live Preview',
      result: 'Processed Result',
      remove: 'Remove',
      apply: 'Apply Changes',
      openLink: 'Open Link Safely',
    },
    toolLabels: {
      format: 'Output Format',
      quality: 'Image Quality',
      width: 'Width (px)',
      height: 'Height (px)',
      maintainAspect: 'Keep Aspect Ratio',
      originalSize: 'Original Size',
      outputSize: 'Output Size',
      reduction: 'Size Reduction',
      overlayPosition: 'QR Badge Position',
      safeMargin: 'Quiet Zone Margin',
      qrSize: 'QR Code Size',
      qrData: 'QR Destination Data',
      qrDataPlaceholder: 'Enter URL, text, phone number, or Wi-Fi credentials...',
      photoInput: 'Upload Base Photo',
      scanabilityGood: 'Scanability Check: Optimal contrast and quiet zone.',
      scanabilityWarning: 'Caution: QR code size or margin may be too small for older smartphone cameras.',
      selectProfession: 'Select Profession / Field',
      generateBio: 'Generate Professional Bio',
      uploadPhoto: 'Upload Profile Photo',
    },
    nav: {
      home: 'Home',
      tools: 'Tools',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      about: 'About Nova Tools',
      contact: 'Contact Us',
      disclaimer: 'Disclaimer',
    },
    footer: {
      rights: 'All rights reserved.',
      privacyNotice: 'Nova Tools runs processing locally inside your web browser. Your private images, PDFs, resumes, and inputs are not collected or stored on our servers.',
      legal: 'Legal & Trust',
      quickLinks: 'Navigation',
      madeForWeb: 'Engineered for speed, privacy, and accessibility.',
    },
    toolTitles: {
      'photo-qr-overlay': 'Photo + QR Overlay (All-in-One)',
      'vcard-qr': 'vCard Business Card Generator',
      'whatsapp-qr': 'WhatsApp Direct QR',
      'qr-designer': 'QR Custom Designer',
      'batch-qr': 'Batch QR Generator',
      'qr-scanner': 'QR Camera & File Scanner',
      'image-converter': 'Unified Image Converter',
      'jpg-to-png': 'JPG to PNG Converter',
      'png-to-jpg': 'PNG to JPG Converter',
      'image-compressor': 'Lossless Image Compressor',
      'image-resizer': 'Fast Image Resizer',
      'crop-rotate': 'Image Crop & Rotate',
      'passport-photo': 'Passport & Visa Photo Maker',
      'merge-pdf': 'Merge PDF Documents',
      'split-pdf': 'Split & Extract PDF Pages',
      'images-to-pdf': 'Images to PDF Document',
      'pdf-page-numbers': 'Add Page Numbers to PDF',
      'watermark-pdf': 'Watermark PDF Tool',
      'resume-maker': 'ATS Resume & CV Builder',
      'ats-checker': 'ATS Resume Match Analyzer',
      'job-tracker': 'Job Application Kanban Pipeline',
      'json-formatter': 'JSON Formatter & Validator',
      'base64-tool': 'Base64 & URL Encoder/Decoder',
      'timestamp-tool': 'Unix Timestamp & Date Converter',
      'password-gen': 'Secure Password Generator',
      'unit-converter': 'Engineering & Science Unit Converter',
      'color-palette': 'Image Color Palette Extractor',
      'contrast-checker': 'WCAG Accessibility Contrast Checker',
      'gradient-generator': 'CSS Gradient Visual Studio',
      'loan-calculator': 'Loan & Mortgage EMI Calculator',
      'compound-interest': 'Compound Interest Projector',
      'tip-calculator': 'Tip & Bill Split Calculator',
      'date-calculator': 'Date Duration & Calendar Counter',
    },
    toolDescriptions: {
      'photo-qr-overlay': 'Upload photo, choose Wi-Fi, URL, WhatsApp, or Contact QR, position in corner badge, preview, and download high-quality JPG.',
      'vcard-qr': 'Upload photo/logo, fill user and company details, original standard card ratio with dual-sided layout, and instant JPG/VCF export.',
      'whatsapp-qr': 'Create QR codes that instantly open a pre-filled WhatsApp chat with your number.',
      'qr-designer': 'Customize QR foreground/background colors, margins, error correction levels, and quiet zones.',
      'batch-qr': 'Generate dozens of high-resolution QR codes from lists or CSV rows and export as ZIP.',
      'qr-scanner': 'Scan QR codes using your device camera or uploaded image files with safe link preview.',
      'image-converter': 'Fast, loss-free conversion between JPG, PNG, and WebP with custom dimensions and quality.',
      'jpg-to-png': 'Convert compressed JPEG photos to lossless PNG format directly in your browser.',
      'png-to-jpg': 'Convert transparent PNG images to clean compressed JPG files with custom background fills.',
      'image-compressor': 'Reduce image byte sizes by up to 80% without visible loss in quality directly in-browser.',
      'image-resizer': 'Scale images to custom pixel dimensions with aspect ratio lock and social media presets.',
      'crop-rotate': 'Crop photos with standard aspect ratios (1:1, 16:9, 4:3) and rotate or flip horizontally and vertically.',
      'passport-photo': 'Prepare official passport and visa headshots for US, UK, Schengen, India, Canada, and UAE with 4x6 print sheets.',
      'merge-pdf': 'Combine multiple PDF files into one clean, continuous document with drag-and-drop reordering.',
      'split-pdf': 'Extract custom page numbers or page ranges into a new standalone PDF file.',
      'images-to-pdf': 'Assemble collections of JPG, PNG, and WebP images into a formatted PDF document.',
      'pdf-page-numbers': 'Stamp numbered page headers or footers across any PDF document.',
      'watermark-pdf': 'Overlay custom diagonal or header text watermarks onto PDF pages with custom opacity.',
      'resume-maker': 'Create professional, ATS-optimized resumes with profile photo, smart profession bio generator, and direct PDF printing.',
      'ats-checker': 'Analyze your resume against ATS criteria, keyword density, section headers, and target job descriptions.',
      'job-tracker': 'Track your job search applications, interviews, and offers in an organized local Kanban board.',
      'json-formatter': 'Prettify, minify, validate, and inspect JSON structures with collapsible syntax trees.',
      'base64-tool': 'Encode and decode Base64 strings, binary files, and URI components securely client-side.',
      'timestamp-tool': 'Convert Unix epoch timestamps to human-readable dates across multiple world time zones.',
      'password-gen': 'Generate cryptographically strong passwords with custom length and character sets.',
      'unit-converter': 'Convert length, weight, temperature, data storage, speed, and area with instant precision.',
      'color-palette': 'Extract dominant color palettes and hex swatches directly from any uploaded image.',
      'contrast-checker': 'Calculate WCAG 2.1 AA and AAA contrast ratios between foreground and background colors.',
      'gradient-generator': 'Design modern linear and radial CSS gradients with multi-stop color controls and copyable code.',
      'loan-calculator': 'Calculate monthly loan EMI payments, total interest breakdown, and amortization schedules.',
      'compound-interest': 'Forecast investment growth, regular contributions, and compound interest over time.',
      'tip-calculator': 'Calculate gratuity percentages and evenly split restaurant bills among friends.',
      'date-calculator': 'Calculate exact days, weeks, and months between two dates or add/subtract intervals.',
    },
  },

  bn: {
    appName: 'নোভা টুলস',
    tagline: 'গোপনীয়তা-সুরক্ষিত অনলাইন ইউটিলিটি প্ল্যাটফর্ম',
    heroHeadline: 'ব্রাউজারেই দ্রুত এবং নির্ভরযোগ্য কার্যকর টুলস',
    heroSubheadline: 'ছবি রূপান্তর, পিডিএফ সম্পাদনা, ফটো কিউআর ওভারলে, পেশাদার রিজিউমে তৈরি এবং কোডার ইউটিলিটি ব্যবহার করুন সম্পূর্ণ আপনার ডিভাইসেই—কোনো তথ্য সার্ভারে পাঠানো হয় না।',
    searchPlaceholder: 'Search...',
    searchModalTitle: 'নোভা টুলস ডিরেক্টরি অনুসন্ধান',
    noResultsFound: 'আপনার অনুসন্ধানের সাথে মিলিয়ে কোনো টুল পাওয়া যায়নি।',
    privacyBadge: '১০০% ক্লায়েন্ট-সাইড প্রসেসিং',
    clientSideBadge: 'আপনার ফাইল কখনোই ডিভাইস থেকে আপলোড হয় না',
    popularTools: 'জনপ্রিয় ইউটিলিটিসমূহ',
    allTools: 'সকল টুলস ডিরেক্টরি',
    launchTool: 'টুলটি খুলুন',
    filterPlaceholder: 'ওয়ার্কস্টেশনে টুল খুঁজুন...',
    workstationToolsCount: 'টি কার্যকর টুল যা ১০০% আপনার ব্রাউজারে চলে।',
    advertisement: 'বিজ্ঞাপন',
    cookieNotice: 'নোভা টুলস বিনামূল্যে অনলাইন সেবা প্রদান করতে এবং কোনো ব্যক্তিগত তথ্য সংগ্রহ না করেই সেরা অভিজ্ঞতা দিতে কুকিজ এবং গুগল অ্যাডসেন্স ব্যবহার করে।',
    accept: 'সম্মত ও বন্ধ করুন',
    categories: {
      all: 'সকল টুলস',
      popular: 'জনপ্রিয়',
      image: 'ইমেজ টুলস',
      pdf: 'পিডিএফ টুলস',
      qr: 'কিউআর ও ওভারলে',
      career: 'ক্যারিয়ার ও কার্ড',
      utilities: 'নিত্যদিনের ইউটিলিটি',
      design: 'ডিজাইন টুলস',
      calculators: 'ক্যালকুলেটর ও ফিন্যান্স',
      ai: 'এআই সহায়তা',
    },
    workstations: {
      qr: {
        name: 'কিউআর ও ফটো ওভারলে ওয়ার্কস্টেশন',
        badge: 'কিউআর স্টুডিও',
        description: 'উচ্চমানের কিউআর কোড তৈরি করুন এবং সরাসরি যেকোনো ছবির কর্নার ব্যাজে পারফেক্ট কনট্রাস্টসহ ওভারলে করে ডাউনলোড করুন।',
        popularFeatures: ['ফটো + কিউআর ওভারলে', 'ওয়াই-ফাই কিউআর', 'ভিকার্ড বিজনেস কার্ড', 'হোয়াটসঅ্যাপ সরাসরি কিউআর', 'বাল্ক কিউআর মেকার'],
      },
      image: {
        name: 'ইমেজ স্টুডিও ওয়ার্কস্টেশন',
        badge: 'ইমেজ স্টুডিও',
        description: 'পিএনজি, জেপিজি ও ওয়েবপির মধ্যে দ্রুত রূপান্তর, সাইজ হ্রাস, ক্রপ-রোটেট এবং পাসপোর্ট ও ভিসা সাইজ ছবি তৈরি করুন।',
        popularFeatures: ['ফরম্যাট কনভার্টার', 'ইমেজ কম্প্রেসার', 'রিসাইজার ও ক্রপ', 'পাসপোর্ট ফটো মেকার'],
      },
      pdf: {
        name: 'পিডিএফ স্টুডিও ওয়ার্কস্টেশন',
        badge: 'ডকুমেন্ট স্টুডিও',
        description: 'একাধিক পিডিএফ ফাইল একত্রিত করুন, পৃষ্ঠা বিভক্ত করুন, ছবি থেকে পিডিএফ তৈরি করুন এবং ওয়াটারমার্ক যোগ করুন।',
        popularFeatures: ['পিডিএফ মার্জ', 'পিডিএফ স্প্লিট', 'ছবি থেকে পিডিএফ', 'ওয়াটারমার্ক ও পেজ নম্বর'],
      },
      career: {
        name: 'ক্যারিয়ার ও সিভি ওয়ার্কস্টেশন',
        badge: 'ক্যারিয়ার হাব',
        description: 'ছবি ও পেশাভিত্তিক স্মার্ট বায়ো জেনারেটরসহ পেশাদার সিভি তৈরি করুন এবং এটিএস ফ্রেন্ডলি রেজাল্ট ডাউনলোড করুন।',
        popularFeatures: ['ছবিযুক্ত সিভি বিল্ডার', 'পেশাভিত্তিক বায়ো জেনারেটর', 'এটিএস ম্যাচ চেকার', 'জব ট্র্যাকার'],
      },
      utilities: {
        name: 'ডেভেলপার ও ইউটিলিটি ওয়ার্কস্টেশন',
        badge: 'ডেভ টুলস',
        description: 'জেসন ফরম্যাট ও ভ্যালিডেশন, বেস৬৪ এবং ইউআরএল এনকোড/ডিকোড, ইউনিক্স টাইমস্ট্যাম্প রূপান্তর এবং নিরাপদ পাসওয়ার্ড তৈরি করুন।',
        popularFeatures: ['জেসন ফরম্যাটার', 'বেস৬৪ ও ইউআরএল', 'টাইমস্ট্যাম্প কনভার্টার', 'পাসওয়ার্ড জেনারেটর', 'ইউনিট কনভার্টার'],
      },
      design: {
        name: 'ডিজাইন ও কালার ওয়ার্কস্টেশন',
        badge: 'কালার স্টুডিও',
        description: 'ডব্লিউসিএজি এক্সেসিবিলিটি কনট্রাস্ট পরীক্ষা, ছবি থেকে কালার প্যালেট এক্সট্রাক্ট এবং আধুনিক সিএসএস গ্রেডিয়েন্ট তৈরি করুন।',
        popularFeatures: ['কনট্রাস্ট চেকার', 'ছবি কালার প্যালেট', 'সিএসএস গ্রেডিয়েন্ট'],
      },
      calculators: {
        name: 'ক্যালকুলেটর ও ফিন্যান্স ওয়ার্কস্টেশন',
        badge: 'ক্যালকুলেটর',
        description: 'লোন ও ইএমআই হিসাব, চক্রবৃদ্ধি মুনাফা প্রজেকশন, বিল স্প্লিট এবং ক্যালেন্ডার দিন গণনা করুন।',
        popularFeatures: ['লোন ও ইএমআই', 'চক্রবৃদ্ধি মুনাফা', 'টিপ ও বিল স্প্লিটার', 'দিন ও তারিখ গণনা'],
      },
    },
    actions: {
      back: 'ফিরে যান',
      upload: 'ফাইল নির্বাচন করুন',
      dragDrop: 'এখানে ফাইল টেনে এনে রাখুন অথবা ব্রাউজ করতে ক্লিক করুন',
      browse: 'ফাইল খুঁজুন',
      process: 'প্রক্রিয়াকরণ করুন',
      processing: 'প্রক্রিয়াকরণ হচ্ছে...',
      download: 'ডাউনলোড করুন',
      reset: 'রিসেট',
      copy: 'কপি করুন',
      copied: 'কপি হয়েছে!',
      options: 'বিকল্পসমূহ',
      preview: 'লাইভ প্রিভিউ',
      result: 'ফলাফল',
      remove: 'মুছে ফেলুন',
      apply: 'প্রয়োগ করুন',
      openLink: 'লিঙ্কটি খুলুন',
    },
    toolLabels: {
      format: 'আউটপুট ফরম্যাট',
      quality: 'ছবির গুণমান',
      width: 'প্রস্থ (px)',
      height: 'উচ্চতা (px)',
      maintainAspect: 'অনুপাত বজায় রাখুন',
      originalSize: 'আসল সাইজ',
      outputSize: 'নতুন সাইজ',
      reduction: 'আকার হ্রাস',
      overlayPosition: 'কিউআর ব্যাজ পজিশন',
      safeMargin: 'মার্জিন বা কুয়াইট জোন',
      qrSize: 'কিউআর কোড সাইজ',
      qrData: 'কিউআর তথ্য',
      qrDataPlaceholder: 'ওয়েবসাইট লিঙ্ক, টেক্সট বা তথ্য লিখুন...',
      photoInput: 'মূল ছবি আপলোড করুন',
      scanabilityGood: 'স্ক্যানাবিলিটি পরীক্ষা: চমৎকার কনট্রাস্ট ও মার্জিন।',
      scanabilityWarning: 'সতর্কতা: কিউআর কোড খুব ছোট হলে স্ক্যানারে সমস্যা হতে পারে।',
      selectProfession: 'আপনার পেশা / ক্ষেত্র নির্বাচন করুন',
      generateBio: 'স্মার্ট প্রফেশনাল বায়ো তৈরি করুন',
      uploadPhoto: 'প্রোফাইল ছবি আপলোড করুন',
    },
    nav: {
      home: 'হোম',
      tools: 'টুলস',
      privacy: 'গোপনীয়তা নীতি',
      terms: 'ব্যবহারের শর্তাবলী',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      disclaimer: 'দাবিত্যাগ',
    },
    footer: {
      rights: 'সর্বস্বত্ব সংরক্ষিত।',
      privacyNotice: 'নোভা টুলস সম্পূর্ণভাবে আপনার ব্রাউজারে কাজ করে। আপনার ব্যক্তিগত ফাইল আমাদের সার্ভারে জমা বা সংরক্ষণ করা হয় না।',
      legal: 'আইন ও সুরক্ষা',
      quickLinks: 'ন্যাভিগেশন',
      madeForWeb: 'গতি, গোপনীয়তা ও সুরক্ষার জন্য নির্মিত।',
    },
    toolTitles: {
      'photo-qr-overlay': 'ফটো + কিউআর ওভারলে (অল-ইন-ওয়ান)',
      'vcard-qr': 'ভিকার্ড ভিজিটিং কার্ড মেকার',
      'whatsapp-qr': 'হোয়াটসঅ্যাপ সরাসরি কিউআর',
      'qr-designer': 'কিউআর কাস্টম ডিজাইনার',
      'batch-qr': 'ব্যাচ কিউআর জেনারেটর',
      'qr-scanner': 'কিউআর ক্যামেরা ও ফাইল স্ক্যানার',
      'image-converter': 'ইউনিফাইড ইমেজ কনভার্টার',
      'jpg-to-png': 'জেপিজি থেকে পিএনজি কনভার্টার',
      'png-to-jpg': 'পিএনজি থেকে জেপিজি কনভার্টার',
      'image-compressor': 'লচলেস ইমেজ কম্প্রেসার',
      'image-resizer': 'দ্রুত ইমেজ রিসাইজার',
      'crop-rotate': 'ইমেজ ক্রপ ও রোটেট',
      'passport-photo': 'পাসপোর্ট ও ভিসা ফটো মেকার',
      'merge-pdf': 'পিডিএফ মার্জ ও একত্রিত করুন',
      'split-pdf': 'পিডিএফ স্প্লিট ও পৃষ্ঠা পৃথক করুন',
      'images-to-pdf': 'ছবি থেকে পিডিএফ ডকুমেন্ট',
      'pdf-page-numbers': 'পিডিএফ পেজ নম্বর টুল',
      'watermark-pdf': 'পিডিএফ ওয়াটারমার্ক টুল',
      'resume-maker': 'ছবিযুক্ত এটিএস সিভি ও রেজুমে মেকার',
      'ats-checker': 'এটিএস রেজুমে ম্যাচ অ্যানালাইজার',
      'job-tracker': 'জব অ্যাপ্লিকেশন কানবান ট্র্যাকার',
      'json-formatter': 'জেসন ফরম্যাটার ও ভ্যালিডেটর',
      'base64-tool': 'বেস৬৪ ও ইউআরএল এনকোডার/ডিকোডার',
      'timestamp-tool': 'ইউনিক্স টাইমস্ট্যাম্প কনভার্টার',
      'password-gen': 'নিরাপদ পাসওয়ার্ড জেনারেটর',
      'unit-converter': 'ইঞ্জিনিয়ারিং ও বিজ্ঞান ইউনিট কনভার্টার',
      'color-palette': 'ছবি কালার প্যালেট এক্সট্রাক্টর',
      'contrast-checker': 'ডব্লিউসিএজি কনট্রাস্ট চেকার',
      'gradient-generator': 'সিএসএস গ্রেডিয়েন্ট ভিজ্যুয়াল স্টুডিও',
      'loan-calculator': 'লোন ও মর্টগেজ ইএমআই ক্যালকুলেটর',
      'compound-interest': 'চক্রবৃদ্ধি মুনাফা প্রজেক্টর',
      'tip-calculator': 'টিপ ও রেস্টুরেন্ট বিল স্প্লিটার',
      'date-calculator': 'তারিখ ও দিন গণনা ক্যালকুলেটর',
    },
    toolDescriptions: {
      'photo-qr-overlay': 'ছবি আপলোড করুন, ওয়াই-ফাই, লিঙ্ক, হোয়াটসঅ্যাপ বা কন্টাক্ট নির্বাচন করুন এবং সরাসরি কর্নার ব্যাজে নিখুঁতভাবে বসিয়ে উচ্চমানের জেপিজি ডাউনলোড করুন।',
      'vcard-qr': 'ছবি বা লোগো আপলোড করে ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য পূরণ করুন এবং আন্তর্জাতিক কার্ড অনুপাতে লাইভ প্রিভিউ ও জেপিজি/ভিসিএফ ডাউনলোড করুন।',
      'whatsapp-qr': 'ফোন নম্বর এবং প্রি-ফিল্ড মেসেজ দিয়ে সরাসরি হোয়াটসঅ্যাপ চ্যাট ওপেন করার কিউআর কোড তৈরি করুন।',
      'qr-designer': 'কিউআর কোডের ব্যাকগ্রাউন্ড, ফোরগ্রাউন্ড কালার, মার্জিন ও এরর কারেকশন লেভেল কাস্টমাইজ করুন।',
      'batch-qr': 'একসাথে একাধিক কিউআর কোড লিস্ট বা সিএসভি থেকে তৈরি করে জিপ ফাইলে ডাউনলোড করুন।',
      'qr-scanner': 'ডিভাইস ক্যামেরা বা আপলোড করা ছবি থেকে যেকোনো কিউআর কোড তাৎক্ষণিকভাবে স্ক্যান করুন।',
      'image-converter': 'জেপিজি, পিএনজি এবং ওয়েবপির মধ্যে দ্রুত এবং মান অক্ষুণ্ণ রেখে রূপান্তর করুন।',
      'jpg-to-png': 'কম্প্রেসড জেপিজি ছবিকে লচলেস পিএনজি ফরম্যাটে সরাসরি ব্রাউজারেই রূপান্তর করুন।',
      'png-to-jpg': 'স্বচ্ছ পিএনজি ছবিকে সুন্দর ব্যাকগ্রাউন্ড ফিলসহ হালকা জেপিজি ফাইলে রূপান্তর করুন।',
      'image-compressor': 'ছবির গুণমান নিখুঁত রেখে ফাইল সাইজ ৮০% পর্যন্ত কমিয়ে নিন।',
      'image-resizer': 'পিক্সেল মাত্রা এবং সোশ্যাল মিডিয়া প্রিসেট অনুযায়ী ছবির মাপ পরিবর্তন করুন।',
      'crop-rotate': 'স্ট্যান্ডার্ড অনুপাতে ক্রপ করুন, ঘড়ির কাঁটার দিকে ঘোরান এবং ফ্লিপ করুন।',
      'passport-photo': 'যুক্তরাষ্ট্র, যুক্তরাজ্য, শেঞ্জেন, ভারত, কানাডা ও ইউএইর সরকারি পাসপোর্ট ও ভিসা সাইজ ছবি তৈরি করুন।',
      'merge-pdf': 'একাধিক পিডিএফ ফাইলকে একটি সাজানো ডকুমেন্টে মার্জ করুন।',
      'split-pdf': 'নির্দিষ্ট পৃষ্ঠা বা পেজ রেঞ্জ আলাদা করে নতুন পিডিএফ ফাইল তৈরি করুন।',
      'images-to-pdf': 'একাধিক ছবিকে একটি পরিচ্ছন্ন প্রিন্ট-রেডি পিডিএফ ফাইলে রূপান্তর করুন।',
      'pdf-page-numbers': 'যেকোনো পিডিএফ ফাইলের প্রতিটি পৃষ্ঠায় স্টাইলিশ পেজ নম্বর যোগ করুন।',
      'watermark-pdf': 'পিডিএফ ডকুমেন্টে গোপনীয় বা অফিশিয়াল ওয়াটারমার্ক টেক্সট যোগ করুন।',
      'resume-maker': 'ছবি আপলোড, পেশাভিত্তিক এআই বায়ো জেনারেটর এবং আধুনিক ফরম্যাটসহ এটিএস-বান্ধব পেশাদার সিভি তৈরি করুন।',
      'ats-checker': 'চাকরির বিবরণের সাথে আপনার রেজুমের এটিএস স্কোর এবং কি-ওয়ার্ড বিশ্লেষণ করুন।',
      'job-tracker': 'আপনার চাকরির আবেদন ও ইন্টারভিউ প্রক্রিয়া একটি চমৎকার কানবান বোর্ডে ট্র্যাক করুন।',
      'json-formatter': 'জেসন টেক্সট সুন্দরভাবে সাজান, যাচাই করুন এবং স্ট্রাকচার অনুসন্ধান করুন।',
      'base64-tool': 'বেস৬৪ টেক্সট ও ফাইল এনকোড এবং ডিকোড করুন সম্পূর্ণ ক্লায়েন্ট সাইডে।',
      'timestamp-tool': 'ইউনিক্স টাইমস্ট্যাম্পকে বিশ্বব্যাপী স্থানীয় সময় ও তারিখে রূপান্তর করুন।',
      'password-gen': 'উচ্চ নিরাপত্তার পাসওয়ার্ড তৈরি করুন কাস্টম সিম্বল ও সংখ্যার সমন্বয়ে।',
      'unit-converter': 'দৈর্ঘ্য, ওজন, তাপমাত্রা, ডেটা এবং গতি এক নিমেষে রূপান্তর করুন।',
      'color-palette': 'যেকোনো ছবি থেকে চমৎকার কালার সোয়াচ এবং হেক্স কোড বের করুন।',
      'contrast-checker': 'ডব্লিউসিএজি ২.১ স্ট্যান্ডার্ড অনুযায়ী টেক্সট ও ব্যাকগ্রাউন্ডের কনট্রাস্ট যাচাই করুন।',
      'gradient-generator': 'আধুনিক লিনিয়ার ও রেডিয়াল সিএসএস গ্রেডিয়েন্ট তৈরি করুন এবং কোড কপি করুন।',
      'loan-calculator': 'মাসিক ইএমআই, মোট সুদ ও পরিশোধের তালিকা নিখুঁতভাবে হিসাব করুন।',
      'compound-interest': 'মাসিক বিনিয়োগের ওপর সময়ের সাথে চক্রবৃদ্ধি মুনাফার প্রবৃদ্ধি দেখুন।',
      'tip-calculator': 'রেস্তোরাঁর বিল বন্ধুদের মধ্যে সমানভাবে ভাগ করুন এবং টিপ হিসাব করুন।',
      'date-calculator': 'যেকোনো দুটি তারিখের মধ্যকার সঠিক দিন, সপ্তাহ ও মাসের ব্যবধান বের করুন।',
    },
  },

  ar: {
    appName: 'نوفا تولز',
    tagline: 'منصة الأدوات الذكية المباشرة عبر المتصفح',
    heroHeadline: 'أدوات رقمية سريعة وحقيقية في متصفحك مباشرة',
    heroSubheadline: 'تحويل الصور ومعالجة ملفات PDF وتوليد وتطريز رموز QR وإعداد السير الذاتية بأمان تام ودون إرسال بياناتك لخوادم خارجية.',
    searchPlaceholder: 'Search...',
    searchModalTitle: 'دليل أدوات نوفا تولز',
    noResultsFound: 'لم يتم العثور على أدوات تطابق بحثك.',
    privacyBadge: 'معالجة محلية ١٠٠٪ على جهازك',
    clientSideBadge: 'ملفاتك لا تغادر متصفحك أبداً',
    popularTools: 'الأدوات الأكثر استخداماً',
    allTools: 'دليل الأدوات الشامل',
    launchTool: 'تشغيل الأداة',
    filterPlaceholder: 'تصفية الأدوات في محطة العمل...',
    workstationToolsCount: 'أدوات تعمل محلياً بنسبة ١٠٠٪ في متصفحك.',
    advertisement: 'إعلان',
    cookieNotice: 'تستخدم نوفا تولز ملفات تعريف الارتباط الصديقة للخصوصية وإعلانات Google AdSense لتقديم خدمات مجانية دون جمع بياناتك الخاصة.',
    accept: 'موافق وإغلاق',
    categories: {
      all: 'جميع الأدوات',
      popular: 'شائعة',
      image: 'أدوات الصور',
      pdf: 'أدوات PDF',
      qr: 'رموز QR والتركيب',
      career: 'السيرة المهنية والبطاقات',
      utilities: 'أدوات عامة',
      design: 'أدوات التصميم',
      calculators: 'الآلات الحاسبة والمالية',
      ai: 'الذكاء الاصطناعي',
    },
    workstations: {
      qr: {
        name: 'محطة رموز QR وتطريز الصور',
        badge: 'استوديو QR',
        description: 'إنشاء رموز QR فائقة الدقة ودمجها بانسجام وتناسق مباشر كشعار ركني على الصور والملصقات بجودة عالية.',
        popularFeatures: ['دمج الصورة مع QR', 'رمز واي فاي', 'بطاقة vCard', 'واتساب المباشر', 'مولد الدفعات'],
      },
      image: {
        name: 'محطة معالجة الصور الرقمية',
        badge: 'استوديو الصور',
        description: 'تحويل الصور بين PNG وJPG وWebP، وضغط الحجم مع الحفاظ على الجودة، والقص وتوليد صور الجواز الرسمية.',
        popularFeatures: ['محول الصيغ', 'ضاغط الصور', 'تغيير الحجم والقص', 'صور الجوازات'],
      },
      pdf: {
        name: 'محطة المستندات وملفات PDF',
        badge: 'استوديو المستندات',
        description: 'دمج مستندات PDF المتعددة، وتقسيم واستخراج الصفحات، وتحويل الصور إلى PDF وإضافة العلامات المائية.',
        popularFeatures: ['دمج PDF', 'تقسيم المستندات', 'الصور إلى PDF', 'العلامة المائية والأرقام'],
      },
      career: {
        name: 'محطة السيرة المهنية والوظائف',
        badge: 'مركز المسار المهني',
        description: 'بناء سيرة ذاتية احترافية مع رفع الصورة الشخصية وتوليد نبذة مهنية ذكية حسب تخصصك بنظام ATS.',
        popularFeatures: ['صانع السيرة الذاتية بالصورة', 'مولد النبذة المهنية', 'فاحص توافق ATS', 'لوحة متابعة الوظائف'],
      },
      utilities: {
        name: 'محطة المطورين والأدوات العامة',
        badge: 'أدوات المطورين',
        description: 'تنسيق والتحقق من JSON، وتشفير وفك Base64 والروابط، وتحويل الطوابع الزمنية، وتوليد كلمات مرور قوية.',
        popularFeatures: ['منسق JSON', 'تشفير Base64', 'محول التوقيت', 'مولد كلمات المرور', 'محول الوحدات'],
      },
      design: {
        name: 'محطة التصميم والألوان',
        badge: 'استوديو الألوان',
        description: 'فحص التباين ومعايير إمكانية الوصول WCAG، واستخراج درجات الألوان من الصور، وبناء تدرجات CSS الحديثة.',
        popularFeatures: ['فاحص التباين', 'استخراج باليت الألوان', 'مولد تدرجات CSS'],
      },
      calculators: {
        name: 'محطة الحاسبات والمالية',
        badge: 'الحاسبات',
        description: 'حساب أقساط القروض والتمويل، ومعدل الفائدة التراكمية، وتقسيم الفواتير، وحساب الفترات الزمنية والتواريخ.',
        popularFeatures: ['حاسبة القروض والأقساط', 'الفائدة المركبة', 'تقسيم الفاتورة', 'فروق التواريخ'],
      },
    },
    actions: {
      back: 'رجوع',
      upload: 'اختر ملفاً',
      dragDrop: 'اسحب الملف وأفلته هنا، أو انقر للاستعراض',
      browse: 'استعراض الملفات',
      process: 'بدء المعالجة',
      processing: 'جاري المعالجة...',
      download: 'تحميل النتيجة',
      reset: 'إعادة ضبط',
      copy: 'نسخ إلى الحافظة',
      copied: 'تم النسخ!',
      options: 'خيارات الأداة',
      preview: 'معاينة فورية',
      result: 'النتيجة الجاهزة',
      remove: 'إزالة',
      apply: 'تطبيق التغييرات',
      openLink: 'فتح الرابط بأمان',
    },
    toolLabels: {
      format: 'صيغة الإخراج',
      quality: 'جودة الصورة',
      width: 'العرض (بكسل)',
      height: 'الارتفاع (بكسل)',
      maintainAspect: 'الحفاظ على تناسق الأبعاد',
      originalSize: 'الحجم الأصلي',
      outputSize: 'الحجم الناتج',
      reduction: 'نسبة تقليص الحجم',
      overlayPosition: 'موضع رمز QR على الصورة',
      safeMargin: 'هامش الأمان للقراءة',
      qrSize: 'حجم رمز QR',
      qrData: 'بيانات رمز QR',
      qrDataPlaceholder: 'أدخل الرابط أو النص أو رقم الهاتف...',
      photoInput: 'ارفع الصورة الأساسية',
      scanabilityGood: 'فحص القراءة: وضوح وتناسق ممتاز للمسح الضوئي.',
      scanabilityWarning: 'تنبيه: حجم الرمز أو الهامش قد يؤثر على سرعة القراءة في بعض الهواتف.',
      selectProfession: 'اختر التخصص / المهنة',
      generateBio: 'توليد نبذة مهنية ذكية',
      uploadPhoto: 'رفع الصورة الشخصية',
    },
    nav: {
      home: 'الرئيسية',
      tools: 'الأدوات',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      about: 'عن المنصة',
      contact: 'اتصل بنا',
      disclaimer: 'إخلاء المسؤولية',
    },
    footer: {
      rights: 'جميع الحقوق محفوظة.',
      privacyNotice: 'تتم كافة عمليات المعالجة داخل متصفحك محلياً لضمان أقصى درجات الخصوصية وحماية بياناتك.',
      legal: 'الخصوصية والثقة',
      quickLinks: 'روابط سريعة',
      madeForWeb: 'صُمم خصيصاً للسرعة والأمان وسهولة الاستخدام.',
    },
    toolTitles: {
      'photo-qr-overlay': 'دمج الصورة مع رمز QR (الكل في واحد)',
      'vcard-qr': 'مولد بطاقات الأعمال vCard',
      'whatsapp-qr': 'رمز QR للمحادثة المباشرة على واتساب',
      'qr-designer': 'مصمم رموز QR المخصص',
      'batch-qr': 'توليد دفعات رموز QR المتعددة',
      'qr-scanner': 'ماسح رموز QR بالكاميرا والملفات',
      'image-converter': 'محول صيغ الصور الشامل',
      'jpg-to-png': 'تحويل من JPG إلى PNG',
      'png-to-jpg': 'تحويل من PNG إلى JPG',
      'image-compressor': 'ضاغط الصور الفائق بدون فقدان جودة',
      'image-resizer': 'مغير أبعاد ومقاسات الصور',
      'crop-rotate': 'قص وتدوير وقلب الصور',
      'passport-photo': 'صانع صور الجوازات والتأشيرات الرسمية',
      'merge-pdf': 'دمج مستندات PDF متعددة',
      'split-pdf': 'تقسيم واستخراج صفحات PDF',
      'images-to-pdf': 'تحويل الصور إلى مستند PDF',
      'pdf-page-numbers': 'ترقيم صفحات ملف PDF',
      'watermark-pdf': 'إضافة علامة مائية لملف PDF',
      'resume-maker': 'صانع السيرة الذاتية الاحترافية بالصورة',
      'ats-checker': 'محلل توافق السيرة الذاتية مع أنظمة ATS',
      'job-tracker': 'لوحة تتبع طلبات التوظيف كانبان',
      'json-formatter': 'منسق وفاحص ملفات JSON',
      'base64-tool': 'مشفر ومفكك Base64 والروابط',
      'timestamp-tool': 'محول التوقيت والطوابع الزمنية Unix',
      'password-gen': 'مولد كلمات المرور الآمنة',
      'unit-converter': 'محول الوحدات الهندسية والفيزيائية',
      'color-palette': 'مستخرج باليت وتدرجات الألوان من الصور',
      'contrast-checker': 'فاحص تباين الألوان لمعايير WCAG',
      'gradient-generator': 'استوديو توليد تدرجات ألوان CSS',
      'loan-calculator': 'حاسبة أقساط القروض والتمويل العقاري',
      'compound-interest': 'حاسبة العائد التراكمي والفائدة المركبة',
      'tip-calculator': 'حاسبة الإكراميات وتقسيم الفواتير',
      'date-calculator': 'حاسبة الفترات الزمنية وفروق التواريخ',
    },
    toolDescriptions: {
      'photo-qr-overlay': 'ارفع صورتك واختر الرابط أو الواي فاي أو بطاقة العمل وضع رمز QR في الركن المطلوب ونزل صورة عالية الدقة فوراً.',
      'vcard-qr': 'ارفع صورتك أو شعارك وأدخل بيانات الاتصال للحصول على بطاقة أعمال قياسية ومعاينة فورية وتنزيل JPG أو VCF.',
      'whatsapp-qr': 'أنشئ رمز QR يفتح محادثة واتساب مباشرة برقمك ونص الرسالة الجاهزة.',
      'qr-designer': 'خصص ألوان الواجهة والخلفية وهوامش الأمان ومستويات تصحيح الأخطاء لرمز QR.',
      'batch-qr': 'قم بإنشاء عشرات الرموز من القوائم أو ملفات CSV وتنزيلها دفعة واحدة كملف ZIP.',
      'qr-scanner': 'امسح رموز QR عبر كاميرا جهازك أو ارفع صورة ليتم فكها مع فحص أمان الروابط.',
      'image-converter': 'تحويل فوري فائق السرعة بين JPG وPNG وWebP دون فقدان الجودة.',
      'jpg-to-png': 'تحويل صور JPEG المضغوطة إلى صيغة PNG الدقيقة مباشرة داخل متصفحك.',
      'png-to-jpg': 'تحويل صور PNG الشفافة إلى صور JPG مضغوطة وأنيقة مع تعبئة الخلفية.',
      'image-compressor': 'تقليل حجم الصور حتى ٨٠٪ مع الحفاظ على وضوح التفاصيل الكامل.',
      'image-resizer': 'تعديل أبعاد الصور بالبكسل مع قفل النسبة وتوفير مقاسات شبكات التواصل.',
      'crop-rotate': 'قص الصور بالنسب القياسية وتدويرها ٩٠ درجة أو قلبها أفقياً ورأسياً.',
      'passport-photo': 'تجهيز صور الجوازات والتأشيرات الرسمية لأمريكا وبريطانيا وأوروبا والهند وكندا والإمارات.',
      'merge-pdf': 'دمج ملفات PDF متعددة في مستند واحد مرتب مع إمكانية إعادة ترتيب الصفحات بالسحب.',
      'split-pdf': 'استخراج صفحات أو نطاقات محددة من ملف PDF إلى مستند جديد ومستقل.',
      'images-to-pdf': 'تجميع مجموعة صور متعددة وتحويلها إلى مستند PDF عالي الجودة للطباعة.',
      'pdf-page-numbers': 'إضافة أرقام الصفحات بتنسيق أنيق في الهامش العلوي أو السفلي لملفات PDF.',
      'watermark-pdf': 'إضافة علامات مائية نصية مائلة أو أفقية على صفحات المستند مع التحكم بالشفافية.',
      'resume-maker': 'تصميم سيرة ذاتية عصرية متوافقة مع ATS مع رفع الصورة الشخصية وتوليد نبذة مهنية ذكية.',
      'ats-checker': 'تحليل توافق سيرتك الذاتية مع أنظمة الفرز الآلي للوظائف واقتراح التحسينات.',
      'job-tracker': 'متابعة مراحل تقديمك للوظائف والمقابلات في لوحة كانبان منظمة ومحفوظة محلياً.',
      'json-formatter': 'تنسيق وفحص نصوص JSON وتصحيح الأخطاء واستعراض شجرة البيانات.',
      'base64-tool': 'تشفير وفك تشفير سلاسل Base64 والملفات وعناوين الويب بأمان تام.',
      'timestamp-tool': 'تحويل طوابع Unix الزمنية إلى تواريخ مقروءة بجميع التوقيتات العالمية.',
      'password-gen': 'إنشاء كلمات مرور فائقة القوة بتخصيص الطول والرموز والأرقام.',
      'unit-converter': 'تحويل دقيق لوحدات الطول والكتلة والحرارة والبيانات والسرعة والمساحة.',
      'color-palette': 'استخراج درجات الألوان السائدة ورموز Hex مباشرة من أي صورة ترفعها.',
      'contrast-checker': 'حساب نسب التباين ومعايير WCAG للوصول السهل بين النصوص والخلفيات.',
      'gradient-generator': 'تصميم تدرجات CSS الخطية والشعاعية ونسخ الشفرة البرمجية بضغطة زر.',
      'loan-calculator': 'حساب القسط الشهري للقروض وإجمالي الفوائد وجدول الإهلاك التمويلي.',
      'compound-interest': 'توقع نمو استثماراتك ومدخراتك مع الفائدة المركبة على مدار السنوات.',
      'tip-calculator': 'حساب نسب الإكرامية وتقسيم الفواتير بالتساوي بين الأصدقاء بسهولة.',
      'date-calculator': 'حساب الفروق الدقيقة بالأيام والأسابيع والشهور بين أي تاريخين.',
    },
  },
};

/**
 * Helper to get localized tool name
 */
export const getLocalizedToolName = (toolId: string, fallbackName: string, lang: Language): string => {
  const dict = translations[lang] || translations.en;
  return dict.toolTitles[toolId] || fallbackName;
};

/**
 * Helper to get localized tool description
 */
export const getLocalizedToolDesc = (toolId: string, fallbackDesc: string, lang: Language): string => {
  const dict = translations[lang] || translations.en;
  return dict.toolDescriptions[toolId] || fallbackDesc;
};
