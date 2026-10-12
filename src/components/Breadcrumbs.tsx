import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { t } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs sm:text-sm text-stone-500">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link to="/" className="hover:text-emerald-800 transition-colors">
            {t.nav.home}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
              {isLast || !item.to ? (
                <span className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="hover:text-emerald-800 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
