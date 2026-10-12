import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { DestinationInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DestinationCardProps {
  destination: DestinationInfo;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { getText, formatNumber, t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/packages?dest=${destination.id}`}
      className="group relative block rounded-xl overflow-hidden aspect-4/3 sm:aspect-5/4 bg-stone-900 border border-stone-200/50 shadow-xs hover:shadow-lg transition-all"
    >
      {!imageError ? (
        <img
          src={destination.image}
          alt={getText(destination.name)}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 text-stone-200 p-4">
          <Compass className="w-8 h-8 text-emerald-400 mb-2" />
        </div>
      )}

      {/* Measured Dark Contrast Scrim for 4.5:1 legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

      {/* Floating Info */}
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
        <span className="text-xs font-mono text-emerald-300 tracking-wider uppercase mb-1">
          {getText(destination.region)}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
          {getText(destination.name)}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-stone-300 line-clamp-1">
          {getText(destination.highlights)}
        </p>

        <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-stone-300">
          <span>
            {formatNumber(destination.packageCount)} {t.destinations.toursCount}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform">
            <span>{language === 'bn' ? 'ট্যুর দেখুন' : 'Explore'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
