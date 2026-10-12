import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { destinationsList } from '../data/packages';
import { DestinationCard } from '../components/DestinationCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const DestinationsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.nav.destinations }]} />

      <div className="my-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          {t.destinations.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.destinations.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {destinationsList.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
};
