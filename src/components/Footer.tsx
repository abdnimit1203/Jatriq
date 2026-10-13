import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { t, getText, language } = useLanguage();
  const { config } = useData();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" variant="light" showTagline={true} />
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {getText(config.tagline)}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900 hover:text-white transition-colors text-xs font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.common.whatsappChat}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Top Destinations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4 font-mono">
              {t.nav.destinations}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/packages?dest=sajek-valley" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'সাজেক ভ্যালি মেঘের রাজ্য' : 'Sajek Valley Cloud Peaks'}
                </Link>
              </li>
              <li>
                <Link to="/packages?dest=coxs-bazar" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'কক্সবাজার ও ইনানী বিচ' : 'Cox’s Bazar Beach & Marine Drive'}
                </Link>
              </li>
              <li>
                <Link to="/packages?dest=sreemangal-sylhet" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'শ্রীমঙ্গল ও সিলেট চা বাগান' : 'Sreemangal Tea Highlands'}
                </Link>
              </li>
              <li>
                <Link to="/packages?dest=sundarbans" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'সুন্দরবন ম্যানগ্রোভ সাফারি' : 'Sundarbans Mangrove Safari'}
                </Link>
              </li>
              <li>
                <Link to="/packages?dest=bandarban" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'বান্দরবান নীলগিরি ও পাহাড়' : 'Bandarban Nilgiri Sky Ridge'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4 font-mono">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-emerald-400 transition-colors">
                  {t.nav.packages}
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-emerald-400 transition-colors">
                  {t.nav.bookNow}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4 font-mono">
              {t.nav.contact}
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{getText(config.address)}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${config.contactPhone.replace(/\s+/g, '')}`} className="hover:text-emerald-300">
                  {config.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-emerald-300">
                  {config.email}
                </a>
              </li>
              <li className="pt-2 text-xs text-stone-500">
                {t.common.operatingHours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Demo Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} {config.agencyName}. {t.common.allRightsReserved}</span>
            <span aria-hidden="true">&middot;</span>
            <Link to="/admin" className="text-stone-400 hover:text-stone-200 transition-colors">
              Agency Demo Login
            </Link>
          </div>

          <div className="text-center md:text-right text-stone-400 max-w-xl">
            <span className="inline-block bg-stone-800/80 px-2.5 py-1 rounded text-stone-400 text-[11px]">
              {t.common.demoNotice}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
