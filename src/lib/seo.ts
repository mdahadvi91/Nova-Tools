import { Language, ToolCategory } from '../types';
import { TOOLS, CATEGORIES } from '../data/tools';
import { getLocalizedToolName, getLocalizedToolDesc } from '../i18n/translations';
import { getToolSeoContent } from '../data/toolSeoContent';
import { getToolUrl, getCategoryUrl, getLegalUrl } from './routes';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  is404?: boolean;
  ogType?: 'website' | 'article';
  toolId?: string;
  category?: ToolCategory;
  legalPage?: string;
  language?: Language;
}

const DEFAULT_TITLE = 'Nova Tools - Free Privacy-First Online Utility Platform';
const DEFAULT_DESCRIPTION =
  'Free, 100% client-side privacy-first online tools for image conversion, PDF merge & split, QR code styling & photo overlay, ATS resume building, and developer utilities.';
const DEFAULT_KEYWORDS = [
  'nova tools',
  'online tools',
  'free utilities',
  'client-side',
  'privacy-first',
  'photo qr overlay',
  'pdf tools',
  'image converter',
  'ats resume builder',
  'json formatter',
];

/**
 * Utility to get current base origin safely (Vercel, custom domain, or browser origin)
 */
export function getSiteOrigin(): string {
  // 1. Browser runtime: dynamically uses the live Vercel URL or custom domain
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  // 2. Client-side Vite environment variable if set
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : null;
  if (metaEnv && metaEnv.VITE_SITE_URL) {
    return (metaEnv.VITE_SITE_URL as string).replace(/\/+$/, '');
  }
  // 3. Node / Vercel runtime environment variables
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.SITE_URL) {
      return process.env.SITE_URL.replace(/\/+$/, '');
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, '')}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
    }
  }
  return 'https://nova-tools.vercel.app';
}

/**
 * Set or update a <meta> tag in the document <head>
 */
function setMetaTag(selectorKey: string, selectorValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${selectorKey}="${selectorValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(selectorKey, selectorValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Set or update a <link> tag in the document <head>
 */
function setLinkTag(rel: string, href: string, attributes: Record<string, string> = {}) {
  if (typeof document === 'undefined') return;
  let selector = `link[rel="${rel}"]`;
  if (attributes.hreflang) {
    selector += `[hreflang="${attributes.hreflang}"]`;
  }
  let element = document.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  Object.entries(attributes).forEach(([key, val]) => {
    element!.setAttribute(key, val);
  });
}

/**
 * Set JSON-LD structured data script
 */
function setStructuredData(id: string, jsonContent: object) {
  if (typeof document === 'undefined') return;
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonContent);
}

/**
 * Remove an element by id from document
 */
function removeElementById(id: string) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Core SEO updater function called whenever active route, tool, or language changes
 */
export function updateSeo(config: SeoConfig) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const origin = getSiteOrigin();
  const lang = config.language || 'en';

  // 1. Determine Titles, Descriptions & Canonical Path
  let pageTitle = DEFAULT_TITLE;
  let pageDescription = DEFAULT_DESCRIPTION;
  let pageKeywords = [...DEFAULT_KEYWORDS];
  let canonicalPath = '/';
  let breadcrumbItems = [
    {
      name: 'Home',
      url: `${origin}/`,
    },
  ];
  let activeToolFaqs: Array<{ question: string; answer: string }> = [];

  if (config.is404) {
    pageTitle = '404 - Page or Tool Not Found | Nova Tools';
    pageDescription = 'The requested tool or page could not be found. Explore our 45+ privacy-first utility tools.';
    canonicalPath = window.location.pathname;
  } else if (config.toolId) {
    const tool = TOOLS.find((t) => t.id === config.toolId);
    if (tool) {
      const locName = getLocalizedToolName(tool.id, tool.name, lang);
      const locDesc = getLocalizedToolDesc(tool.id, tool.description, lang);
      const catDef = CATEGORIES.find((c) => c.id === tool.category);
      const catName = catDef?.nameKey || tool.category.toUpperCase();

      const seoData = getToolSeoContent(tool.id, locName, locDesc, tool.category);
      activeToolFaqs = seoData.faqs;

      pageTitle = seoData.metaTitle;
      pageDescription = seoData.metaDescription;
      pageKeywords = [
        tool.name.toLowerCase(),
        locName.toLowerCase(),
        ...tool.keywords,
        tool.category,
        'free online tool',
        'client-side',
      ];
      canonicalPath = getToolUrl(tool.id);

      breadcrumbItems.push(
        {
          name: `${catName} Tools`,
          url: `${origin}${getCategoryUrl(tool.category)}`,
        },
        {
          name: locName,
          url: `${origin}${getToolUrl(tool.id)}`,
        }
      );
    }
  } else if (config.category) {
    const catDef = CATEGORIES.find((c) => c.id === config.category);
    const catName = catDef?.nameKey || config.category.toUpperCase();
    pageTitle = `${catName} Tools - Free Online Suite | Nova Tools`;
    pageDescription = `Collection of fast, privacy-focused ${catName.toLowerCase()} tools. Process files locally in your browser without uploading data to external servers.`;
    pageKeywords = [config.category, `${config.category} tools`, 'privacy tools', 'nova tools'];
    canonicalPath = getCategoryUrl(config.category);

    breadcrumbItems.push({
      name: `${catName} Tools`,
      url: `${origin}${getCategoryUrl(config.category)}`,
    });
  } else if (config.legalPage) {
    const legalName = config.legalPage.charAt(0).toUpperCase() + config.legalPage.slice(1);
    pageTitle = `${legalName} Policy | Nova Tools`;
    pageDescription = `Read the official ${legalName.toLowerCase()} documentation and legal guidelines for Nova Tools privacy platform.`;
    canonicalPath = getLegalUrl(config.legalPage as any);

    breadcrumbItems.push({
      name: legalName,
      url: `${origin}${getLegalUrl(config.legalPage as any)}`,
    });
  }

  // 2. Set Document Title
  document.title = pageTitle;

  // 3. Set Primary HTML Meta Tags
  setMetaTag('name', 'description', pageDescription);
  setMetaTag('name', 'keywords', pageKeywords.join(', '));
  setMetaTag('name', 'author', 'Nova Tools Team');

  // Accidental noindex prevention: only 404 pages get noindex
  if (config.is404) {
    setMetaTag('name', 'robots', 'noindex, follow');
  } else {
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // 4. Set Canonical Link Tag
  const fullCanonicalUrl = `${origin}${canonicalPath}`;
  setLinkTag('canonical', fullCanonicalUrl);

  // 5. Set Hreflang Alternate Links
  const languages: { code: Language; hreflang: string }[] = [
    { code: 'en', hreflang: 'en' },
    { code: 'bn', hreflang: 'bn' },
    { code: 'ar', hreflang: 'ar' },
  ];
  languages.forEach((item) => {
    // English is the default clean URL; other languages append their query parameter for distinct indexable targets
    const langUrl =
      item.code === 'en'
        ? fullCanonicalUrl
        : `${fullCanonicalUrl}${canonicalPath.includes('?') ? '&' : '?'}lang=${item.code}`;
    setLinkTag('alternate', langUrl, { hreflang: item.hreflang });
  });
  setLinkTag('alternate', fullCanonicalUrl, { hreflang: 'x-default' });

  // 6. Set Open Graph Metadata
  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', pageDescription);
  setMetaTag('property', 'og:url', fullCanonicalUrl);
  setMetaTag('property', 'og:type', config.ogType || 'website');
  setMetaTag('property', 'og:site_name', 'Nova Tools');
  const ogLocaleMap: Record<Language, string> = {
    en: 'en_US',
    bn: 'bn_BD',
    ar: 'ar_AR',
  };
  setMetaTag('property', 'og:locale', ogLocaleMap[lang] || 'en_US');
  setMetaTag('property', 'og:image', `${origin}/assets/background.jpg`);

  // 7. Set Twitter / X Metadata
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', pageDescription);
  setMetaTag('name', 'twitter:image', `${origin}/assets/background.jpg`);

  // 8. Inject Schema.org Structured Data
  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nova Tools',
    url: `${origin}/`,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nova Tools',
      url: `${origin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/assets/background.jpg`,
      },
    },
  };
  setStructuredData('nova-schema-website', websiteSchema);

  // Tool Specific Schema (SoftwareApplication / WebApplication)
  // Compliant with Google guidelines: No fake aggregateRating without real user reviews
  if (config.toolId && !config.is404) {
    const tool = TOOLS.find((t) => t.id === config.toolId);
    if (tool) {
      const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        description: tool.description,
        url: fullCanonicalUrl,
        applicationCategory: getApplicationCategory(tool.category),
        operatingSystem: 'All (Web Browser, Client-side)',
        browserRequirements: 'Requires modern browser with HTML5 support',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: tool.keywords.join(', '),
      };
      setStructuredData('nova-schema-tool', toolSchema);

      // FAQPage Schema for Google Rich Snippets
      if (activeToolFaqs.length > 0) {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: activeToolFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };
        setStructuredData('nova-schema-faq', faqSchema);
      } else {
        removeElementById('nova-schema-faq');
      }
    }
  } else {
    removeElementById('nova-schema-tool');
    removeElementById('nova-schema-faq');
  }

  // BreadcrumbList Schema
  if (breadcrumbItems.length > 1) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
    setStructuredData('nova-schema-breadcrumbs', breadcrumbSchema);
  } else {
    removeElementById('nova-schema-breadcrumbs');
  }
}

function getApplicationCategory(cat: ToolCategory): string {
  switch (cat) {
    case 'image':
    case 'design':
      return 'MultimediaApplication';
    case 'pdf':
    case 'career':
      return 'BusinessApplication';
    case 'calculators':
      return 'FinanceApplication';
    case 'utilities':
    case 'qr':
    default:
      return 'UtilitiesApplication';
  }
}
