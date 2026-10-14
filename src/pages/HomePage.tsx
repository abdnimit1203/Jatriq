import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  MapPin,
  Sparkles,
  MessageCircle,
  Search,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { destinationsList, sampleTestimonials } from '../data/packages';
import { TourPackageCard } from '../components/TourPackageCard';
import { DestinationCard } from '../components/DestinationCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { SectionHeading } from '../components/SectionHeading';
import { resolveImageUrl, handleImageFallback } from '../lib/imageUtils';

export const HomePage: React.FC = () => {
  const { t, getText, formatNumber, language } = useLanguage();
  const { packages, config } = useData();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const featuredPackages = packages.filter((p) => p.featured).slice(0, 3);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/packages?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/packages');
    }
  };

  return (
    <div className="space-y-20 sm:space-y-24 pb-20">
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-stone-950 text-white">
        {/* Full-bleed photography */}
        <div className="absolute inset-0 z-0">
          <img
            src={resolveImageUrl('/images/hero_sajek_sunrise_1791788897775.jpg', 'sajek')}
            alt="Misty sunrise over Sajek Valley Bangladesh"
            referrerPolicy="no-referrer"
            fetchPriority="high"
            onError={(e) => handleImageFallback(e, 'sajek')}
            className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000 ease-out"
          />
          {/* Measured multi-layer contrast scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-stone-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-medium tracking-wide uppercase mb-6 font-mono border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.hero.badge}</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] text-balance">
            {t.hero.title}
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-stone-200 max-w-2xl leading-relaxed text-balance">
            {t.hero.subtitle}
          </p>

          {/* Quick Search Shortcut Bar */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="w-full max-w-xl mt-8 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/40"
          >
            <div className="pl-3.5 text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-500 focus:outline-hidden py-2"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              {t.hero.searchAction}
            </button>
          </form>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-medium border border-white/30 transition-all"
            >
              <span>{t.hero.ctaSecondary}</span>
            </Link>
          </div>

          {/* Adjacency Proof Row */}
          <div className="mt-14 pt-8 border-t border-white/15 w-full grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                {formatNumber(t.hero.stat1Value)}
              </div>
              <div className="text-xs text-stone-300 mt-1">
                {t.hero.stat1Label}
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-300 tabular-nums">
                {formatNumber(t.hero.stat2Value)}
              </div>
              <div className="text-xs text-stone-300 mt-1">
                {t.hero.stat2Label}
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-300 tabular-nums">
                {formatNumber(t.hero.stat3Value)}
              </div>
              <div className="text-xs text-stone-300 mt-1">
                {t.hero.stat3Label}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Tour Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <SectionHeading
            title={t.discovery.title}
            subtitle={t.discovery.subtitle}
            className="mb-0!"
          />
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors shrink-0 group"
          >
            <span>{t.discovery.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredPackages.map((pkg) => (
            <TourPackageCard key={pkg.id} tourPackage={pkg} />
          ))}
        </div>
      </section>

      {/* 3. Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.destinations.title}
          subtitle={t.destinations.subtitle}
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationsList.slice(0, 3).map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold hover:bg-stone-100 transition-colors"
          >
            <span>{language === 'bn' ? 'সকল গন্তব্য দেখুন' : 'Explore All Destinations'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t.whyChooseUs.title}
            subtitle={t.whyChooseUs.subtitle}
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-7 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 shadow-xs">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2.5">
                {t.whyChooseUs.item1Title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {t.whyChooseUs.item1Desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2.5">
                {t.whyChooseUs.item2Title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {t.whyChooseUs.item2Desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2.5">
                {t.whyChooseUs.item3Title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {t.whyChooseUs.item3Desc}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 shadow-xs">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2.5">
                {t.whyChooseUs.item4Title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {t.whyChooseUs.item4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Simple Three-Step Booking Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.howItWorks.title}
          subtitle={t.howItWorks.subtitle}
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <span className="text-4xl font-extrabold font-mono text-emerald-800/30 mb-4 block">
              {t.howItWorks.step1Number}
            </span>
            <h3 className="text-xl font-bold text-stone-900 mb-2.5">
              {t.howItWorks.step1Title}
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <span className="text-4xl font-extrabold font-mono text-emerald-800/30 mb-4 block">
              {t.howItWorks.step2Number}
            </span>
            <h3 className="text-xl font-bold text-stone-900 mb-2.5">
              {t.howItWorks.step2Title}
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <span className="text-4xl font-extrabold font-mono text-emerald-800/30 mb-4 block">
              {t.howItWorks.step3Number}
            </span>
            <h3 className="text-xl font-bold text-stone-900 mb-2.5">
              {t.howItWorks.step3Title}
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Traveler Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {sampleTestimonials.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
      </section>

      {/* 7. Travel Inspiration Gallery Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded-2xl overflow-hidden">
          <div className="aspect-4/3 overflow-hidden bg-stone-900 group">
            <img
              src="/src/assets/images/sylhet_tea_gardens_1791788922427.jpg"
              alt="Sylhet Tea Gardens"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-4/3 overflow-hidden bg-stone-900 group">
            <img
              src="/src/assets/images/coxs_bazar_sunset_1791788910726.jpg"
              alt="Cox's Bazar Sunset"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-4/3 overflow-hidden bg-stone-900 group">
            <img
              src="/src/assets/images/sundarbans_mangrove_1791788934964.jpg"
              alt="Sundarbans Mangrove"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-4/3 overflow-hidden bg-stone-900 group">
            <img
              src="/src/assets/images/bandarban_hills_1791788946228.jpg"
              alt="Bandarban Hills"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 8. Conversion CTA Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 p-8 sm:p-12 lg:p-16 text-white shadow-xl">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              {t.ctaSection.title}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 mb-8 leading-relaxed">
              {t.ctaSection.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                  language === 'bn'
                    ? 'আসসালামু আলাইকুম, আমি একটি নতুন ট্যুর বুকিং বিষয়ে পরামর্শ নিতে চাচ্ছি।'
                    : 'Hello, I would like advice on planning a custom tour in Bangladesh.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-sm font-bold shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.ctaSection.buttonText}</span>
              </a>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-colors"
              >
                <span>{t.ctaSection.secondaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
