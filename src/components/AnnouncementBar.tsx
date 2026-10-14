import React, { useState } from 'react';
import ReactFastMarquee from 'react-fast-marquee';
const Marquee = (ReactFastMarquee as any).default || ReactFastMarquee;
import { X, Sparkles, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem('jatriq_dismiss_announcement') !== 'true';
    } catch {
      return true;
    }
  });

  const { getText } = useLanguage();
  const { config } = useData();

  if (!config.announcementBar.enabled || !visible) {
    return null;
  }

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem('jatriq_dismiss_announcement', 'true');
    } catch {
      // ignore
    }
  };

  const announcementText = getText(config.announcementBar.text);

  return (
    <div className="relative bg-stone-900 text-stone-200 text-xs py-2 overflow-hidden border-b border-stone-800 transition-all select-none">
      <div className="flex items-center justify-between w-full">
        {/* Left static badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/10 text-amber-300 font-semibold text-[11px] uppercase tracking-wider rounded-r-full shrink-0 z-10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Notice</span>
        </div>

        {/* Marquee Container with smooth endless scroll */}
        <div className="flex-1 overflow-hidden mx-2 sm:mx-4">
          <Marquee
            gradient={false}
            speed={38}
            pauseOnHover={true}
            className="flex items-center overflow-hidden"
          >
            <div className="flex items-center gap-8 pr-8 font-medium">
              <span className="inline-flex items-center gap-2">
                <Tag className="w-3 h-3 text-emerald-400 shrink-0" />
                {announcementText}
              </span>
              <span className="text-stone-600 font-bold">•</span>
              <span className="inline-flex items-center gap-2 text-stone-300">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                {announcementText}
              </span>
              <span className="text-stone-600 font-bold">•</span>
            </div>
          </Marquee>
        </div>

        {/* Dismiss Button with subtle scrim */}
        <div className="pr-3 pl-2 shrink-0 z-10 bg-gradient-to-l from-stone-900 via-stone-900 to-transparent flex items-center">
          <button
            onClick={handleDismiss}
            className="text-stone-400 hover:text-white transition-colors p-1 rounded-md hover:bg-stone-800 focus:outline-hidden focus:ring-1 focus:ring-stone-500 shrink-0 cursor-pointer"
            aria-label="Dismiss announcement banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
