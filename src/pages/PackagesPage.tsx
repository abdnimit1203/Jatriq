import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { TourPackageCard } from '../components/TourPackageCard';
import { PackageFilters, FilterState } from '../components/PackageFilters';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Compass, RotateCcw } from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const { t, getText, language } = useLanguage();
  const { packages } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') || '';
  const urlDest = searchParams.get('dest') || '';

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: urlQuery,
    category: 'all',
    duration: 'all',
    sortBy: 'featured',
  });

  // Keep state updated if search params change
  useEffect(() => {
    if (urlQuery) {
      setFilters((prev) => ({ ...prev, searchQuery: urlQuery }));
    }
    if (urlDest) {
      // Map destination to search or category
      setFilters((prev) => ({ ...prev, searchQuery: urlDest.replace('-', ' ') }));
    }
  }, [urlQuery, urlDest]);

  const categories = useMemo(() => {
    const list = [
      { value: 'all', label: t.packagesPage.allCategories },
      { value: 'hill-tracts', label: language === 'bn' ? 'পাহাড় ও মেঘের উপত্যকা' : 'Hill Tracts' },
      { value: 'beach', label: language === 'bn' ? 'সমুদ্র সৈকত' : 'Beaches' },
      { value: 'tea-gardens', label: language === 'bn' ? 'চায়ের দেশ' : 'Tea Highlands' },
      { value: 'wildlife', label: language === 'bn' ? 'ম্যানগ্রোভ ও বন্যপ্রাণী' : 'Mangrove & Wildlife' },
      { value: 'island', label: language === 'bn' ? 'প্রবাল দ্বীপ' : 'Coral Island' },
    ];
    return list;
  }, [language, t.packagesPage.allCategories]);

  const durations = useMemo(() => {
    return [
      { value: '3', label: language === 'bn' ? '৩ দিন / ২ রাত' : '3 Days / 2 Nights' },
    ];
  }, [language]);

  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        // Search query filter (matches title or destination in either language)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase().trim();
          const matchTitleBn = pkg.title.bn.toLowerCase().includes(query);
          const matchTitleEn = pkg.title.en.toLowerCase().includes(query);
          const matchDestBn = pkg.destination.bn.toLowerCase().includes(query);
          const matchDestEn = pkg.destination.en.toLowerCase().includes(query);
          const matchSlug = pkg.slug.toLowerCase().includes(query);

          if (!matchTitleBn && !matchTitleEn && !matchDestBn && !matchDestEn && !matchSlug) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'all' && pkg.category !== filters.category) {
          return false;
        }

        // Duration filter
        if (filters.duration !== 'all') {
          const daysReq = parseInt(filters.duration, 10);
          if (pkg.duration.days !== daysReq) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.priceBDT - b.priceBDT;
        }
        if (filters.sortBy === 'price-desc') {
          return b.priceBDT - a.priceBDT;
        }
        if (filters.sortBy === 'duration-asc') {
          return a.duration.days - b.duration.days;
        }
        // Default: featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [filters]);

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      duration: 'all',
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.nav.packages }]} />

      {/* Header Info */}
      <div className="my-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          {t.packagesPage.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.packagesPage.subtitle}
        </p>
      </div>

      {/* Filters Bar */}
      <PackageFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleReset}
        categories={categories}
        durations={durations}
        totalResults={filteredPackages.length}
      />

      {/* Packages Grid or Empty State */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPackages.map((pkg) => (
            <TourPackageCard key={pkg.id} tourPackage={pkg} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            {t.packagesPage.noResults}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-6">
            {language === 'bn'
              ? 'অন্য কোনো শব্দ দিয়ে খুঁজুন অথবা ফিল্টার রিসেট করে সব প্যাকেজ দেখুন।'
              : 'Try searching with different keywords or reset filters to browse all available tours.'}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.packagesPage.resetFilters}</span>
          </button>
        </div>
      )}
    </div>
  );
};
