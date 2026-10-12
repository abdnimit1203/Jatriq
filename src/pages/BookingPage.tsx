import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookingForm } from '../components/BookingForm';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BookingPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const packageSlug = searchParams.get('package') || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.nav.bookNow }]} />

      <div className="my-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          {t.bookingPage.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.bookingPage.subtitle}
        </p>
      </div>

      <BookingForm initialPackageSlug={packageSlug} />
    </div>
  );
};
