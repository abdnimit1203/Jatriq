import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { validateBusinessWhatsApp } from '../lib/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t, language } = useLanguage();
  const { config } = useData();

  const rawNumber = (config.whatsappNumber || '8801812345678').replace(/[^0-9]/g, '');

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-3">
        {showTooltip && (
          <div className="hidden sm:block bg-stone-900 text-stone-100 text-xs px-3 py-1.5 rounded-lg shadow-lg border border-stone-800 whitespace-nowrap animate-in fade-in duration-150">
            {language === 'bn' ? 'হোয়াটসঅ্যাপে তাৎক্ষণিক সহায়তা নিন' : 'Chat directly with tour specialists'}
          </div>
        )}

        <a
          href={`https://wa.me/${rawNumber}?text=${encodeURIComponent(
            language === 'bn'
              ? 'আসসালামু আলাইকুম, আমি যাত্রিক ওয়েবসাইট থেকে ট্যুর প্যাকেজ সম্পর্কে জানতে চাচ্ছি।'
              : 'Hello, I would like to inquire about tour packages on Jatriq.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-700/50 hover:scale-105 active:scale-95 transition-all focus:outline-hidden focus-visible:ring-4 focus-visible:ring-emerald-700/40 ring-2 ring-white/80"
          aria-label={t.common.whatsappChat}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>

    </>
  );
};
