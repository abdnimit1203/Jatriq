import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { config } = useData();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/packages', label: t.nav.packages },
    { to: '/destinations', label: t.nav.destinations },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isScrolled
          ? 'bg-stone-50/95 backdrop-blur-md border-stone-200/80 shadow-xs'
          : 'bg-stone-50/80 backdrop-blur-xs border-stone-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
          >
            <span className="font-serif italic font-extrabold text-emerald-800 text-3xl">J</span>
            <span className="font-sans font-bold tracking-tight">
              {config.agencyName}
            </span>
            <span className="text-xs text-emerald-700 font-normal ml-1 font-serif">
              {config.brandMark}
            </span>
          </Link>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
          >
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm ${
                    active ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + language switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <LanguageSwitcher className="hidden sm:inline-flex" />

            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-50 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-full shadow-xs transition-all whitespace-nowrap shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <span>{t.nav.bookNow}</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="py-2 mb-3 border-b border-stone-200 flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-stone-500">
              {language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}
            </span>
            <LanguageSwitcher />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-base rounded-md font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
