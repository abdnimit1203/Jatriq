import React, { createContext, useContext, useState, useEffect } from 'react';
import { TourPackage, SiteConfig } from '../types';
import { tourPackages as defaultPackages } from '../data/packages';
import { siteConfig as defaultConfig } from '../config/siteConfig';
import { resolveImageUrl } from '../lib/imageUtils';
import {
  subscribeToPackages,
  subscribeToSiteConfig,
  savePackageToFirestore,
  deletePackageFromFirestore,
  saveSiteConfigToFirestore,
  seedDefaultPackagesToFirestore,
} from '../lib/firebase';

const PACKAGES_STORAGE_KEY = 'jatriq_managed_packages';
const CONFIG_STORAGE_KEY = 'jatriq_managed_site_config';

const normalizePackage = (pkg: TourPackage): TourPackage => ({
  ...pkg,
  coverImage: resolveImageUrl(pkg.coverImage),
  galleryImages: (pkg.galleryImages && pkg.galleryImages.length > 0 ? pkg.galleryImages : [pkg.coverImage]).map(
    (img) => resolveImageUrl(img)
  ),
});

interface DataContextType {
  packages: TourPackage[];
  config: SiteConfig;
  isFirebaseActive: boolean;
  categories: string[];
  addCategory: (cat: string) => void;
  deleteCategory: (cat: string) => void;
  addPackage: (pkg: TourPackage) => Promise<void>;
  updatePackage: (pkg: TourPackage) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  importPackages: (imported: TourPackage[]) => Promise<{ success: boolean; count?: number; error?: string }>;
  resetPackagesToDefault: () => void;
  updateConfig: (newConfig: SiteConfig) => Promise<void>;
  resetConfigToDefault: () => void;
  getPackageBySlug: (slug: string) => TourPackage | undefined;
  seedFirestore: () => Promise<{ success: boolean; count: number }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFirebaseActive, setIsFirebaseActive] = useState(false);

  // 1. Initialize packages from localStorage or default
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizePackage);
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored packages:', err);
    }
    return defaultPackages.map(normalizePackage);
  });

  // 2. Initialize siteConfig from localStorage or default
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.agencyName) {
          return { ...defaultConfig, ...parsed };
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored site config:', err);
    }
    return defaultConfig;
  });

  // Real-time Firestore subscriptions on mount
  useEffect(() => {
    // Subscribe to cloud packages
    const unsubPackages = subscribeToPackages((cloudPackages) => {
      if (cloudPackages.length > 0) {
        setPackages(cloudPackages.map(normalizePackage));
        setIsFirebaseActive(true);
      } else {
        // If Firestore packages collection is empty, automatically seed the 6 default packages
        seedDefaultPackagesToFirestore(defaultPackages.map(normalizePackage)).then(() => {
          setIsFirebaseActive(true);
        }).catch((err) => {
          console.warn('Auto-seed packages note:', err);
        });
      }
    });

    // Subscribe to cloud site config
    const unsubConfig = subscribeToSiteConfig((cloudConfig) => {
      if (cloudConfig && cloudConfig.agencyName) {
        setConfig(cloudConfig);
        setIsFirebaseActive(true);
      }
    });

    return () => {
      unsubPackages();
      unsubConfig();
    };
  }, []);

  // Save packages to localStorage on change for offline resiliency
  useEffect(() => {
    try {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    } catch (err) {
      console.warn('Failed to save packages to localStorage:', err);
    }
  }, [packages]);

  // Save config to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.warn('Failed to save config to localStorage:', err);
    }
  }, [config]);

  const addPackage = async (pkg: TourPackage) => {
    const normalized = normalizePackage(pkg);
    setPackages((prev) => [normalized, ...prev]);
    try {
      await savePackageToFirestore(normalized);
      setIsFirebaseActive(true);
    } catch (err) {
      console.warn('Firestore write note:', err);
    }
  };

  const updatePackage = async (updated: TourPackage) => {
    const normalized = normalizePackage(updated);
    setPackages((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
    try {
      await savePackageToFirestore(normalized);
      setIsFirebaseActive(true);
    } catch (err) {
      console.warn('Firestore write note:', err);
    }
  };

  const deletePackage = async (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    try {
      await deletePackageFromFirestore(id);
      setIsFirebaseActive(true);
    } catch (err) {
      console.warn('Firestore delete note:', err);
    }
  };

  const toggleFeatured = async (id: string) => {
    const target = packages.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, featured: !target.featured };
    await updatePackage(updated);
  };

  const importPackages = async (imported: TourPackage[]) => {
    if (!Array.isArray(imported) || imported.length === 0) {
      return { success: false, error: 'Imported file contains no tour packages.' };
    }
    const normalized = imported.map(normalizePackage);
    setPackages(normalized);
    for (const p of normalized) {
      try {
        await savePackageToFirestore(p);
      } catch {
        // ignore individual write error
      }
    }
    setIsFirebaseActive(true);
    return { success: true, count: normalized.length };
  };

  const resetPackagesToDefault = () => {
    setPackages(defaultPackages.map(normalizePackage));
    try {
      localStorage.removeItem(PACKAGES_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      await saveSiteConfigToFirestore(newConfig);
      setIsFirebaseActive(true);
    } catch (err) {
      console.warn('Firestore config write note:', err);
    }
  };

  const resetConfigToDefault = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const getPackageBySlug = (slug: string) => {
    return packages.find((p) => p.slug === slug);
  };

  const seedFirestore = async () => {
    const normalized = defaultPackages.map(normalizePackage);
    const count = await seedDefaultPackagesToFirestore(normalized);
    await saveSiteConfigToFirestore(config);
    setIsFirebaseActive(true);
    return { success: true, count };
  };

  const [categories, setCategories] = useState<string[]>([
    'hill-tracts',
    'beach',
    'tea-gardens',
    'wildlife',
    'island',
  ]);

  const addCategory = (cat: string) => {
    const slug = cat.toLowerCase().trim().replace(/\s+/g, '-');
    if (slug && !categories.includes(slug)) {
      setCategories((prev) => [...prev, slug]);
    }
  };

  const deleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <DataContext.Provider
      value={{
        packages,
        config,
        isFirebaseActive,
        categories,
        addCategory,
        deleteCategory,
        addPackage,
        updatePackage,
        deletePackage,
        toggleFeatured,
        importPackages,
        resetPackagesToDefault,
        updateConfig,
        resetConfigToDefault,
        getPackageBySlug,
        seedFirestore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
