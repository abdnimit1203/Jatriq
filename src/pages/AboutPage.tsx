import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, Heart, MapPin, Award, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  const teamMembers = [
    {
      name: language === 'bn' ? 'মাহমুদুল হাসান' : 'Mahmudul Hasan',
      role: language === 'bn' ? 'প্রতিষ্ঠাতা ও হেড অফ অপারেশন্স' : 'Founder & Head of Operations',
      bio:
        language === 'bn'
          ? '১০+ বছরের পার্বত্য চট্টগ্রাম ও সুন্দরবন ট্র্যাকিং অভিজ্ঞতা। টেকসই পর্যটন প্রসারে নিবেদিত।'
          : '10+ years exploring the Chittagong Hill Tracts and Sundarbans. Passionate advocate of eco-conscious travel.',
    },
    {
      name: language === 'bn' ? 'সুমি চাকমা' : 'Sumi Chakma',
      role: language === 'bn' ? 'লিড হিল গাইড ও কমিউনিটি লিয়াজোঁ' : 'Lead Hill Guide & Community Liaison',
      bio:
        language === 'bn'
          ? 'সাজেক ও বান্দরবানের স্থানীয় সংস্কৃতি, পাহাড়ি পথ ও কটেজ ব্যবস্থাপনায় অভিজ্ঞ ট্রাভেল লিডার।'
          : 'Indigenous cultural ambassador and trek master across Sajek and Bandarban mountain ranges.',
    },
    {
      name: language === 'bn' ? 'কাজী তানভীর' : 'Kazi Tanvir',
      role: language === 'bn' ? 'লজিস্টিকস ও কাস্টমার সাপোর্ট ডিরেক্টর' : 'Logistics & Guest Experience Director',
      bio:
        language === 'bn'
          ? 'গ্রুপ ট্যুর ও ভিআইপি পরিবারের হোটেল-যানবাহন সমন্বয় এবং সার্বক্ষণিক ট্রিপ তদারকিতে পারদর্শী।'
          : 'Expert in group transportation logistics, resort partnerships, and 24/7 guest safety monitoring.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.nav.about }]} />

      {/* Hero Headline */}
      <div className="my-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          {t.aboutPage.heroTitle}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.aboutPage.heroSubtitle}
        </p>
      </div>

      {/* Mission & Story Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 my-12 items-center">
        <div className="lg:col-span-7 space-y-5 text-stone-700 text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-stone-900">
            {t.aboutPage.missionTitle}
          </h2>
          <p>{t.aboutPage.missionP1}</p>
          <p>{t.aboutPage.missionP2}</p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all">
              <ShieldCheck className="w-6 h-6 text-emerald-800 mb-2.5" />
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'bn' ? 'নিরাপত্তা প্রথম' : 'Safety Certified'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {language === 'bn' ? 'নিয়মিত ড্রাইভ ও রিসোর্ট অডিট' : 'Regular transport and lodging safety audits'}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all">
              <Heart className="w-6 h-6 text-emerald-800 mb-2.5" />
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'bn' ? 'কমিউনিটি সচেতন' : 'Community Driven'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {language === 'bn' ? 'স্থানীয় আদিবাসী গাইড ও অর্থায়ন' : 'Direct empowerment of indigenous guides'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-stone-200">
          <img
            src="/src/assets/images/hero_sajek_sunrise_1791788897775.jpg"
            alt="Scenic Bangladesh Travel"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Team Profiles */}
      <div className="mt-16 pt-12 border-t border-stone-200">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t.aboutPage.teamTitle}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-stone-600">
            {t.aboutPage.teamSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/90 p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center text-xl mb-4 shadow-xs">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider mt-1 mb-3 font-mono">
                  {member.role}
                </p>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Packages CTA */}
      <div className="mt-16 bg-stone-900 text-white rounded-2xl p-8 sm:p-12 text-center">
        <h3 className="text-2xl font-bold mb-3">
          {language === 'bn' ? 'চলুন ঘুরে আসি বাংলার অপরূপ রূপ' : 'Ready to embark on an unforgettable journey?'}
        </h3>
        <p className="text-stone-300 text-sm max-w-xl mx-auto mb-6">
          {language === 'bn'
            ? 'আমাদের সাজানো ট্যুর প্যাকেজগুলো দেখুন কিংবা আপনার পছন্দমতো কাস্টম ট্যুর সাজান।'
            : 'Explore our curated domestic tours or talk to us to build your customized group itinerary.'}
        </p>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
        >
          <span>{t.discovery.viewAll}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
