import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Compass } from 'lucide-react';
import { TourPackage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { resolveImageUrl, handleImageFallback } from '../lib/imageUtils';

interface TourPackageCardProps {
  tourPackage: TourPackage;
}

export const TourPackageCard: React.FC<TourPackageCardProps> = ({ tourPackage }) => {
  const { getText, formatPrice, t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-emerald-700/40 transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1">
      {/* Visual Slot */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
        {!imageError ? (
          <img
            src={resolveImageUrl(tourPackage.coverImage)}
            alt={getText(tourPackage.title)}
            referrerPolicy="no-referrer"
            onError={(e) => {
              handleImageFallback(e, 'sajek');
              // If second fallback also errors
              if (e.currentTarget.dataset.triedFallback === 'true') {
                setImageError(true);
              }
            }}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-stone-900 text-stone-200 p-6 text-center">
            <Compass className="w-10 h-10 text-emerald-400 mb-2 stroke-[1.5]" />
            <span className="text-base font-medium text-white">{getText(tourPackage.destination)}</span>
          </div>
        )}

        {/* Featured Tag (clean text overlay scrim) */}
        {tourPackage.featured && (
          <div className="absolute top-3.5 left-3.5 bg-stone-950/85 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wide shadow-md flex items-center gap-1.5">
            <span className="text-amber-400">★</span>
            <span>{getText(tourPackage.categoryLabel)}</span>
          </div>
        )}
      </div>

      {/* Content Container with generous padding and flex rhythm */}
      <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between bg-white">
        <div>
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-600 mb-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
              <MapPin className="w-4 h-4 shrink-0 text-emerald-700" />
              <span className="truncate max-w-[160px] sm:max-w-[200px]">{getText(tourPackage.destination)}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300 font-bold">·</span>
            <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
              <Clock className="w-4 h-4 shrink-0 text-stone-400" />
              <span>{getText(tourPackage.duration.text)}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-emerald-900 transition-colors line-clamp-2">
            <Link to={`/packages/${tourPackage.slug}`}>
              {getText(tourPackage.title)}
            </Link>
          </h3>

          <p className="mt-2.5 text-sm sm:text-base text-stone-600 leading-relaxed line-clamp-2">
            {getText(tourPackage.shortDescription)}
          </p>
        </div>

        {/* Bottom Strip: Price & High-Visibility Action Button */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <span className="block text-xs uppercase tracking-wider text-stone-500 font-medium">
              {t.common.startsFrom}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
              {formatPrice(tourPackage.priceBDT)}
              <span className="text-xs sm:text-sm font-normal text-stone-500 ml-1.5">
                / {t.common.perPerson}
              </span>
            </span>
          </div>

          <Link
            to={`/packages/${tourPackage.slug}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 group-hover:bg-emerald-800 group-hover:text-white text-sm font-bold shadow-xs transition-all whitespace-nowrap shrink-0 group/link"
          >
            <span>{t.common.viewDetails}</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};
