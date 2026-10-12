import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Compass } from 'lucide-react';
import { TourPackage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TourPackageCardProps {
  tourPackage: TourPackage;
}

export const TourPackageCard: React.FC<TourPackageCardProps> = ({ tourPackage }) => {
  const { getText, formatPrice, t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/90 hover:border-stone-300 transition-all duration-200 hover:shadow-md">
      {/* Visual Slot */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
        {!imageError ? (
          <img
            src={tourPackage.coverImage}
            alt={getText(tourPackage.title)}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-stone-900 text-stone-200 p-6 text-center">
            <Compass className="w-8 h-8 text-emerald-400 mb-2 stroke-[1.5]" />
            <span className="text-sm font-medium text-white">{getText(tourPackage.destination)}</span>
          </div>
        )}

        {/* Featured Tag (subtle text overlay scrim, no loud pill sandwich) */}
        {tourPackage.featured && (
          <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-sm tracking-wide">
            ★ {getText(tourPackage.categoryLabel)}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
            <span className="flex items-center gap-1 font-medium text-emerald-800">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[170px]">{getText(tourPackage.destination)}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Clock className="w-3.5 h-3.5 shrink-0 text-stone-400" />
              <span>{getText(tourPackage.duration.text)}</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-emerald-900 transition-colors line-clamp-2">
            <Link to={`/packages/${tourPackage.slug}`}>
              {getText(tourPackage.title)}
            </Link>
          </h3>

          <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-2">
            {getText(tourPackage.shortDescription)}
          </p>
        </div>

        {/* Bottom Strip: Price & Link */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-stone-500">
              {t.common.startsFrom}
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
              {formatPrice(tourPackage.priceBDT)}
              <span className="text-xs font-normal text-stone-500 ml-1">
                / {t.common.perPerson}
              </span>
            </span>
          </div>

          <Link
            to={`/packages/${tourPackage.slug}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors whitespace-nowrap shrink-0 group/link"
          >
            <span>{t.common.viewDetails}</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};
