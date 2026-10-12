# Jatriq (যাত্রিক) — Premium Bangladesh Tour Operator Website Template

**Jatriq** is a production-grade, highly customizable, and reusable tour operator website built for Bangladeshi travel agencies and tour management companies. It features cinematic landscape photography, authentic Bengali and English bilingual localization, dynamic package filtering, and direct WhatsApp booking inquiry generation.

---

## 🌟 Key Features

- **Cinematic Visual Identity**: Forest green (`#064e3b` / `#065f46`), warm ivory, and deep charcoal styling tailored for Bangladesh travel aesthetics.
- **Bilingual Support (Bangla & English)**: Centralized translation system (`src/locales/bn.ts` and `src/locales/en.ts`) with persistent `localStorage` preference and native digit formatting (`০-৯` vs `0-9`).
- **Curated Bangladesh Tour Packages**: Complete day-by-day itineraries, inclusions, exclusions, transport, and lodging for:
  - Sajek Valley (সাজেক ভ্যালি মেঘের রাজ্য)
  - Cox's Bazar & Marine Drive (কক্সবাজার ও ইনানী সৈকত)
  - Sreemangal & Sylhet (শ্রীমঙ্গল ও চা বাগান)
  - Sundarbans Mangrove (সুন্দরবন রয়্যাল বেঙ্গল ক্রুজ)
  - Bandarban & Nilgiri (বান্দরবান নীলগিরি ও পাহাড়)
  - Saint Martin's Island (সেন্টমার্টিন প্রবাল দ্বীপ)
- **Direct WhatsApp Booking Engine**: Validates customer details and generates formatted, URL-encoded `wa.me` booking inquiries with pre-filled package and traveler data.
- **Zero-Pill Anti-Slop Design**: Follows professional design standards without candy-colored pills or artificial status clutter.
- **Mobile-First & Fully Responsive**: Tested across smartphone, tablet, laptop, and 4K desktop viewports with strict sticky-surface governance.
- **Ready for Deployment**: Pre-configured for standard Vite hosting, Vercel, and Netlify with single-page app (SPA) fallback rules.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open `http://localhost:3000` to preview the site.

### 3. Production Build & Linting

```bash
# Type check and lint
npm run lint

# Build production bundle
npm run build
```

---

## 🎨 How to Customize for Any Agency (Agency White-Labeling)

### 1. Central Agency Configuration (`src/config/siteConfig.ts`)

To re-brand the website for a client, simply edit `src/config/siteConfig.ts`:

```typescript
export const siteConfig: SiteConfig = {
  agencyName: 'Your Agency Name', // e.g. 'Green Bengal Tours'
  brandMark: 'আপনার ব্র্যান্ড',
  tagline: {
    bn: 'আপনার পছন্দের বাংলা স্লোগান',
    en: 'Your custom English tagline here',
  },
  contactPhone: '+880 1711-XXXXXX',
  // WhatsApp number in international digits only (no spaces, no +):
  whatsappNumber: '8801711XXXXXX',
  isPlaceholderContact: false,
  email: 'info@youragency.com',
  address: {
    bn: 'অফিসের বাংলা ঠিকানা',
    en: 'Office address in English',
  },
  facebookUrl: 'https://facebook.com/youragency',
  instagramUrl: 'https://instagram.com/youragency',
  defaultLanguage: 'bn', // 'bn' or 'en'
  availableLanguages: ['bn', 'en'],
  currency: {
    symbol: '৳',
    code: 'BDT',
    name: { bn: 'টাকা', en: 'BDT' },
  },
  announcementBar: {
    enabled: true,
    text: {
      bn: 'আপনার বিশেষ অফার ব্যানার মেসেজ',
      en: 'Your promotional seasonal offer banner',
    },
  },
};
```

### 2. Adding or Modifying Tour Packages (`src/data/packages.ts`)

Every package adheres to the `TourPackage` TypeScript interface. To add a new tour:

```typescript
{
  id: 'my-custom-tour',
  slug: 'my-custom-tour',
  category: 'hill-tracts', // 'hill-tracts' | 'beach' | 'tea-gardens' | 'wildlife' | 'island'
  categoryLabel: { bn: 'পাহাড় ও ঝরনা', en: 'Hills & Waterfalls' },
  destination: { bn: 'রাঙ্গামাটি কাপ্তাই লেক', en: 'Rangamati Kaptai Lake' },
  title: { bn: 'কাপ্তাই লেক বোট ক্রুজ', en: 'Kaptai Lake Boat Cruise' },
  shortDescription: { bn: '...', en: '...' },
  detailedDescription: { bn: '...', en: '...' },
  duration: { days: 2, nights: 1, text: { bn: '২ দিন / ১ রাত', en: '2 Days / 1 Night' } },
  priceBDT: 5500,
  coverImage: '/src/assets/images/...',
  galleryImages: ['/src/assets/images/...'],
  maxGroupSize: 15,
  featured: true,
  accommodation: { bn: '...', en: '...' },
  transport: { bn: '...', en: '...' },
  departurePoint: { bn: '...', en: '...' },
  itinerary: [
    {
      day: 1,
      title: { bn: '...', en: '...' },
      description: { bn: '...', en: '...' },
      highlights: { bn: ['...'], en: ['...'] }
    }
  ],
  included: { bn: ['...'], en: ['...'] },
  excluded: { bn: ['...'], en: ['...'] },
  importantNotes: { bn: ['...'], en: ['...'] }
}
```

### 3. Updating Translations (`src/locales/`)

- Bangla dictionary: `src/locales/bn.ts`
- English dictionary: `src/locales/en.ts`

Both share identical keys for menus, forms, validation errors, and common labels.

---

## 🌐 Deploying to Production

### Deploying to Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects are automatically handled via `public/_redirects`.

### Deploying to Vercel
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Single-page application rewrites are already configured in `vercel.json`.

---

## 📄 License & Intellectual Property
Built as a reusable agency template. All rights reserved by the respective license owner.
