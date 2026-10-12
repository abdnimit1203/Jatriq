import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Home, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          {t.notFound.title}
        </h1>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {t.notFound.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{t.notFound.backHome}</span>
          </Link>

          <Link
            to="/packages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors"
          >
            <span>{t.notFound.browsePackages}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
