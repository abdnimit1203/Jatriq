import { SiteConfig } from '../types';

/**
 * Jatriq Tour Operator Central Configuration
 * Customize this single file to completely re-brand the website for any travel agency.
 */
export const siteConfig: SiteConfig = {
  agencyName: 'Jatriq',
  brandMark: 'যাত্রিক',
  tagline: {
    bn: 'বাংলার রূপ ও প্রকৃতির সাথে বিশ্বস্ত ভ্রমণের সঙ্গী',
    en: 'Curated Journeys Across the Beauty of Bangladesh',
  },
  // Real or demo phone format:
  contactPhone: '+880 1711-000000',
  // WhatsApp number in international format digits only without plus sign:
  whatsappNumber: '8801711000000',
  // If true, shows a helpful setup notice when WhatsApp booking is triggered
  isPlaceholderContact: false,
  email: 'contact@jatriq-tours.com',
  address: {
    bn: 'হাউস ৪২, রোড ১১, ব্লক-ডি, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
    en: 'House 42, Road 11, Block-D, Banani, Dhaka-1213, Bangladesh',
  },
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  defaultLanguage: 'bn',
  availableLanguages: ['bn', 'en'],
  currency: {
    symbol: '৳',
    code: 'BDT',
    name: {
      bn: 'টাকা',
      en: 'BDT',
    },
  },
  announcementBar: {
    enabled: true,
    text: {
      bn: '🌿 সাজেক ও বান্দরবান মেঘের রাজ্যে বিশেষ গ্রুপ ট্যুর বুকিং চলছে! দ্রুত বুকিংয়ে ছাড়।',
      en: '🌿 Early Bird Bookings open for Sajek Valley & Bandarban Hill Tours! Limited slots.',
    },
  },
};
