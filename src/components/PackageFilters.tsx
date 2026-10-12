import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface FilterState {
  searchQuery: string;
  category: string;
  duration: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'duration-asc';
}

interface PackageFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  categories: { value: string; label: string }[];
  durations: { value: string; label: string }[];
  totalResults: number;
}

export const PackageFilters: React.FC<PackageFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories,
  durations,
  totalResults,
}) => {
  const { t, formatNumber } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, duration: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterState['sortBy'],
    });
  };

  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.category !== 'all' ||
    filters.duration !== 'all' ||
    filters.sortBy !== 'featured';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-6 mb-8 shadow-xs">
      {/* Top Row: Search and Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative md:col-span-7 lg:col-span-8">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={t.packagesPage.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-colors text-stone-900 placeholder:text-stone-400"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Duration Dropdown */}
        <div className="md:col-span-2 lg:col-span-2">
          <label htmlFor="duration-filter" className="sr-only">
            {t.packagesPage.durationFilter}
          </label>
          <div className="relative">
            <select
              id="duration-filter"
              value={filters.duration}
              onChange={handleDurationChange}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 text-stone-700 transition-colors"
            >
              <option value="all">{t.packagesPage.allDurations}</option>
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Select */}
        <div className="md:col-span-3 lg:col-span-2">
          <label htmlFor="sort-filter" className="sr-only">
            {t.packagesPage.sortBy}
          </label>
          <div className="relative">
            <select
              id="sort-filter"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 text-stone-700 transition-colors"
            >
              <option value="featured">{t.packagesPage.sortFeatured}</option>
              <option value="price-asc">{t.packagesPage.sortPriceAsc}</option>
              <option value="price-desc">{t.packagesPage.sortPriceDesc}</option>
              <option value="duration-asc">{t.packagesPage.sortDurationAsc}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Bar & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-stone-400 font-medium mr-1 hidden lg:inline">
            <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1" />
            {t.packagesPage.categoryFilter}:
          </span>
          {categories.map((cat) => {
            const isActive = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500 shrink-0">
          <span className="font-medium text-stone-700">
            {formatNumber(totalResults)} {t.packagesPage.resultsFound}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              {t.packagesPage.resetFilters}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
