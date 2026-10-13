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

## 🛠️ Agency Admin Panel (Frontend-Only Demo)

Jatriq includes a functional, single-agency **Admin Panel** to demonstrate how travel agencies can manage tours and agency branding without touching `.ts` source files.

### 🔑 Demo Login Credentials
- **URL**: `/admin` (or click "Agency Demo Login" in the footer)
- **Username**: `admin`
- **Password**: `admin`

> ⚠️ **Security Limitation Disclosure**:  
> This admin panel is a **client-side demonstration** intended for client presentations and local evaluations. Authentication is simulated in the browser session, and tour packages are stored in browser `localStorage`. It does **not** replace a secure backend with server-enforced authentication, and sensitive credentials must never be stored in the frontend.

### 📋 Admin Capabilities
1. **Live Tour Package Management**:
   - **Create**: Add new tour packages with bilingual titles, pricing in BDT, durations, categories, cover image, itineraries, inclusions, exclusions, and logistics notes.
   - **Edit**: Modify existing package details, pricing, itineraries, and descriptions.
   - **Delete**: Remove tour packages with modal confirmation.
   - **Featured Toggle**: Promote packages directly to the homepage carousel/grid with one click.
   - **Search & Filter**: Real-time package search across titles, destinations, and IDs.
   - **Live Public Sync**: Any changes made in the admin panel immediately reflect across the public website (`/`, `/packages`, `/packages/:slug`, and `/booking`).

2. **JSON Import & Export**:
   - **Export**: Download current tour packages as a structured `jatriq-tour-packages-YYYY-MM-DD.json` file.
   - **Import**: Upload any package JSON file with instant schema validation, error feedback, and preview confirmation before applying.
   - **Template**: Download a sample schema-compliant JSON template with one click.
   - **Reset**: Revert tour packages back to the original handcrafted Bangladesh sample packages at any time.

3. **Agency Settings Management**:
   - Update agency business name, taglines, phone numbers, WhatsApp dispatch number, office address, and business hours.
   - Persists in `localStorage` and syncs with the public website header, footer, floating buttons, and booking message generator.

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

---

## 🌐 Deploying to Production

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

### Deploying to Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18+ / 20+
- **Environment variables**: None required for standard static hosting.
- **SPA Fallback**: Single-page application redirects are automatically handled via `public/_redirects` (`/*  /index.html  200`).

### Deploying to Vercel
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **SPA Rewrites**: Single-page application rewrites are configured in `vercel.json`.

---

## ⚠️ Static Frontend Architecture & Honest Operational Boundaries

1. **No Persistent Backend Database**:
   - This project is a client-side React SPA without a database or backend server.
   - The booking form (`/booking`) does **not** store reservations on a server or process payments; it validates traveler inputs and prepares a formatted, URL-encoded inquiry dispatched directly to the agency's official WhatsApp desk via `https://wa.me/`.
   - The booking form includes duplicate-click submission prevention and copy-to-clipboard fallbacks in case popup blockers obstruct WhatsApp.

2. **Package Reporting Mechanism**:
   - The "Report this listing" feature on `/packages/:slug` does **not** write to a backend server.
   - It prepares a structured issue report with the package slug, reason, and notes, and opens the user's default email client (`mailto:`) directed to `siteConfig.reportingEmail` (or provides a copyable summary).

3. **Verification Metadata**:
   - Demo tour packages and the sample agency profile in this template are explicitly flagged as **unverified** (`isVerifiedPackage: false`, `isVerifiedAgency: false`).
   - The frontend displays an honest "Demo Listing (Unverified Sample)" status badge on package detail views to prevent deceptive representations.

4. **Agency Contact Details**:
   - The default configuration uses demo placeholder numbers (`8801711000000`). Travel agencies deploying this template must update `src/config/siteConfig.ts` with their legitimate WhatsApp and phone numbers.

---

## 📄 License & Intellectual Property
Built as a reusable agency template. All rights reserved by the respective license owner.
