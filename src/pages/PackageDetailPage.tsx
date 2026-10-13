import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Bus,
  Home,
  Navigation,
  Sparkles,
  Flag,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { TourPackage } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TourPackageCard } from '../components/TourPackageCard';
import { ReportPackageModal } from '../components/ReportPackageModal';

export const PackageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, getText, formatPrice, formatNumber, language } = useLanguage();
  const { packages, config } = useData();

  const tour = packages.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-3">
          {language === 'bn' ? 'ট্যুর প্যাকেজটি পাওয়া যায়নি' : 'Tour Package Not Found'}
        </h2>
        <p className="text-stone-600 text-sm mb-6">
          {language === 'bn'
            ? 'আপনি যে প্যাকেজটি খুঁজছেন তা হয়তো সরানো হয়েছে।'
            : 'The package you are looking for may have been updated or removed.'}
        </p>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 text-white font-medium text-sm"
        >
          {t.common.backToPackages}
        </Link>
      </div>
    );
  }

  // Combine cover and gallery for interactive selection
  const allImages = [tour.coverImage, ...(tour.galleryImages || [])];
  const activeImage = allImages[activeImageIndex] || tour.coverImage;

  // Related tours in same or different category
  const relatedTours: TourPackage[] = packages
    .filter((p: TourPackage) => p.id !== tour.id)
    .slice(0, 3);

  const handleWhatsAppDirect = () => {
    const rawMsg =
      language === 'bn'
        ? `আসসালামু আলাইকুম, আমি ${config.agencyName} এর "${getText(tour.title)}" (${formatPrice(tour.priceBDT)}) প্যাকেজটি সম্পর্কে তথ্য ও বুকিং জানতে আগ্রহী।`
        : `Hello, I am interested in inquiring about "${getText(tour.title)}" (${formatPrice(tour.priceBDT)}) on ${config.agencyName}.`;
    window.open(
      `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(rawMsg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="pb-20">
      {/* Top Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: t.nav.packages, to: '/packages' },
            { label: getText(tour.title) },
          ]}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Title & Metadata Strip */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider font-mono">
              {getText(tour.categoryLabel)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{getText(tour.destination)}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{getText(tour.duration.text)}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
            {getText(tour.title)}
          </h1>
        </div>

        {/* Hero Visual & Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div className="lg:col-span-9 aspect-16/9 sm:aspect-16/8 rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
            <img
              src={activeImage}
              alt={getText(tour.title)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-1 min-w-[90px] aspect-4/3 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-emerald-700 ring-2 ring-emerald-700/20'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Sticky Booking Card Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100">
                {t.packageDetails.overview}
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {getText(tour.detailedDescription)}
              </p>

              {/* Key Specs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 block text-xs uppercase mb-1">
                    {t.common.duration}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {getText(tour.duration.text)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs uppercase mb-1">
                    {t.packageDetails.groupSize}
                  </span>
                  <span className="font-semibold text-stone-900">
                    Max {formatNumber(tour.maxGroupSize)} {t.packageDetails.travelers}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs uppercase mb-1">
                    {t.common.destination}
                  </span>
                  <span className="font-semibold text-stone-900 truncate block">
                    {getText(tour.destination)}
                  </span>
                </div>
              </div>
            </section>

            {/* Daily Itinerary */}
            <section className="bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                {t.packageDetails.itinerary}
              </h2>

              <div className="space-y-6">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="relative pl-7 pb-6 last:pb-0 border-l border-emerald-800/30">
                    {/* Circle marker */}
                    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                      {formatNumber(day.day)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                          {t.packageDetails.day} {formatNumber(day.day)}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2">
                        {getText(day.title)}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                        {getText(day.description)}
                      </p>

                      {day.highlights && (
                        <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-700">
                          <span className="font-semibold text-stone-900 block mb-1">
                            {language === 'bn' ? 'প্রধান আকর্ষণ:' : 'Key Highlights:'}
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                            {(language === 'bn' ? day.highlights.bn : day.highlights.en).map(
                              (hl, idx) => (
                                <li key={idx}>{hl}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                {language === 'bn' ? 'সুবিধাসমূহ ও শর্তাবলী' : 'Services & Inclusions'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3 font-mono">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>{t.packageDetails.inclusions}</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    {(language === 'bn' ? tour.included.bn : tour.included.en).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-3 font-mono">
                    <XCircle className="w-4 h-4 text-stone-400" />
                    <span>{t.packageDetails.exclusions}</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                    {(language === 'bn' ? tour.excluded.bn : tour.excluded.en).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Logistics: Accommodation, Transport, Departure */}
            <section className="bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                {t.packageDetails.logistics}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-600 shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase mb-0.5">
                      {t.packageDetails.accommodation}
                    </span>
                    <span>{getText(tour.accommodation)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-600 shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase mb-0.5">
                      {t.packageDetails.transport}
                    </span>
                    <span>{getText(tour.transport)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-600 shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase mb-0.5">
                      {t.packageDetails.departure}
                    </span>
                    <span>{getText(tour.departurePoint)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Important Notes & Booking Policy */}
            <section className="bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                {t.packageDetails.importantNotes}
              </h2>

              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 mb-8">
                {(language === 'bn' ? tour.importantNotes.bn : tour.importantNotes.en).map(
                  (note, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  )
                )}
              </ul>

              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200/80">
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm uppercase tracking-wider mb-2 font-mono">
                  {t.packageDetails.bookingPolicy}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.packageDetails.bookingPolicyText}
                </p>
              </div>
            </section>
          </div>

          {/* Sticky Booking CTA Card (Desktop right rail) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-lg shadow-stone-200/60">
              <div className="mb-6">
                <span className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-mono font-semibold">
                  {t.packageDetails.startingAt}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tabular-nums">
                    {formatPrice(tour.priceBDT)}
                  </span>
                  <span className="text-sm text-stone-500 font-normal">
                    / {t.common.perPerson}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Link
                  to={`/booking?package=${tour.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>{t.packageDetails.inquireNow}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-sm sm:text-base transition-all cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-emerald-700" />
                  <span>{t.packageDetails.instantWhatsApp}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    {language === 'bn' ? 'স্বচ্ছ মূল্য ও শর্তাবলী' : 'Transparent Pricing & Inclusions'}
                  </span>
                </div>
                {/* Truthful Verification Status Indicator */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      tour.isVerifiedPackage && config.isVerifiedAgency
                        ? 'bg-emerald-600'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-[11px] text-stone-500">
                    {tour.isVerifiedPackage && config.isVerifiedAgency
                      ? language === 'bn'
                        ? 'যাচাইকৃত রেজিস্টার্ড প্যাকেজ'
                        : 'Verified Agency Listing'
                      : language === 'bn'
                      ? 'ডেমো প্যাকেজ বিবরণী (অপরীক্ষিত)'
                      : 'Demo Listing (Unverified Sample)'}
                  </span>
                </div>
              </div>

              {/* Package Report Trigger */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-700 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'প্যাকেজটি রিপোর্ট করুন' : 'Report this listing'}</span>
                </button>
              </div>
            </div>

            {/* Quick phone assistance */}
            <div className="bg-stone-100 rounded-xl p-5 text-xs text-stone-600">
              <span className="font-bold text-stone-900 block mb-1">
                {t.common.callUs}
              </span>
              <a
                href={`tel:${config.contactPhone.replace(/\s+/g, '')}`}
                className="font-mono text-emerald-900 font-bold text-sm hover:underline"
              >
                {config.contactPhone}
              </a>
              <span className="block mt-1 text-[11px] text-stone-500">
                {t.common.operatingHours}
              </span>
            </div>
          </div>
        </div>

        {/* Related Tours Section */}
        {relatedTours.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">
              {t.packageDetails.relatedTours}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedTours.map((item) => (
                <TourPackageCard key={item.id} tourPackage={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Booking Bar for great usability on smartphones */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
            {t.common.startsFrom}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-stone-900 tabular-nums truncate block">
            {formatPrice(tour.priceBDT)}
            <span className="text-xs font-normal text-stone-500 ml-1">/ {t.common.perPerson}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold active:scale-95 transition-all"
            aria-label="Direct WhatsApp Inquiry"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <Link
            to={`/booking?package=${tour.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            <span>{t.packageDetails.inquireNow}</span>
          </Link>
        </div>
      </div>

      {/* Package Report Modal */}
      <ReportPackageModal
        tour={tour}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
