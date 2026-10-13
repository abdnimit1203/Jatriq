import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { TourPackage, SiteConfig } from '../../types';
import { exportPackagesToJsonFile, downloadSamplePackageJson } from '../../lib/jsonPackageValidator';
import { AdminPackageFormModal } from './AdminPackageFormModal';
import { AdminJsonImportModal } from './AdminJsonImportModal';
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
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileDown,
} from 'lucide-react';
import { Logo } from '../../components/Logo';

export const AdminDashboardPage: React.FC = () => {
  const { logout } = useAdminAuth();
  const {
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
  } = useData();
  const { language, formatPrice, getText } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'packages' | 'json' | 'agency'>('packages');
  const [searchQuery, setSearchQuery] = useState('');
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<TourPackage | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Agency Settings local form state
  const [agencyForm, setAgencyForm] = useState<SiteConfig>({ ...config });
  const [agencySavedNotice, setAgencySavedNotice] = useState(false);

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

  const handleExportJson = () => {
    const filename = exportPackagesToJsonFile(packages);
    showNotification(`Exported ${packages.length} packages to ${filename}`);
  };

  const handleSavePackage = (savedPkg: TourPackage) => {
    const exists = packages.some((p) => p.id === savedPkg.id);
    if (exists) {
      updatePackage(savedPkg);
      showNotification(`Package "${savedPkg.title.en}" updated successfully.`);
    } else {
      addPackage(savedPkg);
      showNotification(`Package "${savedPkg.title.en}" created successfully.`);
    }
    setPackageToEdit(null);
  };

  const handleDeletePackage = (id: string) => {
    const target = packages.find((p) => p.id === id);
    deletePackage(id);
    setDeleteConfirmId(null);
    showNotification(`Package "${target?.title.en || id}" deleted.`);
  };

  const handleConfirmImport = (newPackages: TourPackage[]) => {
    const res = importPackages(newPackages);
    if (res.success) {
      showNotification(`Successfully imported ${res.count} tour packages!`);
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
    showNotification('Agency configuration updated in browser storage.');
  };

  const handleResetAgencySettings = () => {
    resetConfigToDefault();
    setAgencyForm({ ...config });
    showNotification('Agency settings reset to defaults.');
  };

  return (
    <div className="min-h-screen bg-stone-100/80 text-stone-900 pb-16">
      {/* Top Bar for Admin */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <Logo size="sm" variant="dark" showTagline={false} />
            </Link>
            <div className="hidden sm:flex items-center gap-2 border-l border-stone-200 pl-3">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs uppercase font-mono px-2 py-0.5 rounded-md font-bold">
                Admin Panel (Demo)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Toast Notification */}
        {notification && (
          <div className="mb-4 bg-emerald-900 text-white p-3.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Demo Security Banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-800 font-mono">
              Demo Panel &middot; Client-Side Storage Notice
            </span>
            <p className="mt-0.5 leading-relaxed text-[11px] text-amber-800/90">
              This admin panel demonstrates how your agency can manage tour packages and settings without coding. Changes are stored in your browser's <code>localStorage</code> and sync instantly to the public view during this demo session. To publish new packages to your live Netlify site, use the <strong>JSON Export</strong> tool.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                  {new Set(packages.map((p) => p.category)).size} Categories
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mb-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'packages'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Tour Packages ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>JSON Import / Export</span>
          </button>

          <button
            onClick={() => setActiveTab('agency')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'agency'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Agency Settings</span>
          </button>
        </div>

        {/* TAB 1: PACKAGES MANAGEMENT */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
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

        {/* TAB 2: JSON DATA CENTER */}
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

        {/* TAB 3: AGENCY SETTINGS */}
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
                  <span>Changes saved to browser!</span>
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
      </main>

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
