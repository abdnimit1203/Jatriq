import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { TourPackage, ItineraryDay } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AdminPackageFormModalProps {
  packageToEdit?: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: TourPackage) => void;
}

export const AdminPackageFormModal: React.FC<AdminPackageFormModalProps> = ({
  packageToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'itinerary' | 'logistics'>('basic');

  const [formData, setFormData] = useState<Partial<TourPackage>>({
    id: '',
    slug: '',
    category: 'hill-tracts',
    categoryLabel: { bn: 'পাহাড় ও মেঘের উপত্যকা', en: 'Hill Tracts' },
    destination: { bn: '', en: '' },
    title: { bn: '', en: '' },
    shortDescription: { bn: '', en: '' },
    detailedDescription: { bn: '', en: '' },
    duration: { days: 3, nights: 2, text: { bn: '৩ দিন / ২ রাত', en: '3 Days / 2 Nights' } },
    priceBDT: 8500,
    coverImage: '/src/assets/images/hero_sajek_sunrise_1791788897775.jpg',
    galleryImages: [],
    itinerary: [],
    included: { bn: [], en: [] },
    excluded: { bn: [], en: [] },
    accommodation: { bn: '', en: '' },
    transport: { bn: '', en: '' },
    departurePoint: { bn: '', en: '' },
    importantNotes: { bn: [], en: [] },
    featured: false,
    maxGroupSize: 12,
    isVerifiedPackage: false,
  });

  const [includedTextBn, setIncludedTextBn] = useState('');
  const [includedTextEn, setIncludedTextEn] = useState('');
  const [excludedTextBn, setExcludedTextBn] = useState('');
  const [excludedTextEn, setExcludedTextEn] = useState('');
  const [notesTextBn, setNotesTextBn] = useState('');
  const [notesTextEn, setNotesTextEn] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (packageToEdit) {
      setFormData({ ...packageToEdit });
      setIncludedTextBn(packageToEdit.included?.bn?.join('\n') || '');
      setIncludedTextEn(packageToEdit.included?.en?.join('\n') || '');
      setExcludedTextBn(packageToEdit.excluded?.bn?.join('\n') || '');
      setExcludedTextEn(packageToEdit.excluded?.en?.join('\n') || '');
      setNotesTextBn(packageToEdit.importantNotes?.bn?.join('\n') || '');
      setNotesTextEn(packageToEdit.importantNotes?.en?.join('\n') || '');
    } else {
      const newId = `pkg-${Date.now().toString().slice(-6)}`;
      setFormData({
        id: newId,
        slug: `new-tour-${Date.now().toString().slice(-4)}`,
        category: 'hill-tracts',
        categoryLabel: { bn: 'পাহাড় ও মেঘের উপত্যকা', en: 'Hill Tracts & Cloud Valley' },
        destination: { bn: 'সাজেক ভ্যালি', en: 'Sajek Valley' },
        title: { bn: 'নতুন ট্যুর প্যাকেজ', en: 'New Adventure Tour' },
        shortDescription: {
          bn: 'মনোরম পাহাড়ি প্রকৃতির মাঝে অবিস্মরণীয় ভ্রমণ।',
          en: 'Unforgettable journey amidst scenic mountain nature.',
        },
        detailedDescription: {
          bn: 'সম্পূর্ণ ৩ দিনের গোছানো ভ্রমণ পরিকল্পনা।',
          en: 'Complete 3-day handcrafted tour itinerary.',
        },
        duration: { days: 3, nights: 2, text: { bn: '৩ দিন / ২ রাত', en: '3 Days / 2 Nights' } },
        priceBDT: 8500,
        coverImage: '/src/assets/images/hero_sajek_sunrise_1791788897775.jpg',
        galleryImages: ['/src/assets/images/hero_sajek_sunrise_1791788897775.jpg'],
        itinerary: [
          {
            day: 1,
            title: { bn: 'যাত্রা শুরু ও আগমন', en: 'Departure & Arrival' },
            description: { bn: 'গন্তব্যে পৌঁছে রিসোর্টে চেক-ইন।', en: 'Arrival and resort check-in.' },
            highlights: { bn: ['পাহাড়ি রোড ট্রিপ'], en: ['Mountain road drive'] },
          },
        ],
        included: { bn: ['এসি বাস যাতায়াত', 'রিসোর্ট রাত্রিযাপন'], en: ['AC Coach Transit', 'Resort Stay'] },
        excluded: { bn: ['ব্যক্তিগত কেনাকাটা'], en: ['Personal Shopping'] },
        accommodation: { bn: 'ইকো কটেজ', en: 'Eco Cottage' },
        transport: { bn: 'রিজার্ভ এসি বাস', en: 'Reserved AC Coach' },
        departurePoint: { bn: 'ঢাকা', en: 'Dhaka' },
        importantNotes: { bn: ['এনআইডি সাথে রাখুন।'], en: ['Bring your NID copy.'] },
        featured: false,
        maxGroupSize: 12,
        isVerifiedPackage: false,
      });
      setIncludedTextBn('এসি বাস যাতায়াত\nরিসোর্ট রাত্রিযাপন\nসকল বেলার খাবার');
      setIncludedTextEn('AC Coach Transit\nResort Stay\nAll Meals');
      setExcludedTextBn('ব্যক্তিগত খরচ\nওষুধ');
      setExcludedTextEn('Personal Expenses\nMedications');
      setNotesTextBn('এনআইডি কার্ড সাথে রাখুন।\nপোশাক শালীন হওয়া বাঞ্ছনীয়।');
      setNotesTextEn('Bring your original NID copy.\nModest clothing recommended.');
    }
    setActiveTab('basic');
    setErrors([]);
  }, [packageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddItineraryDay = () => {
    const currentItinerary = formData.itinerary || [];
    const newDayNum = currentItinerary.length + 1;
    const newDay: ItineraryDay = {
      day: newDayNum,
      title: { bn: `দিন ${newDayNum} ভ্রমণ পরিকল্পনা`, en: `Day ${newDayNum} Sightseeing` },
      description: { bn: 'সকালের নাস্তা শেষে আকর্ষণীয় স্থানসমূহ ঘুরে দেখা।', en: 'Morning breakfast followed by sightseeing tours.' },
      highlights: { bn: ['স্থানীয় সংস্কৃতি'], en: ['Local Culture'] },
    };
    setFormData({ ...formData, itinerary: [...currentItinerary, newDay] });
  };

  const handleRemoveItineraryDay = (index: number) => {
    const current = [...(formData.itinerary || [])];
    current.splice(index, 1);
    // Re-index days
    const reindexed = current.map((day, idx) => ({ ...day, day: idx + 1 }));
    setFormData({ ...formData, itinerary: reindexed });
  };

  const handleUpdateItineraryDay = (
    index: number,
    field: 'titleBn' | 'titleEn' | 'descBn' | 'descEn',
    val: string
  ) => {
    const current = [...(formData.itinerary || [])];
    const target = current[index];
    if (!target) return;

    if (field === 'titleBn') target.title = { ...target.title, bn: val };
    if (field === 'titleEn') target.title = { ...target.title, en: val };
    if (field === 'descBn') target.description = { ...target.description, bn: val };
    if (field === 'descEn') target.description = { ...target.description, en: val };

    setFormData({ ...formData, itinerary: current });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.id?.trim()) validationErrors.push('Package ID is required.');
    if (!formData.slug?.trim()) validationErrors.push('Package Slug is required.');
    if (!formData.title?.bn?.trim() || !formData.title?.en?.trim()) {
      validationErrors.push('Title in both Bangla and English is required.');
    }
    if (!formData.destination?.bn?.trim() || !formData.destination?.en?.trim()) {
      validationErrors.push('Destination in both Bangla and English is required.');
    }
    if (!formData.priceBDT || formData.priceBDT < 0) {
      validationErrors.push('Valid price in BDT is required.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Assemble lines
    const finalPackage: TourPackage = {
      ...(formData as TourPackage),
      included: {
        bn: includedTextBn.split('\n').map((s) => s.trim()).filter(Boolean),
        en: includedTextEn.split('\n').map((s) => s.trim()).filter(Boolean),
      },
      excluded: {
        bn: excludedTextBn.split('\n').map((s) => s.trim()).filter(Boolean),
        en: excludedTextEn.split('\n').map((s) => s.trim()).filter(Boolean),
      },
      importantNotes: {
        bn: notesTextBn.split('\n').map((s) => s.trim()).filter(Boolean),
        en: notesTextEn.split('\n').map((s) => s.trim()).filter(Boolean),
      },
      duration: {
        days: Number(formData.duration?.days) || 3,
        nights: Number(formData.duration?.nights) || 2,
        text: {
          bn: `${formData.duration?.days || 3} দিন / ${formData.duration?.nights || 2} রাত`,
          en: `${formData.duration?.days || 3} Days / ${formData.duration?.nights || 2} Nights`,
        },
      },
    };

    onSave(finalPackage);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {packageToEdit
                ? language === 'bn'
                  ? 'ট্যুর প্যাকেজ সম্পাদনা'
                  : 'Edit Tour Package'
                : language === 'bn'
                ? 'নতুন ট্যুর প্যাকেজ যোগ করুন'
                : 'Create New Tour Package'}
            </h3>
            <p className="text-xs text-stone-500">
              {packageToEdit?.id ? `ID: ${packageToEdit.id}` : 'All fields sync to public pages immediately'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 mt-3 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-emerald-800 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn' ? '১. মৌলিক তথ্য' : '1. Basic Info'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-emerald-800 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn' ? '২. বিবরণ ও ছবি' : '2. Descriptions & Media'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'itinerary'
                ? 'border-emerald-800 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn' ? '৩. ভ্রমণ পরিকল্পনা' : '3. Itinerary'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'logistics'
                ? 'border-emerald-800 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn' ? '৪. সুবিধা ও শর্ত' : '4. Inclusions & Logistics'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please fix the following:</span>
              </div>
              <ul className="list-disc list-inside">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Unique ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Title (Bangla) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title?.bn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: { ...formData.title, bn: e.target.value, en: formData.title?.en || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title?.en || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: { ...formData.title, en: e.target.value, bn: formData.title?.bn || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as TourPackage['category'],
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  >
                    <option value="hill-tracts">Hill Tracts (পাহাড়)</option>
                    <option value="beach">Beach & Coast (সমুদ্র)</option>
                    <option value="tea-gardens">Tea Highlands (চা বাগান)</option>
                    <option value="wildlife">Wildlife Mangrove (সুন্দরবন)</option>
                    <option value="island">Coral Island (দ্বীপ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price (BDT) ৳</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.priceBDT}
                    onChange={(e) => setFormData({ ...formData, priceBDT: Number(e.target.value) })}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Max Group Size</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: Number(e.target.value) })}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Destination (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.destination?.bn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination: { ...formData.destination, bn: e.target.value, en: formData.destination?.en || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Destination (English)
                  </label>
                  <input
                    type="text"
                    value={formData.destination?.en || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination: { ...formData.destination, en: e.target.value, bn: formData.destination?.bn || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>Mark as Featured Tour (Show on Homepage)</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & MEDIA */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Short Description (Bangla)
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription?.bn || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: {
                        ...formData.shortDescription,
                        bn: e.target.value,
                        en: formData.shortDescription?.en || '',
                      },
                    })
                  }
                  className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Short Description (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription?.en || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: {
                        ...formData.shortDescription,
                        en: e.target.value,
                        bn: formData.shortDescription?.bn || '',
                      },
                    })
                  }
                  className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Detailed Description (Bangla)
                </label>
                <textarea
                  rows={3}
                  value={formData.detailedDescription?.bn || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detailedDescription: {
                        ...formData.detailedDescription,
                        bn: e.target.value,
                        en: formData.detailedDescription?.en || '',
                      },
                    })
                  }
                  className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Detailed Description (English)
                </label>
                <textarea
                  rows={3}
                  value={formData.detailedDescription?.en || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detailedDescription: {
                        ...formData.detailedDescription,
                        en: e.target.value,
                        bn: formData.detailedDescription?.bn || '',
                      },
                    })
                  }
                  className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cover Image URL / Asset Path
                </label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="/src/assets/images/... or https://..."
                  className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">
                  Days in Tour ({formData.itinerary?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Itinerary Day</span>
                </button>
              </div>

              {formData.itinerary?.map((day, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-800 font-mono">
                      Day {day.day}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryDay(idx)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title (Bangla)"
                      value={day.title?.bn || ''}
                      onChange={(e) => handleUpdateItineraryDay(idx, 'titleBn', e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                    />
                    <input
                      type="text"
                      placeholder="Title (English)"
                      value={day.title?.en || ''}
                      onChange={(e) => handleUpdateItineraryDay(idx, 'titleEn', e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <textarea
                      rows={2}
                      placeholder="Description (Bangla)"
                      value={day.description?.bn || ''}
                      onChange={(e) => handleUpdateItineraryDay(idx, 'descBn', e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description (English)"
                      value={day.description?.en || ''}
                      onChange={(e) => handleUpdateItineraryDay(idx, 'descEn', e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: LOGISTICS & INCLUSIONS */}
          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    What is Included (Bangla — 1 item per line)
                  </label>
                  <textarea
                    rows={4}
                    value={includedTextBn}
                    onChange={(e) => setIncludedTextBn(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    What is Included (English — 1 item per line)
                  </label>
                  <textarea
                    rows={4}
                    value={includedTextEn}
                    onChange={(e) => setIncludedTextEn(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    What is Excluded (Bangla — 1 item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={excludedTextBn}
                    onChange={(e) => setExcludedTextBn(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    What is Excluded (English — 1 item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={excludedTextEn}
                    onChange={(e) => setExcludedTextEn(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Accommodation (Bangla / English)
                  </label>
                  <input
                    type="text"
                    value={formData.accommodation?.bn || ''}
                    placeholder="Bangla"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accommodation: { ...formData.accommodation, bn: e.target.value, en: formData.accommodation?.en || '' },
                      })
                    }
                    className="w-full mb-1 py-1.5 px-2.5 text-xs rounded bg-stone-50 border border-stone-200"
                  />
                  <input
                    type="text"
                    value={formData.accommodation?.en || ''}
                    placeholder="English"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accommodation: { ...formData.accommodation, en: e.target.value, bn: formData.accommodation?.bn || '' },
                      })
                    }
                    className="w-full py-1.5 px-2.5 text-xs rounded bg-stone-50 border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Transport (Bangla / English)
                  </label>
                  <input
                    type="text"
                    value={formData.transport?.bn || ''}
                    placeholder="Bangla"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transport: { ...formData.transport, bn: e.target.value, en: formData.transport?.en || '' },
                      })
                    }
                    className="w-full mb-1 py-1.5 px-2.5 text-xs rounded bg-stone-50 border border-stone-200"
                  />
                  <input
                    type="text"
                    value={formData.transport?.en || ''}
                    placeholder="English"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transport: { ...formData.transport, en: e.target.value, bn: formData.transport?.bn || '' },
                      })
                    }
                    className="w-full py-1.5 px-2.5 text-xs rounded bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Save & Cancel */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
            >
              {packageToEdit ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
