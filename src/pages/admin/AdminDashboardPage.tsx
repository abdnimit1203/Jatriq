import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAIAssistant } from '../../context/AIAssistantContext';
import { TourPackage, SiteConfig } from '../../types';
import { exportPackagesToJsonFile, downloadSamplePackageJson } from '../../lib/jsonPackageValidator';
import { AdminPackageFormModal } from './AdminPackageFormModal';
import { AdminJsonImportModal } from './AdminJsonImportModal';
import { AdminBookingsTab } from './AdminBookingsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import {
  Package,
  Star,
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  ExternalLink,
  Building,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Bot,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  Cpu,
  Info,
  AlertCircle,
  Calendar,
  Database,
  Menu,
  X,
} from 'lucide-react';
import { fetchBookingsFromFirestore, updateBookingStatusInFirestore, FirestoreBooking } from '../../lib/firebase';
import { Logo } from '../../components/Logo';

type AdminTab = 'packages' | 'categories' | 'bookings' | 'agency' | 'ai-settings' | 'json';

export const AdminDashboardPage: React.FC = () => {
  const { logout } = useAdminAuth();
  const {
    packages,
    config,
    categories,
    isFirebaseActive,
    lastDataError,
    clearDataError,
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
    seedFirestore,
  } = useData();
  const { language, formatPrice } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('packages');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<TourPackage | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Firestore Bookings state
  const [bookings, setBookings] = useState<FirestoreBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isSeedingFirestore, setIsSeedingFirestore] = useState(false);

  const loadBookings = async () => {
    setLoadingBookings(true);
    const data = await fetchBookingsFromFirestore();
    setBookings(data);
    setLoadingBookings(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    await updateBookingStatusInFirestore(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    showNotification(`Booking status updated to ${status}.`);
  };

  const handleSeedFirestore = async () => {
    setIsSeedingFirestore(true);
    try {
      const res = await seedFirestore();
      showNotification(`Successfully seeded ${res.count} tour packages to Firebase Firestore!`);
    } catch (err: any) {
      showNotification(`Failed to seed Firestore: ${err.message}`);
    } finally {
      setIsSeedingFirestore(false);
    }
  };

  // AI Concierge & Multi-Provider Settings
  const { aiConfig, saveAiConfig, clearAiConfig } = useAIAssistant();
  const [customApiKeyInput, setCustomApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('jatriq_custom_gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'gemini' | 'groq' | 'openai'>('auto');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{
    loading: boolean;
    ok?: boolean;
    msg?: string;
    model?: string;
    provider?: string;
    usingCustom?: boolean;
  } | null>(null);

  // Agency Settings local form state
  const [agencyForm, setAgencyForm] = useState<SiteConfig>({ ...config });
  const [agencySavedNotice, setAgencySavedNotice] = useState(false);

  const handleSaveCustomApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingKey(true);
    try {
      const res = await saveAiConfig(customApiKeyInput.trim(), selectedProvider);
      if (res.success) {
        showNotification(customApiKeyInput.trim() ? 'AI API key saved securely & active across the site!' : 'Reverted to default free tier.');
      } else {
        showNotification(res.message || 'Error saving API key.');
      }
    } catch {
      showNotification('Could not save API key.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleClearCustomApiKey = async () => {
    setCustomApiKeyInput('');
    setIsSavingKey(true);
    await clearAiConfig();
    setIsSavingKey(false);
    setAiTestResult(null);
    showNotification('Cleared custom key. Reverted to default built-in travel knowledge.');
  };

  const handleTestAiConnection = async () => {
    setAiTestResult({ loading: true });
    try {
      const headers: Record<string, string> = {};
      if (customApiKeyInput.trim()) {
        headers['x-custom-api-key'] = customApiKeyInput.trim();
      }

      const res = await fetch('/api/test-key', { headers });
      const data = await res.json();

      if (res.ok && data.ok) {
        setAiTestResult({
          loading: false,
          ok: true,
          model: data.model,
          provider: data.provider,
          usingCustom: data.usingCustomKey,
          msg: data.msg || `Verified! Response received from ${data.model}.`,
        });
      } else {
        setAiTestResult({
          loading: false,
          ok: false,
          msg: data.error || 'Connection failed. Please verify API key format.',
        });
      }
    } catch (err: any) {
      setAiTestResult({
        loading: false,
        ok: false,
        msg: err.message || 'Network error while testing connection.',
      });
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Filter packages for search
  const filteredPackages = packages.filter((pkg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      pkg.title.en.toLowerCase().includes(q) ||
      pkg.title.bn.toLowerCase().includes(q) ||
      pkg.destination.en.toLowerCase().includes(q) ||
      pkg.destination.bn.toLowerCase().includes(q) ||
      pkg.id.toLowerCase().includes(q)
    );
  });

  const featuredCount = packages.filter((p) => p.featured).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  const handleExportJson = () => {
    const filename = exportPackagesToJsonFile(packages);
    showNotification(`Exported ${packages.length} packages to ${filename}`);
  };

  const handleSavePackage = async (savedPkg: TourPackage) => {
    const exists = packages.some((p) => p.id === savedPkg.id);
    if (exists) {
      const res = await updatePackage(savedPkg);
      if (res.success) {
        showNotification(`Package "${savedPkg.title.en}" updated successfully.`);
      } else {
        showNotification(`Updated locally. Cloud sync warning: ${res.error}`);
      }
    } else {
      const res = await addPackage(savedPkg);
      if (res.success) {
        showNotification(`Package "${savedPkg.title.en}" created successfully.`);
      } else {
        showNotification(`Created locally. Cloud sync warning: ${res.error}`);
      }
    }
    setPackageToEdit(null);
  };

  const handleDeletePackage = async (id: string) => {
    const target = packages.find((p) => p.id === id);
    const res = await deletePackage(id);
    setDeleteConfirmId(null);
    if (res.success) {
      showNotification(`Package "${target?.title.en || id}" deleted.`);
    } else {
      showNotification(`Deleted locally. Cloud sync warning: ${res.error}`);
    }
  };

  const handleConfirmImport = async (newPackages: TourPackage[]) => {
    const res = await importPackages(newPackages);
    if (res.success) {
      showNotification(`Successfully imported ${res.count ?? newPackages.length} tour packages!`);
    }
  };

  const handleResetPackages = () => {
    resetPackagesToDefault();
    setResetConfirmOpen(false);
    showNotification('Tour packages reset to original initial demo set.');
  };

  const handleSaveAgencySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(agencyForm);
    setAgencySavedNotice(true);
    setTimeout(() => setAgencySavedNotice(false), 3000);
    showNotification('Agency configuration updated in browser & cloud database.');
  };

  const handleResetAgencySettings = () => {
    resetConfigToDefault();
    setAgencyForm({ ...config });
    showNotification('Agency settings reset to defaults.');
  };

  // Nav menu items definition
  const navigationItems = [
    {
      id: 'packages' as AdminTab,
      label: 'Tour Packages',
      icon: Package,
      badge: packages.length.toString(),
    },
    {
      id: 'categories' as AdminTab,
      label: 'Categories',
      icon: Layers,
      badge: categories.length.toString(),
    },
    {
      id: 'bookings' as AdminTab,
      label: 'Bookings & Inquiries',
      icon: Calendar,
      badge: pendingBookingsCount > 0 ? `${pendingBookingsCount} new` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'agency' as AdminTab,
      label: 'Agency Settings',
      icon: Building,
    },
    {
      id: 'ai-settings' as AdminTab,
      label: 'AI Assistant',
      icon: Bot,
      pill: 'AI',
    },
    {
      id: 'json' as AdminTab,
      label: 'JSON Tools & Backup',
      icon: FileJson,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100/80 text-stone-900 flex">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-stone-200 z-30 shadow-xs">
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-stone-200 flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo size="sm" variant="dark" showTagline={false} />
          </Link>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-bold">
            Admin
          </span>
        </div>

        {/* Database Status Widget */}
        <div className="px-4 py-3 mx-3 mt-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-emerald-900 block">Firestore Active</span>
            <span className="text-emerald-700 text-[10px]">Real-time cloud sync</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.pill && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.pill}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full ${
                        item.badgeColor || (isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-100 text-stone-600')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-stone-200 space-y-1">
          <button
            onClick={handleSeedFirestore}
            disabled={isSeedingFirestore}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Seed sample data to Firestore"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSeedingFirestore ? 'Seeding...' : 'Seed Firestore DB'}</span>
          </button>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] text-stone-400">Preview</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER / OVERLAY ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            <div className="h-16 px-4 border-b border-stone-200 flex items-center justify-between">
              <Logo size="sm" variant="dark" showTagline={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full ${
                          item.badgeColor || (isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-100 text-stone-600')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-stone-200 space-y-1">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-stone-200 sticky top-0 z-20 px-4 h-16 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo size="sm" variant="dark" showTagline={false} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 capitalize">{activeTab}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Firestore Write Error Banner */}
          {lastDataError && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">Firestore Cloud Synchronization Notice:</span>
                  <span className="text-amber-800">{lastDataError}</span>
                </div>
              </div>
              <button
                onClick={clearDataError}
                className="text-amber-700 hover:text-amber-950 font-semibold px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 transition-colors text-[11px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Toast Notification */}
          {notification && (
            <div className="mb-4 bg-emerald-900 text-white p-3.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* ================= TAB: TOUR PACKAGES ================= */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-medium text-stone-500 tracking-wider">
                        Total Tour Packages
                      </span>
                      <div className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">
                        {packages.length}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-medium text-stone-500 tracking-wider">
                        Featured On Homepage
                      </span>
                      <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
                        {featuredCount}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-amber-500 stroke-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-medium text-stone-500 tracking-wider">
                        Managed Destinations
                      </span>
                      <div className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">
                        {categories.length} Categories
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by title, destination, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setPackageToEdit(null);
                      setPackageModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Package</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                    title="Export current packages to JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>

                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                    title="Import packages from JSON file"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Import</span>
                  </button>
                </div>
              </div>

              {/* Packages Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Tour Title & Destination</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price / Duration</th>
                        <th className="py-3 px-4 text-center">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900 text-sm">
                              {pkg.title.en}
                            </div>
                            <div className="text-stone-500 text-[11px]">
                              {pkg.title.bn} &middot; <span className="text-emerald-800 font-medium">{pkg.destination.en}</span>
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                              ID: {pkg.id} &middot; slug: /{pkg.slug}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-700 font-medium">
                              {pkg.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-stone-900">
                              BDT {pkg.priceBDT.toLocaleString()}
                            </div>
                            <div className="text-stone-500 text-[11px]">
                              {pkg.duration.text.en}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleFeatured(pkg.id)}
                              className="p-1 text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                              title={pkg.featured ? 'Unmark featured' : 'Mark as featured'}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  pkg.featured
                                    ? 'fill-amber-400 stroke-amber-500'
                                    : 'stroke-stone-300'
                                }`}
                              />
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-1">
                            <Link
                              to={`/packages/${pkg.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 inline-block text-stone-400 hover:text-stone-700 rounded"
                              title="Preview on public site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => {
                                setPackageToEdit(pkg);
                                setPackageModalOpen(true);
                              }}
                              className="p-1.5 inline-block text-stone-500 hover:text-emerald-800 rounded cursor-pointer"
                              title="Edit package details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(pkg.id)}
                              className="p-1.5 inline-block text-stone-400 hover:text-red-600 rounded cursor-pointer"
                              title="Delete package"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredPackages.length === 0 && (
                  <div className="py-12 text-center text-stone-500 text-xs">
                    No packages matched your search query.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              packages={packages}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
              language={language}
            />
          )}

          {/* ================= TAB: BOOKINGS & INQUIRIES ================= */}
          {activeTab === 'bookings' && (
            <AdminBookingsTab
              bookings={bookings}
              loading={loadingBookings}
              onRefresh={loadBookings}
              onUpdateStatus={handleUpdateBookingStatus}
              formatPrice={formatPrice}
              language={language}
            />
          )}

          {/* ================= TAB: AGENCY SETTINGS ================= */}
          {activeTab === 'agency' && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="mb-6 pb-4 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">Agency Information & Contacts</h3>
                  <p className="text-xs text-stone-500">
                    Update agency brand name, contacts, WhatsApp number, and promo announcement
                  </p>
                </div>

                {agencySavedNotice && (
                  <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Changes saved to cloud database!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveAgencySettings} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Agency Name (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={agencyForm.agencyName}
                      onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Brand Mark (Bangla)
                    </label>
                    <input
                      type="text"
                      required
                      value={agencyForm.brandMark}
                      onChange={(e) => setAgencyForm({ ...agencyForm, brandMark: e.target.value })}
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tagline (Bangla)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.tagline.bn}
                      onChange={(e) =>
                        setAgencyForm({
                          ...agencyForm,
                          tagline: { ...agencyForm.tagline, bn: e.target.value },
                        })
                      }
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tagline (English)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.tagline.en}
                      onChange={(e) =>
                        setAgencyForm({
                          ...agencyForm,
                          tagline: { ...agencyForm.tagline, en: e.target.value },
                        })
                      }
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone (Display Format)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.contactPhone}
                      onChange={(e) => setAgencyForm({ ...agencyForm, contactPhone: e.target.value })}
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp (International Digits Only)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.whatsappNumber}
                      onChange={(e) => setAgencyForm({ ...agencyForm, whatsappNumber: e.target.value })}
                      placeholder="8801711XXXXXX"
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={agencyForm.email}
                      onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Office Address (Bangla)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.address.bn}
                      onChange={(e) =>
                        setAgencyForm({
                          ...agencyForm,
                          address: { ...agencyForm.address, bn: e.target.value },
                        })
                      }
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Office Address (English)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.address.en}
                      onChange={(e) =>
                        setAgencyForm({
                          ...agencyForm,
                          address: { ...agencyForm.address, en: e.target.value },
                        })
                      }
                      className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                    />
                  </div>
                </div>

                {/* Announcement Bar Settings */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="announcement-toggle"
                      checked={agencyForm.announcementBar.enabled}
                      onChange={(e) =>
                        setAgencyForm({
                          ...agencyForm,
                          announcementBar: {
                            ...agencyForm.announcementBar,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-800"
                    />
                    <label htmlFor="announcement-toggle" className="text-xs font-semibold text-stone-800 cursor-pointer">
                      Enable Seasonal Announcement Bar
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        Announcement Text (Bangla)
                      </label>
                      <input
                        type="text"
                        value={agencyForm.announcementBar.text.bn}
                        onChange={(e) =>
                          setAgencyForm({
                            ...agencyForm,
                            announcementBar: {
                              ...agencyForm.announcementBar,
                              text: { ...agencyForm.announcementBar.text, bn: e.target.value },
                            },
                          })
                        }
                        className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        Announcement Text (English)
                      </label>
                      <input
                        type="text"
                        value={agencyForm.announcementBar.text.en}
                        onChange={(e) =>
                          setAgencyForm({
                            ...agencyForm,
                            announcementBar: {
                              ...agencyForm.announcementBar,
                              text: { ...agencyForm.announcementBar.text, en: e.target.value },
                            },
                          })
                        }
                        className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetAgencySettings}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Reset to Default Config
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB: AI SETTINGS ================= */}
          {activeTab === 'ai-settings' && (
            <div className="space-y-6">
              {/* Overview Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-900/60 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 text-xs font-bold bg-amber-400 text-stone-950 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {aiConfig.hasCustomKey ? `${aiConfig.provider.toUpperCase()} ACTIVE` : 'Free Tier & Travel Knowledge'}
                      </span>
                      <span className="text-xs text-emerald-300 font-mono">
                        {aiConfig.model || 'gemini-2.5-flash'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                      AI Travel Assistant & Smart Tour Localization
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                      Powers the public travel concierge chatbot on all pages and the one-click tour auto-translation in the admin tour editor. Supports Google Gemini, Groq, and OpenAI keys with resilient offline travel knowledge fallback.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleTestAiConnection}
                      disabled={aiTestResult?.loading}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Cpu className={`w-4 h-4 ${aiTestResult?.loading ? 'animate-spin' : ''}`} />
                      <span>{aiTestResult?.loading ? 'Testing Connection...' : 'Test AI Connection'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Test Result Card */}
              {aiTestResult && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in text-xs sm:text-sm ${
                    aiTestResult.ok
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {aiTestResult.ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span>{aiTestResult.ok ? 'Connection Verified' : 'Connection Error'}</span>
                      {aiTestResult.usingCustom !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white font-bold border border-current">
                          {aiTestResult.usingCustom ? `Using Custom Key (${aiTestResult.provider || 'AI'})` : 'Using Built-in Engine'}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 leading-relaxed text-xs opacity-90">{aiTestResult.msg}</p>
                  </div>
                </div>
              )}

              {/* Dual Cards: Features Powered + Custom Key Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Features List */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-emerald-800" />
                    <span>AI Powered Features</span>
                  </h3>

                  <div className="space-y-3.5 text-xs text-stone-600">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>1. Customer AI Travel Concierge</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Floating chatbot on all pages giving real-time advice on Sajek military convoys, packing, seasonal weather, and tour package details in Bangla or English.
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>2. One-Click Tour Auto-Translator</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        In the Tour Editor, translate all package titles, descriptions, inclusions, and all itinerary days between Bangla and English with 1 click.
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>3. Contextual Tour Inquiries</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        "Ask AI about this tour" buttons on tour detail pages pre-load the package specs into the concierge session.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom API Key Configuration */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-emerald-800" />
                      <h3 className="font-bold text-base text-stone-900">
                        AI Provider & API Key Configuration
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                      {aiConfig.hasCustomKey ? 'Custom Key Active' : 'Default Ready'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-700" />
                      <span>Free Tier Default & Custom Key Support</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed">
                      By default, Jatriq operates on the free tier with a built-in Bangladesh travel intelligence engine. You can enter any <strong>Google Gemini API Key</strong> (`AIza...`), <strong>Groq API Key</strong> (`gsk_...`), or <strong>OpenAI GPT Key</strong> (`sk-...`) below. It will be saved securely and used across the website.
                    </p>
                  </div>

                  <form onSubmit={handleSaveCustomApiKey} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                          AI Provider
                        </label>
                        <select
                          value={selectedProvider}
                          onChange={(e) => setSelectedProvider(e.target.value as any)}
                          className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all"
                        >
                          <option value="auto">Auto-Detect from Key</option>
                          <option value="gemini">Google Gemini (AIzaSy...)</option>
                          <option value="groq">Groq (Ultra-Fast Free Tier)</option>
                          <option value="openai">OpenAI (ChatGPT)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                          Active Key Status
                        </label>
                        <div className="py-2.5 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
                          <span className="font-mono">{aiConfig.maskedKey || 'Default Free Tier'}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${aiConfig.hasCustomKey ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Enter / Update API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={customApiKeyInput}
                          onChange={(e) => setCustomApiKeyInput(e.target.value)}
                          placeholder="Leave blank to use Default Free Tier (or paste AIzaSy..., gsk_..., sk-...)"
                          className="w-full py-2.5 pl-3.5 pr-10 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 font-mono focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-1"
                          title={showApiKey ? 'Hide API key' : 'Show API key'}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-400 block mt-1">
                        Saved to server config file and local storage. Immediately applied to customer chatbot and admin auto-translator.
                      </span>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleClearCustomApiKey}
                        disabled={isSavingKey}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Revert to Free Tier
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTestAiConnection}
                          disabled={aiTestResult?.loading}
                          className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Test Key
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingKey}
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {isSavingKey ? 'Saving...' : 'Save API Key'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: JSON IMPORT/EXPORT ================= */}
          {activeTab === 'json' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-stone-900">Export Packages (JSON)</h3>
                      <p className="text-xs text-stone-500">Download current live package data</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Generates a clean, validated JSON export containing all {packages.length} active packages, custom itineraries, pricing, and bilingual details. File format: <code>jatriq-packages-YYYY-MM-DD.json</code>.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleExportJson}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Packages JSON</span>
                    </button>
                  </div>
                </div>

                {/* Import Card */}
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-stone-900">Import Packages (JSON)</h3>
                      <p className="text-xs text-stone-500">Upload and validate a packages file</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Imports a custom `.json` file. The tool runs client-side schema validation to check unique IDs, required bilingual text, and numerical prices before requesting confirmation.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setImportModalOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Open Import Tool</span>
                    </button>

                    <button
                      onClick={downloadSamplePackageJson}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download Sample JSON</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset to Default Section */}
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Reset Packages to Original Sample Data
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Reverts your tour package collection back to the 6 initial Bangladesh demo tours.
                  </p>
                </div>

                <button
                  onClick={() => setResetConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Reset to Sample Data</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODALS ================= */}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">Delete Tour Package?</h3>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              Are you sure you want to delete this package? It will immediately be removed from the public listings in this session.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePackage(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">Reset to Original Sample Data?</h3>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              This will overwrite any newly created or edited packages in your browser and reload the 6 standard Bangladesh packages.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPackages}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Form Modal */}
      <AdminPackageFormModal
        isOpen={packageModalOpen}
        packageToEdit={packageToEdit}
        onClose={() => {
          setPackageModalOpen(false);
          setPackageToEdit(null);
        }}
        onSave={handleSavePackage}
      />

      {/* JSON Import Modal */}
      <AdminJsonImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onConfirmImport={handleConfirmImport}
        currentPackageCount={packages.length}
      />
    </div>
  );
};
