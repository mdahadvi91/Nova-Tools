import { ToolCategory, LegalPageType, NavigationState } from '../types';
import { TOOLS, CATEGORIES } from '../data/tools';

export const VALID_LEGAL_PAGES: LegalPageType[] = ['privacy', 'terms', 'disclaimer', 'about', 'contact'];

/**
 * Common search-intent slug aliases mapping to canonical tool IDs.
 * Enables friendly URLs like /qr-code-generator, /base64-encoder, /merge-pdf, etc.
 */
export const TOOL_SLUG_ALIASES: Record<string, string> = {
  // QR Tools
  'qr-code-generator': 'photo-qr-overlay',
  'qr-generator': 'photo-qr-overlay',
  'qr-photo-overlay': 'photo-qr-overlay',
  'qr-code-scanner': 'qr-scanner',
  'qr-code-reader': 'qr-scanner',
  'qr-code-designer': 'qr-designer',
  'custom-qr-code': 'qr-designer',
  'vcard-qr-generator': 'vcard-qr',
  'business-card-qr': 'vcard-qr',
  'whatsapp-qr-generator': 'whatsapp-qr',
  'whatsapp-link': 'whatsapp-qr',
  'bulk-qr-generator': 'batch-qr',
  'batch-qr-code': 'batch-qr',

  // Image Tools
  'jpg-to-png-converter': 'jpg-to-png',
  'jpeg-to-png': 'jpg-to-png',
  'png-to-jpg-converter': 'png-to-jpg',
  'png-to-jpeg': 'png-to-jpg',
  'compress-image': 'image-compressor',
  'photo-compressor': 'image-compressor',
  'resize-image': 'image-resizer',
  'photo-resizer': 'image-resizer',
  'crop-image': 'image-cropper',
  'rotate-image': 'image-rotator',
  'flip-image': 'image-rotator',
  'convert-image': 'image-converter',

  // PDF Tools
  'merge-pdf': 'pdf-merge',
  'combine-pdf': 'pdf-merge',
  'split-pdf': 'pdf-split',
  'extract-pdf-pages': 'pdf-split',
  'images-to-pdf': 'image-to-pdf',
  'photos-to-pdf': 'image-to-pdf',
  'jpg-to-pdf': 'image-to-pdf',
  'rotate-pdf': 'pdf-rotate',
  'reorder-pdf': 'pdf-page-manager',
  'compress-pdf-file': 'pdf-compressor',

  // Developer & Utility Tools
  'base64-encoder': 'base64-converter',
  'base64-decoder': 'base64-converter',
  'json-prettifier': 'json-formatter',
  'json-beautifier': 'json-formatter',
  'url-decoder': 'url-encoder',
  'hash-generator': 'hash-tool',
  'md5-generator': 'hash-tool',
  'sha256-generator': 'hash-tool',
  'html-entity-encoder': 'html-entities',
  'html-entity-decoder': 'html-entities',
  'jwt-decoder': 'jwt-inspector',
  'regex-tester': 'regex-tester',
  'markdown-editor': 'markdown-live',

  // Career Tools
  'ats-resume-builder': 'resume-builder',
  'cv-builder': 'resume-builder',
  'resume-maker': 'resume-builder',
  'resume-scanner': 'ats-checker',
  'ats-checker-tool': 'ats-checker',
  'resume-bullet-improver': 'bullet-improver',
  'interview-question-generator': 'interview-prep',

  // Calculators & Design
  'color-picker-tool': 'color-palettes',
  'palette-generator': 'color-palettes',
  'contrast-ratio-checker': 'contrast-checker',
  'wcag-contrast-checker': 'contrast-checker',
  'percentage-calculator-tool': 'percentage-calc',
  'age-calculator-tool': 'age-calc',
  'loan-calculator-tool': 'loan-calc',
  'bmi-calculator-tool': 'bmi-calc',
};

/**
 * Resolves a raw URL path/slug to a valid tool definition ID if one exists.
 */
export function resolveToolIdFromSlug(slug: string): string | null {
  const clean = slug.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
  if (!clean) return null;

  // Direct exact match with tool.id
  const directMatch = TOOLS.find((t) => t.id === clean);
  if (directMatch) return directMatch.id;

  // Alias lookup
  if (TOOL_SLUG_ALIASES[clean]) {
    const aliasedId = TOOL_SLUG_ALIASES[clean];
    const match = TOOLS.find((t) => t.id === aliasedId);
    if (match) return match.id;
  }

  return null;
}

/**
 * Resolves a raw category slug
 */
export function resolveCategoryFromSlug(slug: string): ToolCategory | null {
  const clean = slug.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
  if (!clean) return null;

  if (clean === 'popular') return 'popular';
  const match = CATEGORIES.find((c) => c.id === clean);
  return match ? match.id : null;
}

/**
 * Returns canonical SEO URL path for a tool
 */
export function getToolUrl(toolId: string): string {
  return `/${encodeURIComponent(toolId)}`;
}

/**
 * Returns canonical SEO URL path for a category
 */
export function getCategoryUrl(category: ToolCategory): string {
  return `/category/${encodeURIComponent(category)}`;
}

/**
 * Returns canonical SEO URL path for a legal page
 */
export function getLegalUrl(page: LegalPageType): string {
  return `/${encodeURIComponent(page)}`;
}

/**
 * Parses current window location into a NavigationState, supporting:
 * 1. Clean paths: /jpg-to-png, /category/image, /privacy
 * 2. Slug aliases: /qr-code-generator, /base64-encoder
 * 3. Legacy query params: ?tool=jpg-to-png, ?category=image, ?legal=privacy
 * 4. Hash fallback: #tool/jpg-to-png
 */
export function parseCurrentUrl(): NavigationState {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }

  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, '');

  // 1. Query Parameter Handling (Backwards compatibility)
  const queryTool = searchParams.get('tool');
  if (queryTool) {
    const resolved = resolveToolIdFromSlug(queryTool);
    if (resolved) return { view: 'tool', toolId: resolved };
    return { view: '404', toolId: queryTool };
  }

  const queryCat = searchParams.get('category');
  if (queryCat) {
    const resolvedCat = resolveCategoryFromSlug(queryCat);
    if (resolvedCat) return { view: 'category', category: resolvedCat };
    return { view: '404' };
  }

  const queryLegal = searchParams.get('legal');
  if (queryLegal) {
    const cleanLegal = queryLegal.toLowerCase().trim() as LegalPageType;
    if (VALID_LEGAL_PAGES.includes(cleanLegal)) {
      return { view: 'legal', legalPage: cleanLegal };
    }
    return { view: '404' };
  }

  // 2. Hash-based fallback (#tool/id, #category/id, #legal/id)
  if (hash) {
    if (hash.startsWith('tool/')) {
      const slug = hash.replace(/^tool\//, '');
      const resolved = resolveToolIdFromSlug(slug);
      if (resolved) return { view: 'tool', toolId: resolved };
      return { view: '404', toolId: slug };
    }
    if (hash.startsWith('category/')) {
      const slug = hash.replace(/^category\//, '');
      const resolvedCat = resolveCategoryFromSlug(slug);
      if (resolvedCat) return { view: 'category', category: resolvedCat };
      return { view: '404' };
    }
    if (hash.startsWith('legal/')) {
      const slug = hash.replace(/^legal\//, '') as LegalPageType;
      if (VALID_LEGAL_PAGES.includes(slug)) return { view: 'legal', legalPage: slug };
      return { view: '404' };
    }
  }

  // 3. Root Path
  if (!pathname) {
    return { view: 'home' };
  }

  // 4. Category Route (/category/image, /category/pdf, etc.)
  if (pathname.startsWith('category/')) {
    const catSlug = pathname.replace(/^category\//, '');
    const resolvedCat = resolveCategoryFromSlug(catSlug);
    if (resolvedCat) return { view: 'category', category: resolvedCat };
    return { view: '404' };
  }

  // 5. Legal Route (/privacy, /terms, /about, /contact, /disclaimer)
  if (VALID_LEGAL_PAGES.includes(pathname as LegalPageType)) {
    return { view: 'legal', legalPage: pathname as LegalPageType };
  }

  // 6. Direct Tool Route (e.g. /jpg-to-png, /pdf-merge, /qr-code-generator)
  const resolvedTool = resolveToolIdFromSlug(pathname);
  if (resolvedTool) {
    return { view: 'tool', toolId: resolvedTool };
  }

  // 7. Unknown route -> 404
  return { view: '404', toolId: pathname };
}
