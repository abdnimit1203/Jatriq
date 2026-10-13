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
      className="group relative block rounded-2xl overflow-hidden aspect-4/3 sm:aspect-5/4 bg-stone-900 border border-stone-200/50 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {!imageError ? (
        <img
          src={destination.image}
          alt={getText(destination.name)}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 text-stone-200 p-4">
          <Compass className="w-10 h-10 text-emerald-400 mb-2" />
        </div>
      )}

      {/* Measured Dark Contrast Scrim for 4.5:1 legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-transparent" />

      {/* Floating Info */}
      <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end text-white">
        <span className="text-xs sm:text-sm font-mono text-emerald-300 tracking-wider uppercase mb-1 font-semibold">
          {getText(destination.region)}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-amber-200 transition-colors">
          {getText(destination.name)}
        </h3>
        <p className="mt-1.5 text-sm sm:text-base text-stone-200 line-clamp-1">
          {getText(destination.highlights)}
        </p>

        <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm text-stone-200">
          <span className="font-medium">
            {formatNumber(destination.packageCount)} {t.destinations.toursCount}
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
            <span>{language === 'bn' ? 'ট্যুর দেখুন' : 'Explore'}</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
