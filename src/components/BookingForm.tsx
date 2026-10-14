import React, { useState, useEffect } from 'react';
import { TourPackage, BookingInquiry } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { submitBookingToFirestore } from '../lib/firebase';
import {
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Calendar,
  Users,
  Compass,
} from 'lucide-react';

interface BookingFormProps {
  initialPackageSlug?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ initialPackageSlug }) => {
  const { t, getText, formatPrice, language } = useLanguage();
  const { packages, config } = useData();

  const [formData, setFormData] = useState<BookingInquiry>({
    fullName: '',
    phone: '',
    email: '',
    packageSlug: initialPackageSlug || (packages[0]?.slug ?? ''),
    travelDate: '',
    travelersCount: 2,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    whatsappUrl: string;
    rawText: string;
    isDemoNotice: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Today's date in YYYY-MM-DD format for min date attribute
  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialPackageSlug) {
      setFormData((prev) => ({ ...prev, packageSlug: initialPackageSlug }));
    }
  }, [initialPackageSlug]);

  const selectedTour = packages.find((p) => p.slug === formData.packageSlug);

  const validatePhone = (phone: string): boolean => {
    // Bangladeshi mobile format: 013-019 followed by 8 digits, with optional +88 / 88 prefix
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?880|0)?1[3-9]\d{8}$/;
    return bdRegex.test(cleanPhone);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.bookingPage.validationErrors.nameRequired;
    }

    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      newErrors.phone = t.bookingPage.validationErrors.phoneRequired;
    }

    if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = language === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please provide a valid email address.';
    }

    if (!formData.packageSlug) {
      newErrors.packageSlug = t.bookingPage.validationErrors.packageRequired;
    }

    if (!formData.travelDate) {
      newErrors.travelDate = t.bookingPage.validationErrors.dateRequired;
    } else {
      const selected = new Date(formData.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.travelDate = t.bookingPage.validationErrors.dateRequired;
      }
    }

    if (!formData.travelersCount || formData.travelersCount < 1) {
      newErrors.travelersRequired = t.bookingPage.validationErrors.travelersRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate rapid clicks

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const packageTitle = selectedTour
      ? getText(selectedTour.title)
      : formData.packageSlug;

    // Save to Firestore
    try {
      const estimatedBDT = (selectedTour?.priceBDT || 0) * (formData.travelersCount || 1);
      await submitBookingToFirestore({
        packageSlug: formData.packageSlug,
        packageTitle: packageTitle,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || '',
        travelDate: formData.travelDate,
        travelersCount: formData.travelersCount,
        specialRequests: formData.specialRequests?.trim() || '',
        totalEstimatedBDT: estimatedBDT,
      });
    } catch (err) {
      console.warn('Booking stored locally/fallback due to network:', err);
    }

    const result = buildWhatsAppUrl(formData, packageTitle, language, config);

    setSubmissionResult({
      whatsappUrl: result.url,
      rawText: result.messageText,
      isDemoNotice: result.isDemoNotice,
    });
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Attempt to open WhatsApp window safely
    try {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch {
      // Browser popup blocked; fallback action buttons are rendered
    }
  };

  const handleCopy = () => {
    if (submissionResult?.rawText) {
      navigator.clipboard.writeText(submissionResult.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Form Column */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-9 shadow-lg sm:shadow-xl shadow-stone-200/60">
        {isSubmitted && submissionResult ? (
          <div className="text-center py-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              {t.bookingPage.successTitle}
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              {t.bookingPage.successMessage}
            </p>

            {submissionResult.isDemoNotice && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">
                    {language === 'bn' ? 'ডেমো নম্বর বিজ্ঞপ্তি' : 'Agency Demo Notice'}
                  </span>
                  {language === 'bn'
                    ? 'আপনার সাইটটি বর্তমানে ডেমো ফোন নম্বরে সেট করা আছে। আসল বুকিং বার্তা পেতে siteConfig.ts ফাইলে আসল হোয়াটসঅ্যাপ নম্বর যুক্ত করুন।'
                    : 'The site is currently in demo mode. Replace the placeholder number in siteConfig.ts to receive customer inquiries on your agency phone.'}
                </div>
              </div>
            )}

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <a
                href={submissionResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.bookingPage.openWhatsAppDirectly}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? t.bookingPage.copiedNotice : t.bookingPage.copySummary}</span>
              </button>
            </div>

            {/* Raw Message Preview Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-left text-xs font-mono text-stone-700 whitespace-pre-wrap max-h-56 overflow-y-auto">
              {submissionResult.rawText}
            </div>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-xs text-emerald-800 font-semibold hover:underline"
            >
              {language === 'bn' ? 'আরেকটি আবেদন পাঠান' : 'Submit another inquiry'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Disclaimer notice */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span>{t.bookingPage.inquiryNotice}</span>
            </div>

            {/* Tour Package Selection */}
            <div>
              <label htmlFor="packageSlug" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                {t.bookingPage.selectPackage} <span className="text-red-500">*</span>
              </label>
              <select
                id="packageSlug"
                value={formData.packageSlug}
                onChange={(e) => {
                  setFormData({ ...formData, packageSlug: e.target.value });
                  if (errors.packageSlug) setErrors({ ...errors, packageSlug: '' });
                }}
                className={`w-full py-2.5 px-3 text-sm rounded-lg bg-stone-50 border transition-colors ${
                  errors.packageSlug
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-stone-200 focus:bg-white focus:border-emerald-700'
                }`}
              >
                <option value="">{t.bookingPage.selectPlaceholder}</option>
                {packages.map((pkg) => (
                  <option key={pkg.slug} value={pkg.slug}>
                    {getText(pkg.title)} ({formatPrice(pkg.priceBDT)})
                  </option>
                ))}
              </select>
              {errors.packageSlug && (
                <p className="mt-1 text-xs text-red-600">{errors.packageSlug}</p>
              )}
            </div>

            {/* Full Name & Phone in 2-col on tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {t.bookingPage.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder={t.bookingPage.fullNamePlaceholder}
                  className={`w-full py-2.5 px-3 text-sm rounded-lg bg-stone-50 border transition-colors ${
                    errors.fullName
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-stone-200 focus:bg-white focus:border-emerald-700'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {t.bookingPage.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder={t.bookingPage.phonePlaceholder}
                  className={`w-full py-2.5 px-3 text-sm rounded-lg bg-stone-50 border transition-colors ${
                    errors.phone
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-stone-200 focus:bg-white focus:border-emerald-700'
                  }`}
                />
                {errors.phone ? (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-stone-500">{t.bookingPage.phoneHelp}</p>
                )}
              </div>
            </div>

            {/* Travel Date & Travelers Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="travelDate" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {t.bookingPage.travelDate} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="travelDate"
                    min={todayString}
                    value={formData.travelDate}
                    onChange={(e) => {
                      setFormData({ ...formData, travelDate: e.target.value });
                      if (errors.travelDate) setErrors({ ...errors, travelDate: '' });
                    }}
                    className={`w-full py-2.5 px-3 text-sm rounded-lg bg-stone-50 border transition-colors ${
                      errors.travelDate
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : 'border-stone-200 focus:bg-white focus:border-emerald-700'
                    }`}
                  />
                </div>
                {errors.travelDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.travelDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="travelersCount" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {t.bookingPage.travelersCount} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="travelersCount"
                    min="1"
                    max="50"
                    value={formData.travelersCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      setFormData({ ...formData, travelersCount: val });
                    }}
                    className="w-full py-2.5 px-3 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                {t.bookingPage.email}
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t.bookingPage.emailPlaceholder}
                className="w-full py-2.5 px-3 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 transition-colors"
              />
            </div>

            {/* Special Requests */}
            <div>
              <label htmlFor="specialRequests" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                {t.bookingPage.specialRequests}
              </label>
              <textarea
                id="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder={t.bookingPage.specialRequestsPlaceholder}
                className="w-full py-2 px-3 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? (language === 'bn' ? 'প্রক্রিয়াধীন...' : 'Processing...') : t.bookingPage.submitButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Package Summary Column */}
      <div className="lg:col-span-5 space-y-6">
        {selectedTour ? (
          <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-lg shadow-stone-200/60 sticky top-24">
            <div className="aspect-16/9 relative overflow-hidden bg-stone-100">
              <img
                src={selectedTour.coverImage}
                alt={getText(selectedTour.title)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-xs px-2.5 py-1 rounded-sm font-medium">
                {getText(selectedTour.categoryLabel)}
              </div>
            </div>

            <div className="p-6">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                {t.bookingPage.selectedSummaryTitle}
              </span>
              <h4 className="text-lg font-bold text-stone-900 leading-snug">
                {getText(selectedTour.title)}
              </h4>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <span>{getText(selectedTour.destination)}</span>
                <span aria-hidden="true">·</span>
                <span>{getText(selectedTour.duration.text)}</span>
              </p>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t.packageDetails.startingAt}:</span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {formatPrice(selectedTour.priceBDT)} / {t.common.perPerson}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.packageDetails.accommodation}:</span>
                  <span className="font-medium text-stone-800 text-right max-w-[200px] truncate">
                    {getText(selectedTour.accommodation)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.packageDetails.transport}:</span>
                  <span className="font-medium text-stone-800 text-right max-w-[200px] truncate">
                    {getText(selectedTour.transport)}
                  </span>
                </div>
              </div>

              {formData.travelersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-100 bg-stone-50 -mx-6 -mb-6 p-4 text-xs flex items-center justify-between">
                  <span className="text-stone-600">
                    {language === 'bn' ? 'সম্ভাব্য মোট ব্যয় (জনপ্রতি ভিত্তিতে):' : 'Estimated Total (Base Rate):'}
                  </span>
                  <span className="text-base font-bold text-emerald-900 tabular-nums">
                    {formatPrice(selectedTour.priceBDT * formData.travelersCount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 text-center text-stone-500 text-sm">
            {t.bookingPage.selectPlaceholder}
          </div>
        )}

        {/* Agency Assistance Callout */}
        <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-5 text-xs text-stone-600 space-y-2">
          <h5 className="font-bold text-stone-800 text-sm">
            {language === 'bn' ? 'জরুরি পরামর্শ প্রয়োজন?' : 'Need direct phone advice?'}
          </h5>
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'কর্পোরেট রিট্রিট, পরিবারসহ কাস্টমাইজড রুট কিংবা স্পেশাল গাড়ির ব্যবস্থার জন্য সরাসরি কল করুন আমাদের হটলাইনে।'
              : 'For corporate retreats, customized family routes, or vehicle upgrades, call our direct travel desk hotline.'}
          </p>
          <div className="pt-1 font-mono font-bold text-emerald-900 text-sm">
            {config.contactPhone}
          </div>
        </div>
      </div>
    </div>
  );
};
