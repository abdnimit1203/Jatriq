export type Language = 'bn' | 'en';

export interface BilingualText {
  bn: string;
  en: string;
}

export interface BilingualList {
  bn: string[];
  en: string[];
}

export interface ItineraryDay {
  day: number;
  title: BilingualText;
  description: BilingualText;
  highlights?: BilingualList;
}

export interface TourPackage {
  id: string;
  slug: string;
  category: 'hill-tracts' | 'beach' | 'tea-gardens' | 'wildlife' | 'island';
  categoryLabel: BilingualText;
  destination: BilingualText;
  title: BilingualText;
  shortDescription: BilingualText;
  detailedDescription: BilingualText;
  duration: {
    days: number;
    nights: number;
    text: BilingualText;
  };
  priceBDT: number;
  coverImage: string;
  galleryImages: string[];
  itinerary: ItineraryDay[];
  included: BilingualList;
  excluded: BilingualList;
  accommodation: BilingualText;
  transport: BilingualText;
  departurePoint: BilingualText;
  importantNotes: BilingualList;
  featured: boolean;
  maxGroupSize: number;
  difficulty?: BilingualText;
  isVerifiedPackage: boolean;
}

export interface DestinationInfo {
  id: string;
  name: BilingualText;
  region: BilingualText;
  image: string;
  packageCount: number;
  highlights: BilingualText;
}

export interface BookingInquiry {
  fullName: string;
  phone: string;
  email?: string;
  packageSlug: string;
  packageTitle?: string;
  travelDate: string;
  travelersCount: number;
  specialRequests?: string;
}

export type ReportReason =
  | 'inaccurate-info'
  | 'suspicious-pricing'
  | 'expired-offer'
  | 'copyright-issue'
  | 'safety-concern'
  | 'other';

export interface PackageReport {
  packageSlug: string;
  packageTitle: string;
  reason: ReportReason;
  details: string;
  reporterContact?: string;
}

export interface SiteConfig {
  agencyName: string;
  brandMark: string;
  tagline: BilingualText;
  contactPhone: string;
  whatsappNumber: string; // international format without spaces, e.g. "8801711234567"
  isPlaceholderContact: boolean;
  email: string;
  reportingEmail?: string; // dedicated compliance/reporting address (leave empty to simulate unconfigured)
  isVerifiedAgency: boolean;
  address: BilingualText;
  facebookUrl: string;
  instagramUrl: string;
  defaultLanguage: Language;
  availableLanguages: Language[];
  currency: {
    symbol: string;
    code: string;
    name: BilingualText;
  };
  announcementBar: {
    enabled: boolean;
    text: BilingualText;
  };
  categories?: string[];
}
