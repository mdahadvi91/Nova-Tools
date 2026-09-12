/**
 * Nova Tools - Analytics & Google Consent Mode v2 Engine
 * GA4 Measurement ID: G-N4MHBT57FE
 * AdSense Publisher: ca-pub-5216241068377334
 */

export const GA_MEASUREMENT_ID = 'G-NPEXBRERPT';
export const ADSENSE_CLIENT_ID = 'ca-pub-5216241068377334';
export const CONSENT_STORAGE_KEY = 'nova_consent_settings';

export interface ConsentSettings {
  necessary: boolean; // Always true
  analytics: boolean; // GA4 analytics_storage
  advertising: boolean; // AdSense ad_storage, ad_user_data, ad_personalization
  timestamp: string;
  version: number;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    adsbygoogle?: any[];
  }
}

// Retrieve stored consent from localStorage
export function getStoredConsent(): ConsentSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'analytics' in parsed) {
      return parsed as ConsentSettings;
    }
  } catch (err) {
    console.warn('[Analytics] Failed to read stored consent:', err);
  }
  return null;
}

// Apply Google Consent Mode v2 update to gtag
export function updateGoogleConsent(settings: ConsentSettings): void {
  if (typeof window === 'undefined') return;

  const analyticsState = settings.analytics ? 'granted' : 'denied';
  const advertisingState = settings.advertising ? 'granted' : 'denied';

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: analyticsState,
      ad_storage: advertisingState,
      ad_user_data: advertisingState,
      ad_personalization: advertisingState,
    });
  }

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('[Analytics] Failed to persist consent settings:', err);
  }

  // Notify components of consent changes
  window.dispatchEvent(
    new CustomEvent('nova:consent-updated', {
      detail: settings,
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Analytics] Consent updated:', {
      analytics_storage: analyticsState,
      ad_storage: advertisingState,
      ad_user_data: advertisingState,
      ad_personalization: advertisingState,
    });
  }
}

// Open CMP modal event emitter
export function openConsentPreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('nova:open-consent-modal'));
}

// Internal safe event dispatcher
function sendGaEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  // Check if consent has been rejected
  const consent = getStoredConsent();
  if (consent && consent.analytics === false) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] Event "${eventName}" suppressed (analytics consent denied)`);
    }
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics:Event] ${eventName}`, params);
  }
}

// 1. Virtual SPA page view tracking
export function trackPageView(pageTitle: string, pagePath: string, pageLocation?: string): void {
  const loc = pageLocation || (typeof window !== 'undefined' ? window.location.href : '');
  sendGaEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: loc,
    send_to: GA_MEASUREMENT_ID,
  });
}

// 2. Tool Open event
export function trackToolOpen(toolId: string, toolName: string, category: string): void {
  sendGaEvent('tool_open', {
    tool_id: toolId,
    tool_name: toolName,
    category: category,
  });
}

// 3. Tool Complete event (e.g. compression finished, merge generated, photo processed)
export function trackToolComplete(toolId: string, actionType: string): void {
  sendGaEvent('tool_complete', {
    tool_id: toolId,
    action_type: actionType,
  });
}

// 4. Tool Download event (e.g. downloaded converted PDF, PNG, QR card)
export function trackToolDownload(toolId: string, fileType: string, fileName?: string): void {
  sendGaEvent('tool_download', {
    tool_id: toolId,
    file_type: fileType,
    file_name: fileName || 'download',
  });
}

// 5. File Upload event
export function trackFileUpload(toolId: string, fileType: string, fileSize?: number): void {
  sendGaEvent('file_upload', {
    tool_id: toolId,
    file_type: fileType,
    file_size_bytes: fileSize || 0,
  });
}

// 6. Search event
export function trackSearch(searchTerm: string, resultsCount: number): void {
  if (!searchTerm.trim()) return;
  sendGaEvent('search', {
    search_term: searchTerm.trim(),
    results_count: resultsCount,
  });
}

// 7. Category Open event
export function trackCategoryOpen(categoryId: string, categoryName: string): void {
  sendGaEvent('category_open', {
    category_id: categoryId,
    category_name: categoryName,
  });
}

// 8. Language Change event
export function trackLanguageChange(previousLang: string, newLang: string): void {
  sendGaEvent('language_change', {
    previous_language: previousLang,
    new_language: newLang,
  });
}

// 9. Global listener for tool downloads and user completion actions
export function initGlobalAnalyticsListeners(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // A. Detect native anchor downloads
    const downloadAnchor = target.closest('a[download]') as HTMLAnchorElement | null;
    if (downloadAnchor) {
      const fileName = downloadAnchor.getAttribute('download') || 'file';
      const fileExt = fileName.split('.').pop() || 'unknown';
      const urlParams = new URLSearchParams(window.location.search);
      const toolId = urlParams.get('tool') || 'active_tool';
      trackToolDownload(toolId, fileExt, fileName);
      trackToolComplete(toolId, 'download');
      return;
    }

    // B. Detect tool execution/download button clicks
    const button = target.closest('button');
    if (button) {
      const text = (button.innerText || button.textContent || '').toLowerCase().trim();
      const urlParams = new URLSearchParams(window.location.search);
      const toolId = urlParams.get('tool');
      if (toolId) {
        if (text.includes('download') || text.includes('export') || text.includes('save')) {
          trackToolComplete(toolId, 'download_clicked');
        } else if (
          text.includes('convert') ||
          text.includes('compress') ||
          text.includes('generate') ||
          text.includes('merge') ||
          text.includes('apply') ||
          text.includes('process')
        ) {
          trackToolComplete(toolId, 'process_action');
        }
      }
    }
  };

  document.addEventListener('click', handleGlobalClick, true);
  return () => {
    document.removeEventListener('click', handleGlobalClick, true);
  };
}

