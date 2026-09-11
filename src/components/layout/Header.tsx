import React from 'react';
import { Search, Menu, Sparkles, SlidersHorizontal, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { navigateToHome, setSearchOpen, openLeftSidebar, openRightSidebar, t } = useApp();

  return (
    <header
      id="nova-global-header"
      className="fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-xl bg-[#060b09]/95 border-b border-emerald-500/20 shadow-2xl text-white transition-all h-14 sm:h-16"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Open Left Sidebar (Workstations) & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            id="header-left-sidebar-btn"
            onClick={openLeftSidebar}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 hover:text-white border border-white/10 text-emerald-400 transition-all shadow-sm"
            aria-label="Open Workstations Menu"
            title="Workstations & Tools"
          >
            <Layers className="w-5 h-5" />
            <span className="hidden md:inline text-xs font-semibold text-slate-200">Tools</span>
          </button>

          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateToHome();
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-left rtl:text-right group"
            aria-label="Nova Tools Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-white whitespace-nowrap">
                NOVA <span className="text-emerald-400 font-medium">TOOLS</span>
              </span>
            </div>
          </a>
        </div>

        {/* Center: Clean Search Bar - Only 'Search...' text */}
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg mx-1 sm:mx-3">
          <button
            type="button"
            id="header-search-btn"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-500/50 text-slate-300 hover:text-white transition-all text-xs sm:text-sm shadow-sm"
            aria-label="Search"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate text-xs sm:text-sm text-slate-200 font-medium">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white/10 text-slate-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Open Right Sidebar (Preferences, Language, Themes, Background) */}
        <div className="flex items-center flex-shrink-0">
          <button
            type="button"
            id="header-right-sidebar-btn"
            onClick={openRightSidebar}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 hover:text-white border border-white/10 text-emerald-400 transition-all group shadow-sm"
            aria-label="Open Right Sidebar Menu"
            title="Right Sidebar (Settings, Language & Themes)"
          >
            <Menu className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-white">
              Menu
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

