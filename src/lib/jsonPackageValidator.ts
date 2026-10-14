import { TourPackage } from '../types';

export interface ValidationResult {
  isValid: boolean;
  packages: TourPackage[];
  errors: string[];
  warnings: string[];
}

/**
 * Validates whether an unknown parsed JSON object is an array of valid TourPackage objects.
 */
export function validateTourPackagesJson(parsedData: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(parsedData)) {
    return {
      isValid: false,
      packages: [],
      errors: ['Invalid format: Root element must be a JSON array of packages (e.g. `[{ ... }, { ... }]`).'],
      warnings: [],
    };
  }

  if (parsedData.length === 0) {
    return {
      isValid: false,
      packages: [],
      errors: ['The JSON array is empty. At least one tour package must be provided.'],
      warnings: [],
    };
  }

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const validatedPackages: TourPackage[] = [];

  const allowedCategories = ['hill-tracts', 'beach', 'tea-gardens', 'wildlife', 'island'];

  parsedData.forEach((item, index) => {
    const itemPrefix = `Package #${index + 1}`;

    if (!item || typeof item !== 'object') {
      errors.push(`${itemPrefix}: Item is not a valid JSON object.`);
      return;
    }

    const pkg = item as Record<string, unknown>;

    // 1. Check ID
    if (!pkg.id || typeof pkg.id !== 'string') {
      errors.push(`${itemPrefix}: Missing or invalid "id" (string required).`);
    } else if (seenIds.has(pkg.id)) {
      errors.push(`${itemPrefix}: Duplicate id "${pkg.id}" found. Package IDs must be unique.`);
    } else {
      seenIds.add(pkg.id);
    }

    // 2. Check Slug
    if (!pkg.slug || typeof pkg.slug !== 'string') {
      errors.push(`${itemPrefix}: Missing or invalid "slug" (string required, e.g. "sajek-tour").`);
    } else if (seenSlugs.has(pkg.slug)) {
      errors.push(`${itemPrefix}: Duplicate slug "${pkg.slug}" found. Package slugs must be unique.`);
    } else {
      seenSlugs.add(pkg.slug);
    }

    // 3. Category
    if (!pkg.category || typeof pkg.category !== 'string' || !allowedCategories.includes(pkg.category)) {
      errors.push(
        `${itemPrefix}: Invalid "category". Must be one of: ${allowedCategories.join(', ')}.`
      );
    }

    // 4. Bilingual Titles
    if (!pkg.title || typeof pkg.title !== 'object' || !(pkg.title as any).bn || !(pkg.title as any).en) {
      errors.push(`${itemPrefix}: "title" must be an object with both "bn" and "en" strings.`);
    }

    // 5. Destination
    if (!pkg.destination || typeof pkg.destination !== 'object' || !(pkg.destination as any).bn || !(pkg.destination as any).en) {
      errors.push(`${itemPrefix}: "destination" must be an object with both "bn" and "en" strings.`);
    }

    // 6. Price
    if (typeof pkg.priceBDT !== 'number' || pkg.priceBDT < 0) {
      errors.push(`${itemPrefix}: "priceBDT" must be a positive number.`);
    }

    // 7. Duration
    if (
      !pkg.duration ||
      typeof pkg.duration !== 'object' ||
      typeof (pkg.duration as any).days !== 'number' ||
      typeof (pkg.duration as any).nights !== 'number'
    ) {
      errors.push(`${itemPrefix}: "duration" must be an object with "days" (number), "nights" (number), and "text" (bilingual object).`);
    }

    // 8. Descriptions
    if (!pkg.shortDescription || typeof pkg.shortDescription !== 'object') {
      errors.push(`${itemPrefix}: "shortDescription" must be a bilingual object with "bn" and "en".`);
    }

    // 9. Cover Image
    if (!pkg.coverImage || typeof pkg.coverImage !== 'string') {
      warnings.push(`${itemPrefix}: "coverImage" is missing or not a string path; fallback graphic will be displayed.`);
    }

    // 10. Itinerary array
    if (!Array.isArray(pkg.itinerary) || pkg.itinerary.length === 0) {
      warnings.push(`${itemPrefix}: "itinerary" array is empty. At least one day is recommended.`);
    }

    // 11. Inclusions / Exclusions
    if (!pkg.included || !Array.isArray((pkg.included as any).bn) || !Array.isArray((pkg.included as any).en)) {
      warnings.push(`${itemPrefix}: "included" is missing proper "bn" and "en" string arrays.`);
    }

    // Prepare normalized package
    const normalized: TourPackage = {
      id: String(pkg.id || `pkg-${Date.now()}-${index}`),
      slug: String(pkg.slug || `package-${index}`),
      category: (allowedCategories.includes(pkg.category as string)
        ? pkg.category
        : 'hill-tracts') as TourPackage['category'],
      categoryLabel: (pkg.categoryLabel as any) || { bn: 'ট্যুর প্যাকেজ', en: 'Tour Package' },
      destination: (pkg.destination as any) || { bn: 'বাংলাদেশ', en: 'Bangladesh' },
      title: (pkg.title as any) || { bn: 'নতুন ট্যুর', en: 'New Tour' },
      shortDescription: (pkg.shortDescription as any) || { bn: 'সংক্ষিপ্ত বিবরণ', en: 'Short overview' },
      detailedDescription: (pkg.detailedDescription as any) || { bn: 'বিস্তারিত বিবরণ', en: 'Detailed description' },
      duration: (pkg.duration as any) || {
        days: 3,
        nights: 2,
        text: { bn: '৩ দিন / ২ রাত', en: '3 Days / 2 Nights' },
      },
      priceBDT: Number(pkg.priceBDT) || 5000,
      coverImage: String(pkg.coverImage || '/images/hero_sajek_sunrise_1791788897775.jpg'),
      galleryImages: Array.isArray(pkg.galleryImages) ? (pkg.galleryImages as string[]) : [],
      itinerary: Array.isArray(pkg.itinerary) ? (pkg.itinerary as any) : [],
      included: (pkg.included as any) || { bn: ['পরিবহন ও হোটেল'], en: ['Transport and hotel'] },
      excluded: (pkg.excluded as any) || { bn: ['ব্যক্তিগত খরচ'], en: ['Personal expenses'] },
      accommodation: (pkg.accommodation as any) || { bn: 'স্ট্যান্ডার্ড রিসোর্ট', en: 'Standard Resort' },
      transport: (pkg.transport as any) || { bn: 'এসি বাস', en: 'AC Coach' },
      departurePoint: (pkg.departurePoint as any) || { bn: 'ঢাকা', en: 'Dhaka' },
      importantNotes: (pkg.importantNotes as any) || {
        bn: ['জাতীয় পরিচয়পত্র সাথে রাখুন।'],
        en: ['Carry your National ID.'],
      },
      featured: Boolean(pkg.featured),
      maxGroupSize: Number(pkg.maxGroupSize) || 15,
      isVerifiedPackage: Boolean(pkg.isVerifiedPackage),
    };

    validatedPackages.push(normalized);
  });

  return {
    isValid: errors.length === 0,
    packages: validatedPackages,
    errors,
    warnings,
  };
}

/**
 * Triggers a browser download of the packages as a JSON file.
 */
export function exportPackagesToJsonFile(packages: TourPackage[]): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `jatriq-packages-${dateStr}.json`;
  const jsonContent = JSON.stringify(packages, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Triggers a download of a minimal sample JSON format for agencies to understand.
 */
export function downloadSamplePackageJson(): void {
  const sample = [
    {
      id: 'sample-tour-1',
      slug: 'sample-tour-1',
      category: 'hill-tracts',
      categoryLabel: { bn: 'পাহাড় ও মেঘের উপত্যকা', en: 'Hill Tracts & Cloud Valley' },
      destination: { bn: 'সাজেক ভ্যালি, রাঙ্গামাটি', en: 'Sajek Valley, Rangamati' },
      title: { bn: 'নমুনা সাজেক ট্যুর প্যাকেজ', en: 'Sample Sajek Tour Package' },
      shortDescription: {
        bn: 'মেঘের ওপর কাঠের কটেজে রাতযাপন ও সূর্যোদয়।',
        en: 'Sleep above the clouds in wooden hill cottages and witness sunrises.',
      },
      detailedDescription: {
        bn: 'সাজেক ভ্যালির অন্যতম আকর্ষণীয় ট্যুর প্যাকেজ। ৩ দিনের সম্পূর্ণ ভ্রমণ পরিকল্পনা।',
        en: 'One of the most attractive tour packages to Sajek Valley.',
      },
      duration: {
        days: 3,
        nights: 2,
        text: { bn: '৩ দিন / ২ রাত', en: '3 Days / 2 Nights' },
      },
      priceBDT: 8500,
      coverImage: '/src/assets/images/hero_sajek_sunrise_1791788897775.jpg',
      galleryImages: ['/src/assets/images/hero_sajek_sunrise_1791788897775.jpg'],
      itinerary: [
        {
          day: 1,
          title: { bn: 'খাগড়াছড়ি থেকে সাজেক গমন', en: 'Transfer from Khagrachhari to Sajek' },
          description: {
            bn: 'সকালে পৌঁছে চান্দের গাড়িতে সাজেকের উদ্দেশ্যে যাত্রা।',
            en: 'Morning arrival and 4x4 Chander Gari mountain drive.',
          },
          highlights: { bn: ['চান্দের গাড়ি রাইড', 'হ্যালিপ্যাড সূর্যাস্ত'], en: ['Mountain Jeep Ride', 'Helipad Sunset'] },
        },
      ],
      included: {
        bn: ['ঢাকা-খাগড়াছড়ি এসি বাস', '২ রাত রিসোর্ট স্টে', 'সকল বেলার খাবার'],
        en: ['Dhaka-Khagrachhari AC bus', '2 nights resort stay', 'All meals'],
      },
      excluded: {
        bn: ['ব্যক্তিগত ওষুধ ও কেনাকাটা'],
        en: ['Personal medications and shopping'],
      },
      accommodation: { bn: 'সাজেক কাঠের কটেজ', en: 'Sajek Wooden Eco Cottage' },
      transport: { bn: 'এসি বাস ও ফোর হুইল চান্দের গাড়ি', en: 'AC Coach & 4x4 Chander Gari' },
      departurePoint: { bn: 'ঢাকা সায়েদাবাদ টার্মিনাল', en: 'Dhaka Sayedabad Terminal' },
      importantNotes: {
        bn: ['জাতীয় পরিচয়পত্রের কপি সাথে রাখুন।'],
        en: ['Carry your National ID copy.'],
      },
      featured: true,
      maxGroupSize: 12,
      isVerifiedPackage: false,
    },
  ];

  const jsonContent = JSON.stringify(sample, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'jatriq-sample-template.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
