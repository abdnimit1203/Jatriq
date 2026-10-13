import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { siteConfig } from '../config/siteConfig';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, getText, language } = useLanguage();

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!contactForm.name.trim()) {
      errs.name = language === 'bn' ? 'আপনার নাম লিখুন' : 'Name is required';
    }
    if (!contactForm.phone.trim()) {
      errs.phone = language === 'bn' ? 'মোবাইল নম্বর লিখুন' : 'Phone is required';
    }
    if (!contactForm.message.trim()) {
      errs.message = language === 'bn' ? 'আপনার বার্তাটি লিখুন' : 'Message is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.nav.contact }]} />

      <div className="my-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          {t.contactPage.heroTitle}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.contactPage.heroSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-10">
        {/* Contact Information & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-lg shadow-stone-200/60 space-y-6">
            <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
              {t.contactPage.directContactsTitle}
            </h2>

            <div className="space-y-5 text-sm text-stone-700">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {language === 'bn' ? 'হটলাইন কল' : 'Direct Call'}
                  </span>
                  <a
                    href={`tel:${siteConfig.contactPhone.replace(/\s+/g, '')}`}
                    className="font-mono text-stone-900 font-semibold hover:text-emerald-800"
                  >
                    {siteConfig.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {language === 'bn' ? 'হোয়াটসঅ্যাপ ডেস্ক' : 'WhatsApp Support'}
                  </span>
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-stone-900 font-semibold hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    <span>+{siteConfig.whatsappNumber}</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {language === 'bn' ? 'ইমেইল অনুসন্ধান' : 'Email Address'}
                  </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-stone-900 font-semibold hover:text-emerald-800"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {language === 'bn' ? 'সেবার সময়' : 'Working Hours'}
                  </span>
                  <span className="text-stone-800">{t.common.operatingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <span className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                {t.contactPage.visitUsTitle}
              </span>
              <p className="text-sm text-stone-700 leading-relaxed mb-3">
                {getText(siteConfig.address)}
              </p>
              <a
                href="https://maps.google.com/?q=Banani,Dhaka,Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.contactPage.mapDirections}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-9 shadow-lg sm:shadow-xl shadow-stone-200/60">
          {submitted ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mb-4 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">
                {t.contactPage.successTitle}
              </h3>
              <p className="text-stone-600 text-base max-w-md mx-auto mb-6">
                {t.contactPage.successMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setContactForm({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                  });
                }}
                className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-base font-bold transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {t.contactPage.formTitle}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {t.contactPage.formSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 font-mono">
                    {t.contactPage.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) => {
                      setContactForm({ ...contactForm, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                    }}
                    className={`w-full py-3 px-4 text-base rounded-xl bg-stone-50 border ${
                      formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
                    } transition-all`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 font-mono">
                    {t.contactPage.phone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    value={contactForm.phone}
                    onChange={(e) => {
                      setContactForm({ ...contactForm, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    className={`w-full py-3 px-4 text-base rounded-xl bg-stone-50 border ${
                      formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
                    } transition-all`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 font-mono">
                    {t.contactPage.email}
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full py-3 px-4 text-base rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 font-mono">
                    {t.contactPage.subject}
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full py-3 px-4 text-base rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 font-mono">
                  {t.contactPage.message} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, message: e.target.value });
                    if (formErrors.message) setFormErrors({ ...formErrors, message: '' });
                  }}
                  className={`w-full py-3 px-4 text-base rounded-xl bg-stone-50 border ${
                    formErrors.message ? 'border-red-400 bg-red-50/30' : 'border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
                  } transition-all`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                {t.contactPage.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
