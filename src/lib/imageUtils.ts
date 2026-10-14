/**
 * Helper to safely resolve and normalize image URLs across web and local environments.
 * Supports:
 * - Direct web links (e.g., Unsplash, Cloudinary, Imgur, direct https:// links)
 * - Vite static asset paths (e.g., /src/assets/images/...)
 * - Public directory paths (e.g., /images/...)
 * - Renamed filenames with or without timestamps (e.g., hero_sajek_sunrise.jpg vs hero_sajek_sunrise_1791788897775.jpg)
 * - Fallbacks for broken links or network timeouts
 */

export const DEFAULT_FALLBACK_IMAGES = {
  sajek: '/images/hero_sajek_sunrise_1791788897775.jpg',
  coxsbazar: '/images/coxs_bazar_sunset_1791788910726.jpg',
  sylhet: '/images/sylhet_tea_gardens_1791788922427.jpg',
  sundarbans: '/images/sundarbans_mangrove_1791788934964.jpg',
  bandarban: '/images/bandarban_hills_1791788946228.jpg',
  general: '/images/hero_sajek_sunrise_1791788897775.jpg',
};

// Known local file mappings to guarantee images always load
const LOCAL_NAME_MAP: Record<string, string> = {
  'hero_sajek_sunrise.jpg': '/images/hero_sajek_sunrise_1791788897775.jpg',
  'sajek.jpg': '/images/hero_sajek_sunrise_1791788897775.jpg',
  'sajek_sunrise.jpg': '/images/hero_sajek_sunrise_1791788897775.jpg',
  'sajek_valley.jpg': '/images/hero_sajek_sunrise_1791788897775.jpg',
  'sylhet_tea_gardens.jpg': '/images/sylhet_tea_gardens_1791788922427.jpg',
  'sylhet.jpg': '/images/sylhet_tea_gardens_1791788922427.jpg',
  'sundarbans_mangrove.jpg': '/images/sundarbans_mangrove_1791788934964.jpg',
  'sundarbans.jpg': '/images/sundarbans_mangrove_1791788934964.jpg',
  'coxs_bazar_sunset.jpg': '/images/coxs_bazar_sunset_1791788910726.jpg',
  'coxsbazar.jpg': '/images/coxs_bazar_sunset_1791788910726.jpg',
  'coxs_bazar.jpg': '/images/coxs_bazar_sunset_1791788910726.jpg',
  'bandarban_hills.jpg': '/images/bandarban_hills_1791788946228.jpg',
  'bandarban.jpg': '/images/bandarban_hills_1791788946228.jpg',
};

export function resolveImageUrl(url?: string | null, fallbackKey: keyof typeof DEFAULT_FALLBACK_IMAGES = 'general'): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_FALLBACK_IMAGES[fallbackKey] || DEFAULT_FALLBACK_IMAGES.general;
  }

  const trimmed = url.trim().replace(/^['"]|['"]$/g, '');

  // 1. Direct web URLs (https://, http://, data:)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Extract base filename if it's a path
  const filename = trimmed.split('/').pop() || '';

  // Check known mapping for renamed files
  if (LOCAL_NAME_MAP[filename.toLowerCase()]) {
    return LOCAL_NAME_MAP[filename.toLowerCase()];
  }

  // 2. Handle /src/assets/images/... or src/assets/images/... -> normalize to /images/...
  if (trimmed.includes('assets/images/')) {
    const assetFile = trimmed.split('assets/images/').pop() || '';
    if (LOCAL_NAME_MAP[assetFile.toLowerCase()]) {
      return LOCAL_NAME_MAP[assetFile.toLowerCase()];
    }
    return `/images/${assetFile}`;
  }

  // 3. Handle /images/... or images/...
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }
  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  // 4. Handle keyword fuzzy matching for renamed image files
  const lower = trimmed.toLowerCase();
  if (lower.includes('sajek')) return DEFAULT_FALLBACK_IMAGES.sajek;
  if (lower.includes('bandarban')) return DEFAULT_FALLBACK_IMAGES.bandarban;
  if (lower.includes('cox') || lower.includes('bazar')) return DEFAULT_FALLBACK_IMAGES.coxsbazar;
  if (lower.includes('sylhet') || lower.includes('tea')) return DEFAULT_FALLBACK_IMAGES.sylhet;
  if (lower.includes('sundarban') || lower.includes('mangrove')) return DEFAULT_FALLBACK_IMAGES.sundarbans;

  // 5. Bare filename with image extension
  if (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.webp') || trimmed.endsWith('.svg') || trimmed.endsWith('.jpeg')) {
    return `/images/${trimmed}`;
  }

  return trimmed;
}

export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackCategory?: keyof typeof DEFAULT_FALLBACK_IMAGES
) {
  const target = event.currentTarget;
  const currentSrc = target.src;
  const fallback = DEFAULT_FALLBACK_IMAGES[fallbackCategory || 'general'];

  // Prevent infinite error loop if fallback also fails
  if (!target.dataset.triedFallback) {
    target.dataset.triedFallback = 'true';
    
    // If it was trying /src/assets/images/..., try /images/...
    if (currentSrc.includes('/src/assets/images/')) {
      const filename = currentSrc.split('/').pop();
      if (filename) {
        target.src = resolveImageUrl(filename);
        return;
      }
    }

    target.src = fallback;
  }
}
