import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem, ToolCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  currentCategory?: ToolCategory;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, currentCategory }) => {
  const { navigateToHome, t } = useApp();

  const resolvedItems: BreadcrumbItem[] =
    items ||
    (currentCategory
      ? [
          {
            label:
              t.categories[currentCategory as keyof typeof t.categories] || currentCategory,
          },
        ]
      : []);

  return (
    <nav aria-label="Breadcrumb" className="py-2.5">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-slate-300">
        <li>
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateToHome();
              }
            }}
            className="hover:text-emerald-400 text-slate-300 transition-colors font-medium"
          >
            Home
          </a>
        </li>
        {resolvedItems.map((item, index) => {
          const isLast = index === resolvedItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180 flex-shrink-0" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-white font-semibold truncate max-w-[200px] sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      item.onClick?.();
                    }
                  }}
                  className="hover:text-emerald-400 text-slate-300 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-emerald-400 text-slate-300 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
