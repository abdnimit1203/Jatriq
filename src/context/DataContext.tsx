import React, { createContext, useContext, useState, useEffect } from 'react';
import { TourPackage, SiteConfig } from '../types';
import { tourPackages as defaultPackages } from '../data/packages';
import { siteConfig as defaultConfig } from '../config/siteConfig';

const PACKAGES_STORAGE_KEY = 'jatriq_managed_packages';
const CONFIG_STORAGE_KEY = 'jatriq_managed_site_config';

interface DataContextType {
  packages: TourPackage[];
  config: SiteConfig;
  addPackage: (pkg: TourPackage) => void;
  updatePackage: (pkg: TourPackage) => void;
  deletePackage: (id: string) => void;
  toggleFeatured: (id: string) => void;
  importPackages: (imported: TourPackage[]) => { success: boolean; count?: number; error?: string };
  resetPackagesToDefault: () => void;
  updateConfig: (newConfig: SiteConfig) => void;
  resetConfigToDefault: () => void;
  getPackageBySlug: (slug: string) => TourPackage | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize packages from localStorage or default
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored packages:', err);
    }
    return defaultPackages;
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

  // Save packages to localStorage on change
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

  const addPackage = (pkg: TourPackage) => {
    setPackages((prev) => [pkg, ...prev]);
  };

  const updatePackage = (updated: TourPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const importPackages = (imported: TourPackage[]) => {
    if (!Array.isArray(imported) || imported.length === 0) {
      return { success: false, error: 'Imported file contains no tour packages.' };
    }
    setPackages(imported);
    return { success: true, count: imported.length };
  };

  const resetPackagesToDefault = () => {
    setPackages(defaultPackages);
    try {
      localStorage.removeItem(PACKAGES_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
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

  return (
    <DataContext.Provider
      value={{
        packages,
        config,
        addPackage,
        updatePackage,
        deletePackage,
        toggleFeatured,
        importPackages,
        resetPackagesToDefault,
        updateConfig,
        resetConfigToDefault,
        getPackageBySlug,
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
