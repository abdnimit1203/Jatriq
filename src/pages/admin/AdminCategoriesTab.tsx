import React, { useState } from 'react';
import { TourPackage } from '../../types';
import {
  Layers,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle2,
  Tag,
  Search,
} from 'lucide-react';

interface AdminCategoriesTabProps {
  categories: string[];
  packages: TourPackage[];
  onAddCategory: (category: string) => void | Promise<void>;
  onDeleteCategory: (category: string) => void | Promise<void>;
  language: string;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  packages,
  onAddCategory,
  onDeleteCategory,
  language,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<string | null>(null);

  // Calculate package count per category
  const packageCountMap: Record<string, number> = {};
  for (const p of packages) {
    packageCountMap[p.category] = (packageCountMap[p.category] || 0) + 1;
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const clean = newCategoryName.trim();
    if (!clean) {
      setErrorMsg('Please enter a category name.');
      return;
    }

    const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) {
      setErrorMsg('Invalid category name format.');
      return;
    }

    if (categories.includes(slug)) {
      setErrorMsg(`Category "${slug}" already exists.`);
      return;
    }

    onAddCategory(slug);
    setNewCategoryName('');
    setSuccessMsg(`Category "${slug}" added successfully.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = (cat: string) => {
    onDeleteCategory(cat);
    setDeleteConfirmCat(null);
    setSuccessMsg(`Category "${cat}" removed.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-900 text-white p-3.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Category Card */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <h4 className="text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-700" />
          <span>Add New Tour Category</span>
        </h4>
        <p className="text-xs text-stone-500 mb-4">
          Categories organize packages on the public search and filter bars. Slugs are formatted automatically.
        </p>

        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. River Cruises, Heritage, Adventure Trekking"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 text-stone-900"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Search and List Header */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700"
          />
        </div>
        <span className="text-xs text-stone-500 font-medium">
          Total Categories: <strong className="text-stone-900">{categories.length}</strong>
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCategories.map((cat) => {
          const pkgCount = packageCountMap[cat] || 0;
          const isConfirming = deleteConfirmCat === cat;

          return (
            <div
              key={cat}
              className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-stone-900 font-mono block truncate">
                    {cat}
                  </span>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <Package className="w-3 h-3 text-stone-400" />
                    {pkgCount} {pkgCount === 1 ? 'package' : 'packages'} assigned
                  </span>
                </div>
              </div>

              <div>
                {isConfirming ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmCat(null)}
                      className="px-1.5 py-1 text-stone-400 hover:text-stone-700 rounded text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmCat(cat)}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title={`Delete category "${cat}"`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
