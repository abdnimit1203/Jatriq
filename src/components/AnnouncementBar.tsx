import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig } from '../config/siteConfig';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem('jatriq_dismiss_announcement') !== 'true';
    } catch {
      return true;
    }
  });

  const { getText } = useLanguage();

  if (!siteConfig.announcementBar.enabled || !visible) {
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

  return (
    <div className="relative bg-stone-900 text-stone-200 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
          <span className="truncate sm:whitespace-normal">
            {getText(siteConfig.announcementBar.text)}
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-stone-400 hover:text-white transition-colors p-1 rounded hover:bg-stone-800 shrink-0"
          aria-label="Dismiss offer banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
