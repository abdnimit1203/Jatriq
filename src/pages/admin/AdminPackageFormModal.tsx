import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { TourPackage, ItineraryDay } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { resolveImageUrl, handleImageFallback } from '../../lib/imageUtils';

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
    coverImage: '/images/hero_sajek_sunrise_1791788897775.jpg',
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

  // Dedicated 3 image slots requested by user
  const [galleryImage1, setGalleryImage1] = useState('');
  const [galleryImage2, setGalleryImage2] = useState('');

  const [includedTextBn, setIncludedTextBn] = useState('');
  const [includedTextEn, setIncludedTextEn] = useState('');
  const [excludedTextBn, setExcludedTextBn] = useState('');
  const [excludedTextEn, setExcludedTextEn] = useState('');
  const [notesTextBn, setNotesTextBn] = useState('');
  const [notesTextEn, setNotesTextEn] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // AI Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateSuccessMsg, setTranslateSuccessMsg] = useState<string | null>(null);
  const [translateErrorMsg, setTranslateErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (packageToEdit) {
      setFormData({ ...packageToEdit });
      setGalleryImage1(packageToEdit.galleryImages?.[0] || '');
      setGalleryImage2(packageToEdit.galleryImages?.[1] || '');
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
        title: { bn: 'নতুন সাজেক ভ্যালি অভিযান', en: 'New Sajek Valley Expedition' },
        shortDescription: {
          bn: 'মনোরম পাহাড়ি প্রকৃতির মাঝে অবিস্মরণীয় মেঘের উপত্যকা ভ্রমণ।',
          en: 'Unforgettable journey amidst scenic mountain clouds.',
        },
        detailedDescription: {
          bn: 'সম্পূর্ণ ৩ দিনের গোছানো ভ্রমণ পরিকল্পনা, চান্দের গাড়ি, রিসোর্ট ও বারবিকিউ সহ।',
          en: 'Complete 3-day handcrafted tour itinerary with 4x4 Chander Gari, eco-resort, and BBQ.',
        },
        duration: { days: 3, nights: 2, text: { bn: '৩ দিন / ২ রাত', en: '3 Days / 2 Nights' } },
        priceBDT: 8500,
        coverImage: '/images/hero_sajek_sunrise_1791788897775.jpg',
        galleryImages: [
          '/images/bandarban_hills_1791788946228.jpg',
          '/images/sylhet_tea_gardens_1791788922427.jpg',
        ],
        itinerary: [
          {
            day: 1,
            title: { bn: 'যাত্রা শুরু ও আগমন', en: 'Departure & Arrival' },
            description: { bn: 'গন্তব্যে পৌঁছে রিসোর্টে চেক-ইন ও সূর্যাস্ত দর্শন।', en: 'Arrival, cottage check-in, and sunset viewing.' },
            highlights: { bn: ['পাহাড়ি রোড ট্রিপ'], en: ['Mountain road drive'] },
          },
          {
            day: 2,
            title: { bn: 'কংলাক পাহাড়ে মেঘ দর্শন', en: 'Konglak Peak Cloud Trek' },
            description: { bn: 'ভোরে কংলাক চূড়ায় সূর্যোদয় ও মেঘের খেলা উপভোগ।', en: 'Sunrise trek to Konglak peak above the clouds.' },
            highlights: { bn: ['কংলাক সূর্যোদয়'], en: ['Konglak Sunrise'] },
          },
          {
            day: 3,
            title: { bn: 'আলুটিলা গুহা ও ফিরতি যাত্রা', en: 'Alutila Cave & Return Journey' },
            description: { bn: 'আলুটিলা সুরঙ্গ রহস্যময় গুহা পরিদর্শন শেষে যাত্রা সমাপ্তি।', en: 'Explore ancient Alutila cave and return home.' },
            highlights: { bn: ['আলুটিলা গুহা'], en: ['Alutila Cave'] },
          },
        ],
        included: { bn: ['এসি বাস যাতায়াত', 'রিসোর্ট রাত্রিযাপন', '৩ বেলার খাবার'], en: ['AC Coach Transit', 'Resort Stay', 'All Meals'] },
        excluded: { bn: ['ব্যক্তিগত কেনাকাটা', 'ওষুধ'], en: ['Personal Shopping', 'Medications'] },
        accommodation: { bn: 'ইকো কটেজ (মেঘের ভিউ)', en: 'Eco Cottage with cloud view' },
        transport: { bn: 'রিজার্ভ এসি বাস ও চান্দের গাড়ি', en: 'Reserved AC Coach & 4x4 Chander Gari' },
        departurePoint: { bn: 'ঢাকা (সায়দাবাদ / ফকিরাপুল)', en: 'Dhaka (Sayedabad / Fakirapool)' },
        importantNotes: { bn: ['জাতীয় পরিচয়পত্র বা জন্মনিবন্ধন সাথে রাখুন।'], en: ['Bring original NID or Birth Certificate.'] },
        featured: false,
        maxGroupSize: 12,
        isVerifiedPackage: false,
      });
      setGalleryImage1('/images/bandarban_hills_1791788946228.jpg');
      setGalleryImage2('/images/sylhet_tea_gardens_1791788922427.jpg');
      setIncludedTextBn('এসি বাস যাতায়াত\nরিসোর্ট রাত্রিযাপন\nসকল বেলার খাবার\nরিজার্ভ চান্দের গাড়ি');
      setIncludedTextEn('AC Coach Transit\nResort Stay\nAll Meals\nReserved 4x4 Chander Gari');
      setExcludedTextBn('ব্যক্তিগত খরচ\nওষুধ ও শপিং');
      setExcludedTextEn('Personal Expenses\nMedications & Shopping');
      setNotesTextBn('এনআইডি কার্ড সাথে রাখুন।\nপোশাক শালীন হওয়া বাঞ্ছনীয়।');
      setNotesTextEn('Bring your original NID copy.\nModest mountain clothing recommended.');
    }
    setActiveTab('basic');
    setErrors([]);
    setTranslateErrorMsg(null);
    setTranslateSuccessMsg(null);
  }, [packageToEdit, isOpen]);

  if (!isOpen) return null;

  // Itinerary helpers
  const handleAddItineraryDay = () => {
    const currentItinerary = formData.itinerary || [];
    const newDayNum = currentItinerary.length + 1;
    const newDay: ItineraryDay = {
      day: newDayNum,
      title: { bn: `দিন ${newDayNum} ভ্রমণ পরিকল্পনা`, en: `Day ${newDayNum} Sightseeing` },
      description: {
        bn: 'সকালের নাস্তা শেষে আকর্ষণীয় স্থানসমূহ ঘুরে দেখা।',
        en: 'Morning breakfast followed by sightseeing excursions.',
      },
      highlights: { bn: ['স্থানীয় দর্শনীয় স্থান'], en: ['Local Sightseeing'] },
    };
    setFormData({ ...formData, itinerary: [...currentItinerary, newDay] });
  };

  const handleRemoveItineraryDay = (index: number) => {
    const current = [...(formData.itinerary || [])];
    current.splice(index, 1);
    const reindexed = current.map((day, idx) => ({ ...day, day: idx + 1 }));
    setFormData({ ...formData, itinerary: reindexed });
  };

  const handleUpdateItineraryDay = (
    index: number,
    field: 'titleBn' | 'titleEn' | 'descBn' | 'descEn',
    val: string
  ) => {
    const current = [...(formData.itinerary || [])];
    if (!current[index]) return;

    if (field === 'titleBn') {
      current[index] = {
        ...current[index],
        title: { ...current[index].title, bn: val },
      };
    } else if (field === 'titleEn') {
      current[index] = {
        ...current[index],
        title: { ...current[index].title, en: val },
      };
    } else if (field === 'descBn') {
      current[index] = {
        ...current[index],
        description: { ...current[index].description, bn: val },
      };
    } else if (field === 'descEn') {
      current[index] = {
        ...current[index],
        description: { ...current[index].description, en: val },
      };
    }

    setFormData({ ...formData, itinerary: current });
  };

  // Per-field translation handler requested by user: ENG / বাং buttons next to each field
  const handleTranslateSingleField = async (
    fieldKey: 'title' | 'shortDescription' | 'detailedDescription' | 'destination' | 'accommodation' | 'transport' | 'departurePoint',
    sourceLang: 'bn' | 'en'
  ) => {
    const targetLang = sourceLang === 'bn' ? 'en' : 'bn';
    const sourceText = formData[fieldKey]?.[sourceLang];
    if (!sourceText || !sourceText.trim()) {
      setTranslateErrorMsg(`Please enter text in ${sourceLang === 'bn' ? 'Bangla' : 'English'} first.`);
      setTimeout(() => setTranslateErrorMsg(null), 3000);
      return;
    }

    setIsTranslating(true);
    setTranslateErrorMsg(null);
    setTranslateSuccessMsg(null);

    try {
      const customKey = localStorage.getItem('jatriq_custom_gemini_api_key');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey && customKey.trim()) {
        headers['x-custom-api-key'] = customKey.trim();
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fields: { [fieldKey]: sourceText },
          sourceLang,
          targetLang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      const translated = data.translations?.[fieldKey];
      if (translated) {
        setFormData((prev) => ({
          ...prev,
          [fieldKey]: {
            ...(prev[fieldKey] || { bn: '', en: '' }),
            [targetLang]: translated,
          },
        }));
        setTranslateSuccessMsg(`Translated field to ${targetLang === 'bn' ? 'বাং' : 'ENG'} successfully!`);
        setTimeout(() => setTranslateSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setTranslateErrorMsg(err.message || 'Translation error');
      setTimeout(() => setTranslateErrorMsg(null), 4000);
    } finally {
      setIsTranslating(false);
    }
  };

  // AI Auto-Translation Handler
  const handleAutoTranslate = async (sourceLang: 'bn' | 'en', targetLang: 'en' | 'bn') => {
    setIsTranslating(true);
    setTranslateErrorMsg(null);
    setTranslateSuccessMsg(null);

    try {
      const includedList = (sourceLang === 'bn' ? includedTextBn : includedTextEn)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const excludedList = (sourceLang === 'bn' ? excludedTextBn : excludedTextEn)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const notesList = (sourceLang === 'bn' ? notesTextBn : notesTextEn)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: sourceLang === 'bn' ? formData.title?.bn : formData.title?.en,
        categoryLabel: sourceLang === 'bn' ? formData.categoryLabel?.bn : formData.categoryLabel?.en,
        destination: sourceLang === 'bn' ? formData.destination?.bn : formData.destination?.en,
        shortDescription: sourceLang === 'bn' ? formData.shortDescription?.bn : formData.shortDescription?.en,
        detailedDescription: sourceLang === 'bn' ? formData.detailedDescription?.bn : formData.detailedDescription?.en,
        accommodation: sourceLang === 'bn' ? formData.accommodation?.bn : formData.accommodation?.en,
        transport: sourceLang === 'bn' ? formData.transport?.bn : formData.transport?.en,
        departurePoint: sourceLang === 'bn' ? formData.departurePoint?.bn : formData.departurePoint?.en,
        included: includedList,
        excluded: excludedList,
        importantNotes: notesList,
        itinerary: (formData.itinerary || []).map((day) => ({
          day: day.day,
          title: sourceLang === 'bn' ? day.title?.bn : day.title?.en,
          description: sourceLang === 'bn' ? day.description?.bn : day.description?.en,
        })),
      };

      const customKey = localStorage.getItem('jatriq_custom_gemini_api_key');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey && customKey.trim()) {
        headers['x-custom-api-key'] = customKey.trim();
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fields: payload,
          sourceLang,
          targetLang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Translation request failed');
      }

      const tr = data.translations;

      setFormData((prev) => ({
        ...prev,
        title: {
          bn: targetLang === 'bn' ? tr.title || prev.title?.bn || '' : prev.title?.bn || '',
          en: targetLang === 'en' ? tr.title || prev.title?.en || '' : prev.title?.en || '',
        },
        categoryLabel: {
          bn: targetLang === 'bn' ? tr.categoryLabel || prev.categoryLabel?.bn || '' : prev.categoryLabel?.bn || '',
          en: targetLang === 'en' ? tr.categoryLabel || prev.categoryLabel?.en || '' : prev.categoryLabel?.en || '',
        },
        destination: {
          bn: targetLang === 'bn' ? tr.destination || prev.destination?.bn || '' : prev.destination?.bn || '',
          en: targetLang === 'en' ? tr.destination || prev.destination?.en || '' : prev.destination?.en || '',
        },
        shortDescription: {
          bn: targetLang === 'bn' ? tr.shortDescription || prev.shortDescription?.bn || '' : prev.shortDescription?.bn || '',
          en: targetLang === 'en' ? tr.shortDescription || prev.shortDescription?.en || '' : prev.shortDescription?.en || '',
        },
        detailedDescription: {
          bn: targetLang === 'bn' ? tr.detailedDescription || prev.detailedDescription?.bn || '' : prev.detailedDescription?.bn || '',
          en: targetLang === 'en' ? tr.detailedDescription || prev.detailedDescription?.en || '' : prev.detailedDescription?.en || '',
        },
        accommodation: {
          bn: targetLang === 'bn' ? tr.accommodation || prev.accommodation?.bn || '' : prev.accommodation?.bn || '',
          en: targetLang === 'en' ? tr.accommodation || prev.accommodation?.en || '' : prev.accommodation?.en || '',
        },
        transport: {
          bn: targetLang === 'bn' ? tr.transport || prev.transport?.bn || '' : prev.transport?.bn || '',
          en: targetLang === 'en' ? tr.transport || prev.transport?.en || '' : prev.transport?.en || '',
        },
        departurePoint: {
          bn: targetLang === 'bn' ? tr.departurePoint || prev.departurePoint?.bn || '' : prev.departurePoint?.bn || '',
          en: targetLang === 'en' ? tr.departurePoint || prev.departurePoint?.en || '' : prev.departurePoint?.en || '',
        },
        itinerary: (prev.itinerary || []).map((day, idx) => {
          const trDay = Array.isArray(tr.itinerary) ? tr.itinerary[idx] : null;
          return {
            ...day,
            title: {
              bn: targetLang === 'bn' ? trDay?.title || day.title?.bn || '' : day.title?.bn || '',
              en: targetLang === 'en' ? trDay?.title || day.title?.en || '' : day.title?.en || '',
            },
            description: {
              bn: targetLang === 'bn' ? trDay?.description || day.description?.bn || '' : day.description?.bn || '',
              en: targetLang === 'en' ? trDay?.description || day.description?.en || '' : day.description?.en || '',
            },
          };
        }),
      }));

      if (Array.isArray(tr.included)) {
        if (targetLang === 'bn') setIncludedTextBn(tr.included.join('\n'));
        else setIncludedTextEn(tr.included.join('\n'));
      }
      if (Array.isArray(tr.excluded)) {
        if (targetLang === 'bn') setExcludedTextBn(tr.excluded.join('\n'));
        else setExcludedTextEn(tr.excluded.join('\n'));
      }
      if (Array.isArray(tr.importantNotes)) {
        if (targetLang === 'bn') setNotesTextBn(tr.importantNotes.join('\n'));
        else setNotesTextEn(tr.importantNotes.join('\n'));
      }

      setTranslateSuccessMsg(
        targetLang === 'bn'
          ? 'বাংলায় সফলভাবে এআই অনুবাদ সম্পন্ন হয়েছে!'
          : 'Successfully auto-translated all fields to English!'
      );
      setTimeout(() => setTranslateSuccessMsg(null), 4000);
    } catch (err: any) {
      setTranslateErrorMsg(err.message || 'Auto-translate failed');
      setTimeout(() => setTranslateErrorMsg(null), 5000);
    } finally {
      setIsTranslating(false);
    }
  };

  // Image Presets
  const applyPresetImages = (name: 'sajek' | 'coxsbazar' | 'sylhet' | 'bandarban' | 'sundarbans') => {
    if (name === 'sajek') {
      setFormData((prev) => ({ ...prev, coverImage: '/images/hero_sajek_sunrise_1791788897775.jpg' }));
      setGalleryImage1('/images/bandarban_hills_1791788946228.jpg');
      setGalleryImage2('/images/sylhet_tea_gardens_1791788922427.jpg');
    } else if (name === 'coxsbazar') {
      setFormData((prev) => ({ ...prev, coverImage: '/images/coxs_bazar_sunset_1791788910726.jpg' }));
      setGalleryImage1('/images/sundarbans_mangrove_1791788934964.jpg');
      setGalleryImage2('/images/bandarban_hills_1791788946228.jpg');
    } else if (name === 'sylhet') {
      setFormData((prev) => ({ ...prev, coverImage: '/images/sylhet_tea_gardens_1791788922427.jpg' }));
      setGalleryImage1('/images/hero_sajek_sunrise_1791788897775.jpg');
      setGalleryImage2('/images/bandarban_hills_1791788946228.jpg');
    } else if (name === 'bandarban') {
      setFormData((prev) => ({ ...prev, coverImage: '/images/bandarban_hills_1791788946228.jpg' }));
      setGalleryImage1('/images/hero_sajek_sunrise_1791788897775.jpg');
      setGalleryImage2('/images/coxs_bazar_sunset_1791788910726.jpg');
    } else if (name === 'sundarbans') {
      setFormData((prev) => ({ ...prev, coverImage: '/images/sundarbans_mangrove_1791788934964.jpg' }));
      setGalleryImage1('/images/coxs_bazar_sunset_1791788910726.jpg');
      setGalleryImage2('/images/sylhet_tea_gardens_1791788922427.jpg');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.id?.trim()) validationErrors.push('Unique ID is required');
    if (!formData.slug?.trim()) validationErrors.push('URL Slug is required');
    if (!formData.title?.bn?.trim()) validationErrors.push('Title in Bangla is required');
    if (!formData.title?.en?.trim()) validationErrors.push('Title in English is required');
    if (!formData.priceBDT || formData.priceBDT <= 0) validationErrors.push('Valid price in BDT is required');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const incListBn = includedTextBn.split('\n').map((s) => s.trim()).filter(Boolean);
    const incListEn = includedTextEn.split('\n').map((s) => s.trim()).filter(Boolean);
    const excListBn = excludedTextBn.split('\n').map((s) => s.trim()).filter(Boolean);
    const excListEn = excludedTextEn.split('\n').map((s) => s.trim()).filter(Boolean);
    const noteListBn = notesTextBn.split('\n').map((s) => s.trim()).filter(Boolean);
    const noteListEn = notesTextEn.split('\n').map((s) => s.trim()).filter(Boolean);

    // Filter and combine gallery images (total 3 images with cover)
    const gallery = [galleryImage1.trim(), galleryImage2.trim()].filter(Boolean);

    const finalPackage: TourPackage = {
      id: formData.id!.trim(),
      slug: formData.slug!.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      category: formData.category || 'hill-tracts',
      categoryLabel: formData.categoryLabel || { bn: 'পাহাড় ও মেঘের উপত্যকা', en: 'Hill Tracts' },
      destination: formData.destination || { bn: 'বাংলাদেশ', en: 'Bangladesh' },
      title: formData.title || { bn: '', en: '' },
      shortDescription: formData.shortDescription || { bn: '', en: '' },
      detailedDescription: formData.detailedDescription || { bn: '', en: '' },
      duration: formData.duration || { days: 3, nights: 2, text: { bn: '৩ দিন / ২ রাত', en: '3 Days / 2 Nights' } },
      priceBDT: Number(formData.priceBDT) || 0,
      coverImage: formData.coverImage?.trim() || '/images/hero_sajek_sunrise_1791788897775.jpg',
      galleryImages: gallery.length > 0 ? gallery : ['/images/hero_sajek_sunrise_1791788897775.jpg'],
      itinerary: formData.itinerary || [],
      included: { bn: incListBn, en: incListEn },
      excluded: { bn: excListBn, en: excListEn },
      accommodation: formData.accommodation || { bn: '', en: '' },
      transport: formData.transport || { bn: '', en: '' },
      departurePoint: formData.departurePoint || { bn: '', en: '' },
      importantNotes: { bn: noteListBn, en: noteListEn },
      featured: Boolean(formData.featured),
      maxGroupSize: Number(formData.maxGroupSize) || 12,
      isVerifiedPackage: Boolean(formData.isVerifiedPackage),
    };

    onSave(finalPackage);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {packageToEdit
                ? language === 'bn'
                  ? 'ট্যুর প্যাকেজ সম্পাদনা'
                  : 'Edit Tour Package'
                : language === 'bn'
                ? 'নতুন ট্যুর প্যাকেজ যোগ করুন'
                : 'Create New Tour Package'}
            </h3>
            <p className="text-xs text-stone-500">
              {packageToEdit?.id ? `ID: ${packageToEdit.id}` : 'All changes sync directly to public pages'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI One-Click Auto-Translate Bar */}
        <div className="mt-3 p-3 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span>AI Auto-Translate (One-Click Localization)</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500 text-white font-bold rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 leading-tight">
                One-click translate all titles, descriptions, inclusions, and itinerary days.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleAutoTranslate('bn', 'en')}
              disabled={isTranslating}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTranslating ? 'অনুবাদ হচ্ছে...' : 'বাংলা ➔ English'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutoTranslate('en', 'bn')}
              disabled={isTranslating}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>{isTranslating ? 'Translating...' : 'English ➔ বাংলা'}</span>
            </button>
          </div>
        </div>

        {/* Translation Notification Alerts */}
        {translateSuccessMsg && (
          <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{translateSuccessMsg}</span>
          </div>
        )}
        {translateErrorMsg && (
          <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{translateErrorMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 mt-3 text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-2.5 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
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
            className={`py-2.5 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'content'
                ? 'border-emerald-800 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn' ? '২. ৩টি ছবি ও বিবরণ' : '2. 3 Images & Descriptions'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`py-2.5 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'itinerary'
                ? 'border-emerald-800 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn'
              ? `৩. ভ্রমণ দিনসমূহ (${formData.itinerary?.length || 0})`
              : `3. Tour Days (${formData.itinerary?.length || 0})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`py-2.5 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Title (Bangla) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateSingleField('title', 'bn')}
                      disabled={isTranslating}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Translate Bangla title to English"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>বাং ➔ ENG</span>
                    </button>
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Title (English) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateSingleField('title', 'en')}
                      disabled={isTranslating}
                      className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Translate English title to Bangla"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>ENG ➔ বাং</span>
                    </button>
                  </div>
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  >
                    <option value="hill-tracts">Hill Tracts (পাহাড় ও মেঘ)</option>
                    <option value="beach">Beach (সমুদ্র সৈকত)</option>
                    <option value="tea-gardens">Tea Gardens (চা বাগান)</option>
                    <option value="wildlife">Wildlife (বন্যপ্রাণী ও ম্যানগ্রোভ)</option>
                    <option value="island">Island (দ্বীপ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.priceBDT}
                    onChange={(e) => setFormData({ ...formData, priceBDT: Number(e.target.value) })}
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Duration Text (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.duration?.text?.bn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: {
                          days: formData.duration?.days || 3,
                          nights: formData.duration?.nights || 2,
                          text: {
                            bn: e.target.value,
                            en: formData.duration?.text?.en || '3 Days / 2 Nights',
                          },
                        },
                      })
                    }
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
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                  />
                  <span>Mark as Featured Tour (Show on Homepage)</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: 3 IMAGES & DESCRIPTIONS */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Image Slots Notice & Presets */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    <span>3 Tour Images Configuration (Supports Direct Links & Local Assets)</span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Works with Unsplash, Imgur, direct https://, and local /images/...
                  </span>
                </div>

                {/* 1-Click Quick Image Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-stone-600">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetImages('sajek')}
                    className="px-2 py-1 text-[11px] rounded bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    ☁️ Sajek Sunrise
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetImages('coxsbazar')}
                    className="px-2 py-1 text-[11px] rounded bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    🌊 Cox's Bazar Sea
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetImages('bandarban')}
                    className="px-2 py-1 text-[11px] rounded bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    ⛰️ Bandarban Hills
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetImages('sylhet')}
                    className="px-2 py-1 text-[11px] rounded bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    🍃 Sylhet Tea Garden
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetImages('sundarbans')}
                    className="px-2 py-1 text-[11px] rounded bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    🐅 Sundarbans Mangrove
                  </button>
                </div>
              </div>

              {/* 3 IMAGE INPUTS WITH LIVE PREVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Image 1: Main Cover */}
                <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      1. Main Cover Image <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                      Hero
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://... or /images/..."
                    className="w-full py-2 px-2.5 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                    <img
                      src={resolveImageUrl(formData.coverImage)}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageFallback(e, 'sajek')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Image 2: Gallery Image 1 */}
                <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      2. Gallery Image 1
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 font-bold rounded">
                      Gallery
                    </span>
                  </div>
                  <input
                    type="text"
                    value={galleryImage1}
                    onChange={(e) => setGalleryImage1(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="w-full py-2 px-2.5 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                    <img
                      src={resolveImageUrl(galleryImage1, 'bandarban')}
                      alt="Gallery 1 Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageFallback(e, 'bandarban')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Image 3: Gallery Image 2 */}
                <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      3. Gallery Image 2
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 font-bold rounded">
                      Gallery
                    </span>
                  </div>
                  <input
                    type="text"
                    value={galleryImage2}
                    onChange={(e) => setGalleryImage2(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="w-full py-2 px-2.5 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                    <img
                      src={resolveImageUrl(galleryImage2, 'sylhet')}
                      alt="Gallery 2 Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageFallback(e, 'sylhet')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Short Description (Bangla)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateSingleField('shortDescription', 'bn')}
                      disabled={isTranslating}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Translate Bangla short desc to English"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>বাং ➔ ENG</span>
                    </button>
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Short Description (English)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateSingleField('shortDescription', 'en')}
                      disabled={isTranslating}
                      className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Translate English short desc to Bangla"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>ENG ➔ বাং</span>
                    </button>
                  </div>
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
              </div>

              {/* Detailed Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Detailed Description (Bangla)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateSingleField('detailedDescription', 'bn')}
                      disabled={isTranslating}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Translate Bangla detailed desc to English"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>বাং ➔ ENG</span>
                    </button>
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Detailed Description (English)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateSingleField('detailedDescription', 'en')}
                      disabled={isTranslating}
                      className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Translate English detailed desc to Bangla"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>ENG ➔ বাং</span>
                    </button>
                  </div>
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
              </div>
            </div>
          )}

          {/* TAB 3: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold text-stone-800">
                    Days in Tour ({formData.itinerary?.length || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('bn', 'en')}
                    disabled={isTranslating}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Translate Days</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Itinerary Day</span>
                  </button>
                </div>
              </div>

              {formData.itinerary?.map((day, idx) => (
                <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-800 font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                      Day {day.day}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryDay(idx)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Remove day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 block mb-1">Title (Bangla)</span>
                      <input
                        type="text"
                        placeholder="শিরোনাম (বাংলা)"
                        value={day.title?.bn || ''}
                        onChange={(e) => handleUpdateItineraryDay(idx, 'titleBn', e.target.value)}
                        className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 block mb-1">Title (English)</span>
                      <input
                        type="text"
                        placeholder="Title (English)"
                        value={day.title?.en || ''}
                        onChange={(e) => handleUpdateItineraryDay(idx, 'titleEn', e.target.value)}
                        className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 block mb-1">Description (Bangla)</span>
                      <textarea
                        rows={2}
                        placeholder="বিবরণ (বাংলা)"
                        value={day.description?.bn || ''}
                        onChange={(e) => handleUpdateItineraryDay(idx, 'descBn', e.target.value)}
                        className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 block mb-1">Description (English)</span>
                      <textarea
                        rows={2}
                        placeholder="Description (English)"
                        value={day.description?.en || ''}
                        onChange={(e) => handleUpdateItineraryDay(idx, 'descEn', e.target.value)}
                        className="w-full py-1.5 px-2.5 text-xs rounded bg-white border border-stone-200"
                      />
                    </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Accommodation (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.accommodation?.bn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accommodation: { ...formData.accommodation, bn: e.target.value, en: formData.accommodation?.en || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Transport (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.transport?.bn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transport: { ...formData.transport, bn: e.target.value, en: formData.transport?.en || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Departure Point (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.departurePoint?.bn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departurePoint: { ...formData.departurePoint, bn: e.target.value, en: formData.departurePoint?.en || '' },
                      })
                    }
                    className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Important Notes & Advisories (Bangla — 1 item per line)
                </label>
                <textarea
                  rows={3}
                  value={notesTextBn}
                  onChange={(e) => setNotesTextBn(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-lg bg-stone-50 border border-stone-200"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {packageToEdit ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
