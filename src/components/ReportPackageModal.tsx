import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2, Copy, Mail, ExternalLink } from 'lucide-react';
import { TourPackage, ReportReason, PackageReport } from '../types';
import { siteConfig } from '../config/siteConfig';
import { useLanguage } from '../context/LanguageContext';

interface ReportPackageModalProps {
  tour: TourPackage;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportPackageModal: React.FC<ReportPackageModalProps> = ({
  tour,
  isOpen,
  onClose,
}) => {
  const { language, getText } = useLanguage();

  const [reason, setReason] = useState<ReportReason>('inaccurate-info');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [copied, setCopied] = useState(false);
  const [preparedReport, setPreparedReport] = useState<{
    text: string;
    mailtoUrl: string | null;
  } | null>(null);

  if (!isOpen) return null;

  const reasonsList: { value: ReportReason; labelBn: string; labelEn: string }[] = [
    {
      value: 'inaccurate-info',
      labelBn: 'ভুল বা বিভ্রান্তিকর ভ্রমণ তথ্য (Inaccurate Information)',
      labelEn: 'Inaccurate or Misleading Travel Information',
    },
    {
      value: 'suspicious-pricing',
      labelBn: 'সন্দেহজনক মূল্য বা গোপন অতিরিক্ত ফি (Suspicious Pricing)',
      labelEn: 'Suspicious Pricing or Undisclosed Hidden Charges',
    },
    {
      value: 'expired-offer',
      labelBn: 'মেয়াদোত্তীর্ণ বা অপ্রাপ্য অফার (Expired/Unavailable Offer)',
      labelEn: 'Expired or Unavailable Tour Schedule',
    },
    {
      value: 'copyright-issue',
      labelBn: 'ছবির বা লেখার স্বত্বাধিকার সমস্যা (Copyright/IP Issue)',
      labelEn: 'Copyright or Media Infringement Issue',
    },
    {
      value: 'safety-concern',
      labelBn: 'নিরাপত্তা বা রুট ঝুঁকি (Safety Concern)',
      labelEn: 'Safety Concern or High-Risk Route Discrepancy',
    },
    {
      value: 'other',
      labelBn: 'অন্যান্য কারণ (Other Issue)',
      labelEn: 'Other Concern',
    },
  ];

  const handlePrepareReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const selectedReasonLabel =
      language === 'bn'
        ? reasonsList.find((r) => r.value === reason)?.labelBn
        : reasonsList.find((r) => r.value === reason)?.labelEn;

    const reportBody = [
      `[Jatriq Tour Listing Report / প্যাকেজ রিপোর্ট]`,
      `Package: ${getText(tour.title)} (ID: ${tour.id}, Slug: ${tour.slug})`,
      `Agency: ${siteConfig.agencyName}`,
      `Reason: ${selectedReasonLabel}`,
      `Details:\n${details.trim()}`,
      contact.trim() ? `Reporter Contact: ${contact.trim()}` : null,
      `Timestamp: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const recipient = siteConfig.reportingEmail?.trim() || siteConfig.email;
    const subject = encodeURIComponent(
      `[Package Report] ${getText(tour.title)} - ${reason}`
    );
    const body = encodeURIComponent(reportBody);
    const mailto = recipient ? `mailto:${recipient}?subject=${subject}&body=${body}` : null;

    setPreparedReport({
      text: reportBody,
      mailtoUrl: mailto,
    });
  };

  const handleCopy = () => {
    if (preparedReport) {
      navigator.clipboard.writeText(preparedReport.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setPreparedReport(null);
    setDetails('');
    setContact('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h3 id="report-modal-title" className="text-lg font-bold text-stone-900">
              {language === 'bn' ? 'প্যাকেজটি রিপোর্ট করুন' : 'Report This Tour Listing'}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
          {preparedReport ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">
                    {language === 'bn' ? 'রিপোর্ট প্রস্তুত হয়েছে' : 'Report Prepared'}
                  </span>
                  {language === 'bn'
                    ? 'স্ট্যাটিক আর্কিটেকচারের কারণে আপনার রিপোর্টটি সরাসরি সার্ভারে সংরক্ষিত হয় না। এটি ইমেইল বা ক্লিপবোর্ডের মাধ্যমে পাঠানোর জন্য প্রস্তুত করা হয়েছে।'
                    : 'Because this is a static frontend, reports are prepared locally rather than stored in a backend database. You can dispatch it via email or copy the text.'}
                </div>
              </div>

              {!siteConfig.reportingEmail ? (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">
                      {language === 'bn'
                        ? 'রিপোর্টিং ইমেইল কনফিগার করা হয়নি'
                        : 'No Dedicated Reporting Contact Configured'}
                    </span>
                    {language === 'bn'
                      ? 'এজেন্সির সাইট কনফিগারেশনে ডেডিকেটেড কমপ্লায়েন্স ইমেইল দেওয়া নেই। আপনি সাধারণ ইমেইল বা মেসেজে রিপোর্ট কপি করে পাঠাতে পারেন।'
                      : 'The agency configuration in siteConfig.ts does not have a dedicated reporting email configured. You may copy the prepared text and send it to general support.'}
                  </div>
                </div>
              ) : null}

              {/* Prepared text box */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs font-mono text-stone-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {preparedReport.text}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {preparedReport.mailtoUrl && (
                  <a
                    href={preparedReport.mailtoUrl}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ইমেইল অ্যাপে খুলুন' : 'Send via Email App'}</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>
                    {copied
                      ? language === 'bn'
                        ? 'কপি হয়েছে!'
                        : 'Copied!'
                      : language === 'bn'
                      ? 'রিপোর্ট কপি করুন'
                      : 'Copy Report Text'}
                  </span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePrepareReport} className="space-y-4">
              {/* Static Disclaimer */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  {language === 'bn'
                    ? 'বিজ্ঞপ্তি: এটি ক্লায়েন্ট-সাইড ইন্টারফেস। তথ্যটি সরাসরি সার্ভারে সংরক্ষিত না হয়ে এজেন্সির কমপ্লায়েন্স ডেস্কে পাঠানোর জন্য ফরম্যাট করা হবে।'
                    : 'Notice: This frontend prepares the report for dispatch to agency compliance channels; it is not saved to a server database.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {language === 'bn' ? 'রিপোর্টের কারণ নির্বাচন করুন' : 'Select Reason'}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 text-stone-800"
                >
                  {reasonsList.map((r) => (
                    <option key={r.value} value={r.value}>
                      {language === 'bn' ? r.labelBn : r.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Explanation'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'কী কারণে এই প্যাকেজটি বিভ্রান্তিকর বা সমস্যাযুক্ত মনে হচ্ছে তা বিস্তারিত লিখুন...'
                      : 'Explain why this tour listing contains errors, broken terms, or suspicious information...'
                  }
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  {language === 'bn'
                    ? 'আপনার মোবাইল বা ইমেইল (ঐচ্ছিক)'
                    : 'Your Phone or Email (Optional)'}
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. 017xxxxxxxx or your@email.com"
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 text-stone-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!details.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
                >
                  {language === 'bn' ? 'রিপোর্ট প্রস্তুত করুন' : 'Prepare Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
