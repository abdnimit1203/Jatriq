import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Phone, MessageCircle, ShieldCheck, Compass, Home, MapPin, Info, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/packages', label: t.nav.packages, icon: Compass },
    { to: '/destinations', label: t.nav.destinations, icon: MapPin },
    { to: '/about', label: t.nav.about, icon: Info },
    { to: '/contact', label: t.nav.contact, icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-stone-50/95 backdrop-blur-md border-stone-200/90 shadow-sm'
            : 'bg-stone-50/90 backdrop-blur-sm border-stone-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-6 h-16 sm:h-20">
            {/* Zone 1: Distinctive Brand Logo */}
            <Link
              to="/"
              className="flex items-center shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
              aria-label="Jatriq Home"
            >
              <Logo size="md" variant="dark" showTagline={false} />
            </Link>

            {/* Zone 2: Desktop clean text navigation links */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-stone-600"
            >
              {navLinks.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-stone-950 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm ${
                      active ? 'text-emerald-800 font-bold' : ''
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

            {/* Zone 3: Actions + Mobile Hamburger Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LanguageSwitcher className="hidden sm:inline-flex" />

              {/* Book Now button: shown on tablet/desktop, compact on small screens */}
              <Link
                to="/booking"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-stone-50 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-full shadow-md hover:shadow-lg transition-all whitespace-nowrap shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <span>{t.nav.bookNow}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              {/* Mobile hamburger menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-stone-300/80 bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-800 shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 transition-all cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-stone-900" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6 text-stone-900" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-[86%] max-w-sm bg-white shadow-2xl flex flex-col z-50 overflow-y-auto animate-in slide-in-from-right duration-250 border-l border-stone-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <Logo size="sm" variant="dark" showTagline={false} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switcher Bar */}
            <div className="px-5 py-3 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                {language === 'bn' ? 'ভাষা / Language' : 'Language'}
              </span>
              <LanguageSwitcher />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 space-y-1.5" aria-label="Mobile Navigation">
              {navLinks.map((item) => {
                const active = isActive(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 text-base sm:text-lg font-bold rounded-xl transition-all ${
                      active
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-stone-800 hover:bg-stone-100 hover:text-stone-950'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-emerald-700'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions & Contact in Mobile Drawer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/80 space-y-3">
              {/* Primary Book Now Button */}
              <Link
                to="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>{t.nav.bookNow}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              {/* WhatsApp Quick Assistance */}
              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                  language === 'bn'
                    ? 'আসসালামু আলাইকুম, আমি প্যাকেজ বিষয়ে জানতে আগ্রহী।'
                    : 'Hello, I would like to inquire about tour packages.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white border border-emerald-600/30 text-emerald-800 font-bold text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-emerald-50 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'Chat on WhatsApp'}</span>
              </a>

              {/* Quick Contact & Admin Link */}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 font-medium">
                <a
                  href={`tel:${config.contactPhone}`}
                  className="inline-flex items-center gap-1.5 hover:text-stone-800"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{config.contactPhone}</span>
                </a>

                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 hover:text-stone-800 text-stone-400 hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
