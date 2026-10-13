import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { validateBusinessWhatsApp } from '../lib/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t, language } = useLanguage();
  const { config } = useData();

  const validation = validateBusinessWhatsApp(config.whatsappNumber);

  const handleClick = (e: React.MouseEvent) => {
    if (!validation.isValidNumber) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
        {showTooltip && (
          <div className="hidden sm:block bg-stone-900 text-stone-100 text-xs px-3 py-1.5 rounded-lg shadow-lg border border-stone-800 whitespace-nowrap animate-in fade-in duration-150">
            {language === 'bn' ? 'হোয়াটসঅ্যাপে তাৎক্ষণিক সহায়তা নিন' : 'Chat directly with tour specialists'}
          </div>
        )}

        <a
          href={`https://wa.me/${validation.sanitizedNumber || '8801711000000'}?text=${encodeURIComponent(
            language === 'bn'
              ? 'আসসালামু আলাইকুম, আমি যাত্রিক ওয়েবসাইট থেকে ট্যুর প্যাকেজ সম্পর্কে জানতে চাচ্ছি।'
              : 'Hello, I would like to inquire about tour packages on Jatriq.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:shadow-emerald-700/50 hover:scale-108 active:scale-95 transition-all focus:outline-hidden focus-visible:ring-4 focus-visible:ring-emerald-700/40 ring-2 ring-white/80"
          aria-label={t.common.whatsappChat}
        >
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        </a>
      </div>

      {/* Demo notice modal if phone number is placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'bn' ? 'হোয়াটসঅ্যাপ কনফিগারেশন' : 'Agency WhatsApp Setup Notice'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              {language === 'bn'
                ? `বর্তমানে সাইটে একটি ডেমো নম্বর (${config.contactPhone}) দেওয়া আছে। আপনার আসল এজেন্সি নম্বরটি সক্রিয় করতে অ্যাডমিন প্যানেল বা 'src/config/siteConfig.ts' ফাইলের 'whatsappNumber' প্রোপার্টি পরিবর্তন করুন।`
                : `The site is currently configured with a demo placeholder (${config.contactPhone}). To connect real incoming inquiries to your travel agency WhatsApp, edit 'whatsappNumber' in the Admin Panel or 'src/config/siteConfig.ts'.`}
            </p>
            <div className="bg-stone-100 p-3 rounded-lg text-xs font-mono text-stone-800 mb-5 break-all">
              siteConfig.whatsappNumber = "8801XXXXXXXXX"
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                {t.common.close}
              </button>
              <a
                href={`https://wa.me/8801711000000`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                {language === 'bn' ? 'ডেমো লিংক পরীক্ষা করুন' : 'Test Demo Link'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
