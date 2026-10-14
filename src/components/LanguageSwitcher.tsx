import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded-full border border-stone-200 bg-stone-100/90 p-0.5 text-xs font-medium text-stone-700 backdrop-blur-sm`}
    >
      <span className="sr-only">Change languages </span>
      <div className="pl-2 pr-1 text-stone-500">
        <Globe className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`rounded-full px-2.5 py-1 transition-all ${
          language === 'bn'
            ? 'bg-stone-900 text-stone-50 shadow-sm font-semibold'
            : 'text-stone-600 hover:text-stone-900'
        }`}
        aria-pressed={language === 'bn'}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-full px-2.5 py-1 transition-all ${
          language === 'en'
            ? 'bg-stone-900 text-stone-50 shadow-sm font-semibold'
            : 'text-stone-600 hover:text-stone-900'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
    </div>
  );
};
