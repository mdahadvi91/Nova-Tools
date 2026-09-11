import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Theme, ToolCategory, ActiveView, LegalPageType, NavigationState } from '../types';
import { translations, TranslationDictionary } from '../i18n/translations';
import { TOOLS, CATEGORIES } from '../data/tools';
import {
  trackPageView,
  trackToolOpen,
  trackCategoryOpen,
  trackLanguageChange,
} from '../lib/analytics';
import { updateSeo } from '../lib/seo';
import {
  parseCurrentUrl,
  getToolUrl,
  getCategoryUrl,
  getLegalUrl,
  VALID_LEGAL_PAGES,
} from '../lib/routes';

export type { ActiveView, LegalPageType, NavigationState };

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  t: TranslationDictionary;
  navState: NavigationState;
  navigateToHome: () => void;
  navigateToTool: (toolId: string) => void;
  navigateToCategory: (category: ToolCategory) => void;
  navigateToLegal: (legalPage: LegalPageType) => void;
  navigateBack: () => void;
  favorites: string[];
  recentTools: string[];
  toggleFavorite: (toolId: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
  openLeftSidebar: () => void;
  openRightSidebar: () => void;
  closeAllSidebars: () => void;
  customBg: string | null;
  setCustomBg: (bg: string | null) => void;
  saveAsDefaultBackground: (bgToSave?: string | null) => Promise<boolean>;
  isSavingDefaultBg: boolean;
  hasServerDefaultBg: boolean;
  defaultBgTimestamp: number;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nova_lang') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('nova_theme') as Theme) || 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(false);
  const [navState, setNavState] = useState<NavigationState>(parseCurrentUrl);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isSavingDefaultBg, setIsSavingDefaultBg] = useState(false);
  const [hasServerDefaultBg, setHasServerDefaultBg] = useState(false);
  const [defaultBgTimestamp, setDefaultBgTimestamp] = useState<number>(() => Date.now());
  const [customBg, setCustomBgState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nova_custom_bg') || null;
    } catch {
      return null;
    }
  });

  // Function to permanently save an image as site default on the server
  const saveAsDefaultBackground = async (bgToSave?: string | null): Promise<boolean> => {
    const targetBg = bgToSave !== undefined ? bgToSave : customBg;
    if (!targetBg || !targetBg.startsWith('data:image')) {
      return false;
    }

    setIsSavingDefaultBg(true);
    try {
      const res = await fetch('/api/set-default-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: targetBg }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasServerDefaultBg(true);
        setDefaultBgTimestamp(Date.now());
        localStorage.setItem('nova_default_bg_saved', 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Failed to save default background to server:', err);
      return false;
    } finally {
      setIsSavingDefaultBg(false);
    }
  };

  const setCustomBg = (bg: string | null) => {
    setCustomBgState(bg);
    try {
      if (bg) {
        localStorage.setItem('nova_custom_bg', bg);
        // Automatically save as permanent default on server as well
        saveAsDefaultBackground(bg);
      } else {
        localStorage.removeItem('nova_custom_bg');
      }
    } catch {
      // storage quota
    }
  };

  // On initial mount:
  // 1. If user previously uploaded a background photo in their browser, automatically sync it to the server as default
  // 2. Query server for default background status
  useEffect(() => {
    const localBg = localStorage.getItem('nova_custom_bg');
    if (localBg && localBg.startsWith('data:image')) {
      saveAsDefaultBackground(localBg);
    }

    // Check if server already has default background
    fetch('/api/default-background')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasDefaultBg) {
          setHasServerDefaultBg(true);
          if (data.updatedAt) {
            setDefaultBgTimestamp(data.updatedAt);
          }
        }
      })
      .catch(() => {});
  }, []);

  const openLeftSidebar = () => {
    setLeftSidebarOpen(true);
    setRightSidebarOpen(false);
    setMobileDrawerOpen(false);
  };

  const openRightSidebar = () => {
    setRightSidebarOpen(true);
    setLeftSidebarOpen(false);
    setMobileDrawerOpen(false);
  };

  const closeAllSidebars = () => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
    setMobileDrawerOpen(false);
  };

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const val = JSON.parse(localStorage.getItem('nova_favorites') || '[]');
      return Array.isArray(val) ? val : [];
    } catch {
      return [];
    }
  });

  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const val = JSON.parse(localStorage.getItem('nova_recents') || '[]');
      return Array.isArray(val) ? val : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.includes(toolId)
        ? safePrev.filter((id) => id !== toolId)
        : [...safePrev, toolId];
      try {
        localStorage.setItem('nova_favorites', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Sync theme with system and html tag
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let dark = false;
      if (theme === 'dark') {
        dark = true;
      } else if (theme === 'light') {
        dark = false;
      } else {
        dark = mediaQuery.matches;
      }

      setIsDark(dark);
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  // Sync language and RTL direction
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
    localStorage.setItem('nova_lang', language);
  }, [language]);

  // Listen to browser forward/back buttons naturally
  useEffect(() => {
    const handlePopState = () => {
      setNavState(parseCurrentUrl());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Virtual SPA Page View, SEO Synchronization, and Navigation Tracking
  useEffect(() => {
    let title = 'Nova Tools - Free Privacy-First Online Utility Platform';
    let path = '/';

    if (navState.view === '404') {
      title = '404 - Page Not Found | Nova Tools';
      path = window.location.pathname;
      updateSeo({ is404: true, language });
    } else if (navState.view === 'tool' && navState.toolId) {
      const tool = TOOLS.find((t) => t.id === navState.toolId);
      if (tool) {
        title = `${tool.name} - Free Online Tool | Nova Tools`;
        path = getToolUrl(tool.id);
        trackToolOpen(tool.id, tool.name, tool.category);
        updateSeo({ toolId: tool.id, language });
      } else {
        title = '404 - Tool Not Found | Nova Tools';
        updateSeo({ is404: true, language });
      }
    } else if (navState.view === 'category' && navState.category) {
      const catDef = CATEGORIES.find((c) => c.id === navState.category);
      const catName = catDef?.nameKey || navState.category.toUpperCase();
      title = `${catName} Tools - Free Online Suite | Nova Tools`;
      path = getCategoryUrl(navState.category);
      trackCategoryOpen(navState.category, navState.category);
      updateSeo({ category: navState.category, language });
    } else if (navState.view === 'legal' && navState.legalPage) {
      const legalName = navState.legalPage.charAt(0).toUpperCase() + navState.legalPage.slice(1);
      title = `${legalName} Policy | Nova Tools`;
      path = getLegalUrl(navState.legalPage);
      updateSeo({ legalPage: navState.legalPage, language });
    } else {
      // Home view
      updateSeo({ language });
    }

    trackPageView(title, path);
  }, [navState, language]);

  const setLanguage = (lang: Language) => {
    if (lang !== language) {
      trackLanguageChange(language, lang);
    }
    setLanguageState(lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('nova_theme', newTheme);
  };

  const updateUrlAndState = (newState: NavigationState) => {
    setNavState(newState);
    setMobileDrawerOpen(false);
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let targetUrl = '/';
    if (newState.view === 'tool' && newState.toolId) {
      targetUrl = getToolUrl(newState.toolId);
    } else if (newState.view === 'category' && newState.category) {
      targetUrl = getCategoryUrl(newState.category);
    } else if (newState.view === 'legal' && newState.legalPage) {
      targetUrl = getLegalUrl(newState.legalPage);
    } else if (newState.view === '404') {
      targetUrl = window.location.pathname;
    }

    if (window.location.pathname !== targetUrl || window.location.search) {
      window.history.pushState(newState, '', targetUrl);
    }
  };

  const navigateToHome = () => updateUrlAndState({ view: 'home' });
  const navigateToTool = (toolId: string) => {
    setRecentTools((prev) => {
      const updated = [toolId, ...prev.filter((id) => id !== toolId)].slice(0, 8);
      localStorage.setItem('nova_recents', JSON.stringify(updated));
      return updated;
    });
    updateUrlAndState({ view: 'tool', toolId });
  };
  const navigateToCategory = (category: ToolCategory) => updateUrlAndState({ view: 'category', category });
  const navigateToLegal = (legalPage: LegalPageType) => updateUrlAndState({ view: 'legal', legalPage });

  const navigateBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Graceful fallback to category or home
      if (navState.category) {
        navigateToCategory(navState.category);
      } else {
        navigateToHome();
      }
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        isDark,
        t,
        navState,
        navigateToHome,
        navigateToTool,
        navigateToCategory,
        navigateToLegal,
        navigateBack,
        favorites,
        recentTools,
        toggleFavorite,
        searchOpen,
        setSearchOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        leftSidebarOpen,
        setLeftSidebarOpen,
        rightSidebarOpen,
        setRightSidebarOpen,
        openLeftSidebar,
        openRightSidebar,
        closeAllSidebars,
        customBg,
        setCustomBg,
        saveAsDefaultBackground,
        isSavingDefaultBg,
        hasServerDefaultBg,
        defaultBgTimestamp,
        mobileDrawerOpen,
        setMobileDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
