import { TourPackage, DestinationInfo } from '../types';

export const tourPackages: TourPackage[] = [
  {
    id: 'sajek-valley-adventure',
    slug: 'sajek-valley-adventure',
    category: 'hill-tracts',
    categoryLabel: {
      bn: 'পাহাড় ও মেঘের উপত্যকা',
      en: 'Hill Tracts & Cloud Valley',
    },
    destination: {
      bn: 'সাজেক ভ্যালি, বাঘাইছড়ি, রাঙ্গামাটি',
      en: 'Sajek Valley, Rangamati',
    },
    title: {
      bn: 'সাজেক ভ্যালি মেঘের রাজ্য অভিযান',
      en: 'Sajek Valley Kingdom of Clouds Expedition',
    },
    shortDescription: {
      bn: 'মেঘের ওপর ভাসমান কাঠের কটেজে রাতযাপন, কংলাক পাহাড় চূড়া ট্র্যাকিং ও পাহাড়ি সূর্যোদয়।',
      en: 'Sleep above the clouds in wooden hill cottages, trek to Konglak peak, and witness ethereal sunrises.',
    },
    detailedDescription: {
      bn: 'সাজেক ভ্যালিকে বলা হয় মেঘের উপত্যকা। সমুদ্রপৃষ্ঠ থেকে প্রায় ১৮০০ ফুট উঁচুতে অবস্থিত সাজেকের পাহাড়ি পথ, হ্যালিপ্যাডের সূর্যাস্ত এবং কংলাক পাহাড়ের শীর্ষ থেকে দিগন্তজোড়া মেঘমালার দৃশ্য আপনার মনকে প্রশান্তিতে ভরিয়ে দেবে। স্থানীয় লুসাই ও ত্রিপুরা সংস্কৃতির সাথে পরিচিত হওয়ার সুযোগসহ প্রিমিয়াম কাঠের কটেজে রাত্রিযাপনের সম্পূর্ণ প্যাকেজ।',
      en: 'Perched 1,800 feet above sea level in the Chittagong Hill Tracts, Sajek Valley offers an otherworldly escape where rolling clouds drift past your cottage balcony. This 3-day signature tour includes travel through scenic mountain roads escorted by military convoys, sunset views from the helipads, a short scenic trek to Konglak peak, and authentic indigenous hospitality.',
    },
    duration: {
      days: 3,
      nights: 2,
      text: {
        bn: '৩ দিন / ২ রাত',
        en: '3 Days / 2 Nights',
      },
    },
    priceBDT: 8500,
    coverImage: '/images/hero_sajek_sunrise_1791788897775.jpg',
    // Fallback or gallery array
    galleryImages: [
      '/images/hero_sajek_sunrise_1791788897775.jpg',
      '/images/bandarban_hills_1791788946228.jpg',
    ],
    maxGroupSize: 12,
    featured: true,
    isVerifiedPackage: false,
    accommodation: {
      bn: 'সাজেক ভ্যালি প্রিমিয়াম কাঠের কটেজ (মেঘের ভিউ ব্যালকনি)',
      en: 'Premium Wooden Eco-Cottage with private cloud-view balcony',
    },
    transport: {
      bn: 'ঢাকা-দীঘিনালা এসি বাস এবং দীঘিনালা-সাজেক ফোর হুইল চান্দের গাড়ি',
      en: 'Dhaka-Dighinala AC Sleeper/Chair Coach & 4x4 Chander Gari Mountain Vehicle',
    },
    departurePoint: {
      bn: 'ঢাকা (সায়দাবাদ / ফকিরাপুল বাস টার্মিনাল) রাত ১০:০০',
      en: 'Dhaka (Sayedabad / Fakirapool Terminal) 10:00 PM',
    },
    itinerary: [
      {
        day: 1,
        title: {
          bn: 'খাগড়াছড়ি আগমন ও মেঘের রাজ্যে প্রবেশ',
          en: 'Arrival in Khagrachhari & Ascend to Cloud Valley',
        },
        description: {
          bn: 'ভোরে দীঘিনালা পৌঁছে স্থানীয় সকালের নাস্তা সেরে নেওয়া। এরপর নির্ধারিত পাহাড়ি এসকর্টে চান্দের গাড়িতে করে সাজেকের উদ্দেশ্যে রওনা। দুপুরে রিসোর্টে চেক-ইন ও দুপুরের খাবার। বিকেলে রুইলুই পাড়া ঘুরে দেখা এবং হ্যালিপ্যাডে সূর্যাস্ত উপভোগ।',
          en: 'Arrive in Dighinala at dawn, enjoy traditional breakfast, and board reserved 4x4 Chander Gari under army escort. Check in to mountain cottage by noon. Afternoon stroll through Ruilui village followed by golden sunset over the helipad.',
        },
        highlights: {
          bn: ['আর্মি এসকর্ট সহ পাহাড়ি পথযাত্রা', 'রুইলুই পাড়ার পাহাড়ি কৃষ্টি', 'হ্যালিপ্যাড সূর্যাস্ত'],
          en: ['Scenic mountain convoy drive', 'Ruilui Para indigenous village walk', 'Panoramic helipad sunset'],
        },
      },
      {
        day: 2,
        title: {
          bn: 'কংলাক পাহাড় চূড়া ট্র্যাকিং ও পাহাড়ি বারবিকিউ',
          en: 'Konglak Peak Sunrise Trek & Evening Bonfire BBQ',
        },
        description: {
          bn: 'খুব ভোরে কংলাক পাহাড়ে সংক্ষিপ্ত ট্র্যাকিং করে মেঘের সাগর ও সূর্যোদয় দর্শন। কটেজে ফিরে নাস্তা। দুপুরে আলুটিলা গুহা ও তারেং ভিউপয়েন্ট সফর। রাতে কটেজের আঙিনায় পাহাড়ি মশলায় বারবিকিউ ডিনার।',
          en: 'Pre-dawn moderate trek to Konglak Para — the highest point of Sajek. Watch clouds roll like an ocean below your feet. Mid-day relaxation and viewpoint exploration. Traditional seasoned BBQ dinner under starlit mountain skies.',
        },
        highlights: {
          bn: ['কংলাক চূড়ার সূর্যোদয়', 'পাহাড়ি বাঁশের চা ও স্থানীয় খাবার', 'বারবিকিউ ও বনফায়ার নাইট'],
          en: ['Konglak peak sunrise above clouds', 'Bamboo tea tasting', 'Evening bonfire & BBQ dinner'],
        },
      },
      {
        day: 3,
        title: {
          bn: 'আলুটিলা রহস্যময় গুহা, রিছাং ঝরনা ও বিদায়',
          en: 'Alutila Mysterious Cave, Richang Falls & Homeward Journey',
        },
        description: {
          bn: 'সকালে মেঘকে বিদায় জানিয়ে চান্দের গাড়িতে খাগড়াছড়ির উদ্দেশ্যে ফিরতি যাত্রা। আলুটিলা রহস্যময় সুরঙ্গ গুহা ও ঝুলন্ত ব্রিজ পরিদর্শন। রিছাং ঝরনায় গোসল ও স্থানীয় আদিবাসী রেস্তোরাঁয় লাঞ্চ। রাতে ঢাকার উদ্দেশ্যে এসি বাসে রওয়ানা।',
          en: 'Bid farewell to Sajek and descend back to Khagrachhari. Explore ancient subterranean Alutila cave with flaming torches. Refresh at Richang waterfall, savor lunch at local tribal restaurant, and board evening coach to Dhaka.',
        },
        highlights: {
          bn: ['আলুটিলা সুরঙ্গ গুহা অভিজ্ঞতা', 'রিছাং পাহাড়ি ঝরনা', 'ঐতিহ্যবাহী পাহাড়ি খাবার'],
          en: ['Alutila torchlit cave crossing', 'Richang cascades', 'Authentic tribal lunch in Khagrachhari'],
        },
      },
    ],
    included: {
      bn: [
        'ঢাকা – খাগড়াছড়ি – ঢাকা রিটার্ন এসি বাস টিকিট',
        'সাজেকে ২ রাত কাঠের প্রিমিয়াম ইকো-কটেজে রাত্রিযাপন',
        '৩ দিনের সকল বেলার খাবার (দেশি মোরগ, পাহাড়ি খাবার ও স্পেশাল ব্যাম্বু চিকেন)',
        '৩ দিনের রিজার্ভ চান্দের গাড়ি ও দক্ষ চালক',
        'সাজেক ভ্যালি এন্ট্রি ফি ও পারমিট চার্জ',
        'স্পেশাল বারবিকিউ ডিনার (চিকেন বারবিকিউ + পরাটা + কোল্ড ড্রিংকস)',
        'অভিজ্ঞ ট্রাভেল হোস্ট ও গাইড সহায়তা',
      ],
      en: [
        'Dhaka – Khagrachhari – Dhaka return AC coach tickets',
        '2 nights accommodation in premium cloud-view wooden cottage',
        'All meals across 3 days including local specialties and bamboo chicken',
        'Full-time reserved 4x4 Chander Gari with licensed hill driver',
        'All valley entry permits, tolls, and environmental passes',
        'Special mountain BBQ dinner with freshly baked parathas',
        'Full-time experienced tour lead and local indigenous guide',
      ],
    },
    excluded: {
      bn: [
        'যাত্রাপথে বাসের বিরতির ব্যক্তিগত খাবার খরচ',
        'ব্যক্তিগত ওষুধ ও কেনাকাটার খরচ',
        'প্যাকেজের বাইরে অতিরিক্ত কোনো খাদ্য বা পানীয়',
      ],
      en: [
        'En-route highway transit snacks and personal expenses',
        'Personal medications and souvenir purchases',
        'Any activities or meals outside the stated itinerary',
      ],
    },
    importantNotes: {
      bn: [
        'সাজেকে বিদ্যুৎ সংযোগ অনিয়মিত হতে পারে, রিসোর্টে সৌর বিদ্যুৎ ও ব্যাকআপ জেনারেটর রয়েছে। পাওয়ার ব্যাংক সাথে রাখা উত্তম।',
        'পাহাড়ে আবহাওয়া যেকোনো সময় পরিবর্তন হতে পারে, হালকা গরম কাপড় ও আরামদায়ক ট্র্যাকিং জুতো সাথে আনুন।',
        'জাতীয় পরিচয়পত্র বা জন্মনিবন্ধনের ফটোকপি সাথে রাখা বাধ্যতামূলক।',
      ],
      en: [
        'Sajek operates on solar and backup generators; please bring charged power banks.',
        'Mountain weather changes swiftly; bring light layers and comfortable walking shoes.',
        'Original National ID or passport copy is required for security checkpoint registration.',
      ],
    },
  },
  {
    id: 'coxs-bazar-beach-escape',
    slug: 'coxs-bazar-beach-escape',
    category: 'beach',
    categoryLabel: {
      bn: 'সমুদ্র সৈকত ও মেরিন ড্রাইভ',
      en: 'Beaches & Marine Drive',
    },
    destination: {
      bn: 'কক্সবাজার ও ইনানী সৈকত',
      en: 'Cox’s Bazar & Inani Beach',
    },
    title: {
      bn: 'কক্সবাজার লাক্সারি সি-এস্কেপ ও মেরিন ড্রাইভ',
      en: 'Cox’s Bazar Coastal Retreat & Marine Drive',
    },
    shortDescription: {
      bn: 'বিশ্বের দীর্ঘতম সমুদ্র সৈকতে চার তারকা রিসোর্ট স্টে, মেরিন ড্রাইভ ওপেন হুড জিপ ড্রাইভ ও সি-ফুড ডাইনিং।',
      en: 'Luxury beachfront resort stay, open-hood Marine Drive coastal drive, and authentic seafood culinary trail.',
    },
    detailedDescription: {
      bn: '১২০ কিলোমিটার দীর্ঘ বিশ্বের দীর্ঘতম অখণ্ড প্রাকৃতিক বালুকাময় সমুদ্র সৈকতে কাটান আরামদায়ক ছুটি। মারমেইড কিংবা সী পার্ল সংলগ্ন প্রাইভেট বিচ, ইনানীর প্রবাল পাথর, হিমছড়ির পাহাড়ি ঝরনা ও বিখ্যাত মেরিন ড্রাইভের অনিন্দ্য সুন্দর রোড ট্রিপ। যারা পরিবারের সাথে নিরিবিলি সাগরের ঢেউ ও সূর্যাস্ত উপভোগ করতে চান তাদের জন্য সেরা আয়োজন।',
      en: 'Experience the world’s longest natural sandy beach with unmatched serenity and luxury. This 3-day coastal package features sea-facing resort accommodation, a private open-top jeep journey along the iconic Marine Drive hugging the Bay of Bengal, sunset drinks in Inani, and freshly grilled fish at local coastal fisherman harbors.',
    },
    duration: {
      days: 3,
      nights: 2,
      text: {
        bn: '৩ দিন / ২ রাত',
        en: '3 Days / 2 Nights',
      },
    },
    priceBDT: 9500,
    coverImage: '/images/coxs_bazar_sunset_1791788910726.jpg',
    galleryImages: [
      '/images/coxs_bazar_sunset_1791788910726.jpg',
      '/images/sundarbans_mangrove_1791788934964.jpg',
    ],
    maxGroupSize: 16,
    featured: true,
    isVerifiedPackage: false,
    accommodation: {
      bn: 'কলাতলী / ইনানী বিচ সংলগ্ন ৪ তারকা রেটেড সি-ভিউ রিসোর্ট',
      en: '4-Star Oceanfront Resort with Private Balcony and Swimming Pool',
    },
    transport: {
      bn: 'ঢাকা-কক্সবাজার এসি বিজনেস ক্লাস বাস / মেরিন ড্রাইভ ওপেন জিপ',
      en: 'Dhaka-Cox’s Bazar AC Business Class Coach & Private Marine Drive 4x4 Jeep',
    },
    departurePoint: {
      bn: 'ঢাকা আরামবাগ / কলাবাগান কাউন্টার',
      en: 'Dhaka Arambagh / Kalabagan Counter',
    },
    itinerary: [
      {
        day: 1,
        title: {
          bn: 'সৈকত শহরে আগমন ও সমুদ্রের সান্নিধ্য',
          en: 'Arrival in Cox’s Bazar & Oceanfront Sunset',
        },
        description: {
          bn: 'সকালে কক্সবাজার পৌঁছে রিসোর্টে চেক-ইন ও ওয়েলকাম ড্রিংক। বিকেলে সুগন্ধা ও লাবণী সৈকতে সাগরের ঢেউয়ে অবগাহন। সন্ধ্যায় সৈকতের পাড়ে বসে সূর্যাস্ত দর্শন ও তাজা সামুদ্রিক মাছের ফ্রাই আস্বাদন।',
          en: 'Morning arrival in Cox’s Bazar, check-in with fresh coconut welcome drinks. Relax on the private beachfront, swim in the warm surf, and watch the sun melt into the Bay of Bengal.',
        },
        highlights: {
          bn: ['৪ তারকা সি-ভিউ রিসোর্ট চেক-ইন', 'লাবণী বিচে সূর্যাস্ত', 'ফ্রেশ সি-ফুড ফ্রাই ট্রেইল'],
          en: ['Oceanfront resort check-in', 'Private beach leisure', 'Coastal seafood barbecue'],
        },
      },
      {
        day: 2,
        title: {
          bn: 'মেরিন ড্রাইভ ওপেন জিপ রাইড, হিমছড়ি ও ইনানী প্রবাল সৈকত',
          en: 'Scenic Marine Drive Open Jeep Cruise to Inani & Himchhari',
        },
        description: {
          bn: 'একপাশে সবুজ পাহাড় এবং অন্যপাশে উত্তাল সমুদ্র—বিখ্যাত মেরিন ড্রাইভ দিয়ে ওপেন হুড জিপে রোমাঞ্চকর যাত্রা। হিমছড়ির পাহাড়ি ভিউপয়েন্ট থেকে সাগরের বিশালতা দেখা এবং ইনানী সৈকতের প্রবাল পাথরে বসে সূর্যাস্ত উপভোগ।',
          en: 'Board an open-hood safari jeep along the 80km Marine Drive — green hills on one side, turquoise waves on the other. Hike Himchhari lookout hill and explore the tranquil coral formations of Inani beach.',
        },
        highlights: {
          bn: ['ওপেন হুড জিপ মেরিন ড্রাইভ', 'হিমছড়ি পাহাড় ভিউপয়েন্ট', 'ইনানী কোরাল বিচ রিল্যাক্সেশন'],
          en: ['Open-air jeep road trip', 'Himchhari hilltop viewpoint', 'Inani coral beach sunset'],
        },
      },
      {
        day: 3,
        title: {
          bn: 'শুঁটকি পল্লী, বার্মিজ মার্কেট শপিং ও প্রত্যাবর্তন',
          en: 'Burmese Market Souvenirs, Local Seafood Feast & Return',
        },
        description: {
          bn: 'সকালে রিসোর্টের ব্যালকনিতে নাস্তা সেরে স্থানীয় রাখাইন বার্মিজ মার্কেট ঘুরে দেখা। ঐতিহ্যবাহী হস্তশিল্প ও মুক্তার গহনা কেনাকাটা। দুপুরের খাবার শেষে সন্ধ্যার বাসে ঢাকার উদ্দেশ্যে যাত্রা।',
          en: 'Breakfast on the ocean terrace. Morning cultural visit to Rakhine community temples and authentic Burmese market for handmade textiles, dried fish, and artisanal goods. Evening return coach.',
        },
        highlights: {
          bn: ['ঐতিহ্যবাহী রাখাইন বার্মিজ মার্কেট', 'সৈকতে শেষবারের মতো হাঁটা', 'আরামদায়ক এসি বাস যাত্রা'],
          en: ['Burmese artisan shopping', 'Final beach stroll', 'Comfortable return coach'],
        },
      },
    ],
    included: {
      bn: [
        'ঢাকা – কক্সবাজার – ঢাকা রিটার্ন লাক্সারি এসি বাস',
        '২ রাত ৪ তারকা মানের সি-ভিউ রিসোর্টে রুম শেয়ারিং',
        'প্রতিদিনের বুফে ব্রেকফাস্ট ও সিলেক্টেড সি-ফুড ডিনার',
        'মেরিন ড্রাইভে পুরো দিনের জন্য প্রাইভেট ওপেন জিপ সার্ভিস',
        'হিমছড়ি ও ইনানী এন্ট্রি টিকিট',
        'সার্বক্ষণিক ট্যুর কো-অর্ডিনেটর সহায়তা',
      ],
      en: [
        'Dhaka – Cox’s Bazar – Dhaka return luxury AC coach',
        '2 nights stay in 4-star oceanfront resort',
        'Daily buffet breakfast and curated seafood dinners',
        'Full-day private open-top 4x4 jeep along Marine Drive',
        'All scenic park entry fees and toll taxes',
        'Full-time tour coordinator concierge',
      ],
    },
    excluded: {
      bn: [
        'ব্যক্তিগত শপিং ও প্যারাগ্লাইডিং/জেট স্কি রাইড খরচ',
        'দুপুরের খাবার (ব্যক্তিগত রুচি অনুযায়ী)',
        'রিসোর্টের মিনিবার ও অতিরিক্ত রুম সার্ভিস',
      ],
      en: [
        'Personal shopping and adventure watersports (Jet ski / Parasailing)',
        'A-la-carte lunch expenses',
        'Mini-bar and private resort room service',
      ],
    },
    importantNotes: {
      bn: [
        'সমুদ্রে জোয়ার-ভাটার সময়সূচী মেনে গোসল করুন এবং লাল পতাকা থাকা অবস্থায় পানিতে নামা থেকে বিরত থাকুন।',
        'সৈকত পরিষ্কার রাখতে প্লাস্টিক বর্জ্য নির্ধারিত ডাস্টবিনে ফেলুন।',
      ],
      en: [
        'Strictly follow lifeguard safety flags and tidal warning boards.',
        'Help keep Bangladesh beaches pristine: zero single-use littering.',
      ],
    },
  },
  {
    id: 'sreemangal-sylhet-tea-retreat',
    slug: 'sreemangal-sylhet-tea-retreat',
    category: 'tea-gardens',
    categoryLabel: {
      bn: 'চায়ের দেশ ও বৃষ্টিবন',
      en: 'Tea Highlands & Rainforest',
    },
    destination: {
      bn: 'শ্রীমঙ্গল ও মৌলভীবাজার, সিলেট',
      en: 'Sreemangal & Sylhet',
    },
    title: {
      bn: 'শ্রীমঙ্গল সবুজ চা বাগান ও লাউয়াছড়া রেইনফরেস্ট রিট্রিট',
      en: 'Sreemangal Emerald Tea Gardens & Rainforest Retreat',
    },
    shortDescription: {
      bn: 'চায়ের দেশে শান্ত অবকাশ, লাউয়াছড়া রেইনফরেস্টে উলুক বানর ট্রেইল, মাধবপুর লেক ও সাতরঙা চা।',
      en: 'Serene retreat among rolling tea terraces, Lawachara gibbon trail, Madhabpur Lake lotus blossoms, and 7-layer tea.',
    },
    detailedDescription: {
      bn: 'সবুজ গালিচার মতো বিছানো মাইলের পর মাইল চা বাগান, ছায়াবৃক্ষ আর পাখির কলকাকলি। শ্রীমঙ্গলের লাউয়াছড়া জাতীয় উদ্যানের গভীর অরণ্য, খাসিয়া পুঞ্জির জীবনযাত্রা এবং শান্ত মাধবপুর লেকের পদ্মফুলের সৌন্দর্য আপনাকে দেবে নাগরিক ক্লান্তি থেকে মুক্তি। ইকো-রিসোর্টে অবস্থান ও বিশ্বখ্যাত নীলকণ্ঠের সাতরঙা চা আস্বাদনের রাজকীয় সুযোগ।',
      en: 'Known as the Tea Capital of Bangladesh, Sreemangal is an emerald paradise wrapped in mist and fragrant tea leaves. Walk along silent terraced plantations, trek through the primeval canopy of Lawachara National Park in search of rare western hoolock gibbons, and paddle through lily pads at Madhabpur Lake.',
    },
    duration: {
      days: 3,
      nights: 2,
      text: {
        bn: '৩ দিন / ২ রাত',
        en: '3 Days / 2 Nights',
      },
    },
    priceBDT: 7200,
    coverImage: '/images/sylhet_tea_gardens_1791788922427.jpg',
    galleryImages: [
      '/images/sylhet_tea_gardens_1791788922427.jpg',
      '/images/hero_sajek_sunrise_1791788897775.jpg',
    ],
    maxGroupSize: 14,
    featured: true,
    isVerifiedPackage: false,
    accommodation: {
      bn: 'চা বাগান ঘেরা প্রিমিয়াম ইকো-রিসোর্ট / উডেন বাংলো',
      en: 'Boutique Tea Garden Eco-Resort nestled amid private plantations',
    },
    transport: {
      bn: 'ঢাকা-শ্রীমঙ্গল এসি পারাবত/উপবন ট্রেন অথবা লাক্সারি এসি মাইক্রোবাস',
      en: 'AC Express Train / Private Luxury Hiace Microbus for whole tour',
    },
    departurePoint: {
      bn: 'কমলাপুর রেলওয়ে স্টেশন অথবা মতিঝিল',
      en: 'Kamalapur Railway Station or Motijheel, Dhaka',
    },
    itinerary: [
      {
        day: 1,
        title: {
          bn: 'চায়ের দেশে আগমন ও ফিনলে টি এস্টেট সাইকেল রাইড',
          en: 'Arrival in Sreemangal & Plantation Bicycle Leisure',
        },
        description: {
          bn: 'সকালে ট্রেনে বা মাইক্রোবাসে শ্রীমঙ্গল পৌঁছে রিসোর্টে চেক-ইন। দুপুরে ঐতিহ্যবাহী সিলেটি সাতকড়া বিফ/চিকেন দিয়ে মধ্যাহ্নভোজ। বিকেলে ফিনলে চা বাগানের মেঠোপথ দিয়ে হাঁটা অথবা সাইক্লিং। সন্ধ্যায় নীলকণ্ঠের বিখ্যাত ৭ রঙের চা উপভোগ।',
          en: 'Morning arrival in Sreemangal and welcome tea at the resort. Savor authentic Sylheti meal seasoned with fragrant Shatkora citrus. Afternoon bicycle ride or gentle walk through historic Finlay Tea Estates.',
        },
        highlights: {
          bn: ['চা বাগান রিসোর্ট চেক-ইন', 'ফিনলে চা বাগান সূর্যাস্ত', 'ঐতিহাসিক ৭ রঙের চা আস্বাদন'],
          en: ['Eco-resort check-in', 'Tea estate sunset walk', 'Iconic 7-layer tea tasting'],
        },
      },
      {
        day: 2,
        title: {
          bn: 'লাউয়াছড়া জাতীয় উদ্যান ট্রেইল ও মাধবপুর লেক',
          en: 'Lawachara Rainforest Canopy Trek & Madhabpur Lake',
        },
        description: {
          bn: 'খুব ভোরে লাউয়াছড়া রেইনফরেস্টে গাইডসহ ৩ ঘণ্টার নেচার ট্রেইল। খাসিয়া পুঞ্জিতে ঐতিহ্যবাহী পান চাষ ও জীবনধারা পরিদর্শন। দুপুরে ফিরে এসে বিশ্রাম। বিকেলে ভারতের ত্রিপুরা সীমান্ত সংলগ্ন মাধবপুর লেকের নীল জলে পদ্মফুল ও সূর্যাস্ত দর্শন।',
          en: 'Early morning nature trail into Lawachara rainforest canopy. Spot indigenous bird species and endangered hoolock gibbons. Visit authentic Khasia tribal settlement. Spend peaceful late afternoon overlooking lily-covered Madhabpur Lake.',
        },
        highlights: {
          bn: ['লাউয়াছড়া রেইনফরেস্ট ট্র্যাকিং', 'খাসিয়া আদিবাসী সংস্কৃতি', 'মাধবপুর লেকের শান্ত সৌন্দর্য'],
          en: ['Guided rainforest canopy walk', 'Khasia tribal village visit', 'Sunset over Madhabpur Lake'],
        },
      },
      {
        day: 3,
        title: {
          bn: 'হাইল হাওর বাইক্কা বিল ও ঢাকার পথে ফেরা',
          en: 'Baikka Beel Wetland Bird Sanctuary & Return',
        },
        description: {
          bn: 'সকালে হাইল হাওরের বাইক্কা বিল অভয়ারণ্য পরিদর্শন। ওয়াচ টাওয়ার থেকে পরিযায়ী পাখি ও মাছের প্রাকৃতিক আবাস দেখা। স্থানীয় বাজারে খাঁটি মণিপুরি শাল ও শ্রীমঙ্গলের স্পেশাল চা পাতা কিনে ঢাকার উদ্দেশ্যে যাত্রা।',
          en: 'Morning visit to Baikka Beel wetland sanctuary in Hail Haor. Climb the observation watchtower to view rare water birds. Browse Manipuri handloom weaves and buy farm-fresh artisanal tea before returning to Dhaka.',
        },
        highlights: {
          bn: ['বাইক্কা বিল বার্ড ওয়াচিং টাওয়ার', 'মণিপুরি তাঁতপল্লী শপিং', 'ফ্রেশ প্রিমিয়াম চা সংগ্রহ'],
          en: ['Bird watching from sanctuary tower', 'Authentic Manipuri weaving market', 'Fresh estate tea collection'],
        },
      },
    ],
    included: {
      bn: [
        'ঢাকা – শ্রীমঙ্গল – ঢাকা রিটার্ন এসি ট্রেন/মাইক্রোবাস',
        '২ রাত চা বাগান সংলগ্ন প্রিমিয়াম রিসোর্ট স্টে',
        'প্রতিদিনের ৩ বেলার ঐতিহ্যবাহী খাবার ও স্পেশাল সাতকড়া ডিনার',
        'সাইটসিয়িং এর জন্য সার্বক্ষণিক রিজার্ভ এসি মাইক্রোবাস',
        'লাউয়াছড়া ও বাইক্কা বিলের সরকারি ফরেস্ট পারমিট ও ট্র্যাকিং গাইড ফি',
        'মণিপুরি পুঞ্জি ও চা বাগানের সার্বক্ষণিক হোস্ট',
      ],
      en: [
        'Dhaka – Sreemangal – Dhaka return AC transit',
        '2 nights lodging in boutique tea garden resort',
        'All meals featuring organic local cuisine and Shatkora special',
        'Dedicated AC Microbus for all transfers and excursions',
        'Forest department permits and expert naturalist guide fees',
        'Full-time tour director and local coordinator',
      ],
    },
    excluded: {
      bn: [
        'ব্যক্তিগত হস্তশিল্প ও চা পাতা কেনার খরচ',
        'প্যাকেজ বহির্ভূত ব্যক্তিগত পানীয়',
      ],
      en: [
        'Souvenirs, textiles, and personal tea leaf shopping',
        'Personal medications and a-la-carte snacks',
      ],
    },
    importantNotes: {
      bn: [
        'লাউয়াছড়া বনে ভ্রমণের সময় কোনো ধরণের শব্দ দূষণ বা বন্যপ্রাণীদের খাবার দেওয়া সম্পূর্ণ নিষিদ্ধ।',
        'হালকা রঙের সুতি পোশাক ও পতঙ্গ নিবারক লোশন সাথে রাখা ভালো।',
      ],
      en: [
        'Lawachara is a protected sanctuary: absolute silence and no feeding wildlife.',
        'Wear earth-toned attire and bring natural mosquito repellent.',
      ],
    },
  },
  {
    id: 'sundarbans-mangrove-safari',
    slug: 'sundarbans-mangrove-safari',
    category: 'wildlife',
    categoryLabel: {
      bn: 'ম্যানগ্রোভ অরণ্য ও বন্যপ্রাণী',
      en: 'Mangrove & Wildlife Safari',
    },
    destination: {
      bn: 'সুন্দরবন ও কটকা-কচিখালী, খুলনা/বাগেরহাট',
      en: 'Sundarbans Mangrove, Khulna',
    },
    title: {
      bn: 'সুন্দরবন রয়্যাল ট্রেইল ও বিলাসবহুল শিপ ক্রুজ',
      en: 'Sundarbans Royal Bengal Trail & Cruise Expedition',
    },
    shortDescription: {
      bn: 'ইউনেস্কো বিশ্ব ঐতিহ্য সুন্দরবনের গহিনে ৩ দিন ২ রাতের নন-স্টপ শিপ ক্রুজ, হরিন ও বাঘের ট্রেইল, ক্যানেল ক্রুজিং।',
      en: '3-day luxury expedition vessel cruise deep inside UNESCO World Heritage mangrove, silent creek boats & wildlife trails.',
    },
    detailedDescription: {
      bn: 'পৃথিবীর বৃহত্তম একক ম্যানগ্রোভ বন সুন্দরবনের শান্ত নদী ও খালের ভেতর দিয়ে ৩ দিনের রাজকীয় জাহাজ ভ্রমণ। করমজল বন্যপ্রাণী প্রজনন কেন্দ্র, কটকা অভয়ারণ্যের টাইগার ট্রেইল, জামতলা সমুদ্র সৈকত এবং হারবাড়িয়া ইকো-ট্যুরিজম কেন্দ্র। সার্বক্ষণিক বন বিভাগের সশস্ত্র প্রহরী ও অভিজ্ঞ ন্যাচারালিস্ট গাইডের সাথে জীবনের শ্রেষ্ঠ রোমাঞ্চ।',
      en: 'Venture into the mysterious tidal waterways of the world’s largest mangrove forest aboard a specially chartered expedition cruise ship. Navigate narrow silent creeks on country wooden boats, walk the tiger trails of Kotka wildlife sanctuary, watch spotted deer grazing along Jamtola beach, and listen to the pulse of untamed nature under forest guard protection.',
    },
    duration: {
      days: 3,
      nights: 2,
      text: {
        bn: '৩ দিন / ২ রাত (জাহাজে)',
        en: '3 Days / 2 Nights (Onboard Cruise)',
      },
    },
    priceBDT: 13500,
    coverImage: '/images/sundarbans_mangrove_1791788934964.jpg',
    galleryImages: [
      '/images/sundarbans_mangrove_1791788934964.jpg',
      '/images/coxs_bazar_sunset_1791788910726.jpg',
    ],
    maxGroupSize: 25,
    featured: true,
    isVerifiedPackage: false,
    accommodation: {
      bn: 'বিলাসবহুল ট্রাভেল জাহাজে শীতাতপ নিয়ন্ত্রিত (AC) প্রাইভেট কেবিন',
      en: 'Air-conditioned private twin/double cabin aboard safari cruiser vessel',
    },
    transport: {
      bn: 'ঢাকা-খুলনা এসি বাস এবং মোংলা থেকে ৩ দিনের ক্রুজ শিপ',
      en: 'Dhaka-Khulna/Mongla AC Coach & 3-Day Chartered Mangrove Cruiser',
    },
    departurePoint: {
      bn: 'ঢাকা (গাবতলী / সায়েদাবাদ) এবং মোংলা ফেরিঘাট',
      en: 'Dhaka Gabtoli / Sayedabad to Mongla Port Ghat',
    },
    itinerary: [
      {
        day: 1,
        title: {
          bn: 'মোংলা থেকে জাহাজে যাত্রা ও হারবাড়িয়া ইকো-ট্যুরিজম ট্রেইল',
          en: 'Mongla Embarkation & Harbaria Forest Canopy Walk',
        },
        description: {
          bn: 'সকালে মোংলা ঘাটে বিলাসবহুল জাহাজে আরোহণ ও রিফ্রেশমেন্ট। পশুর নদী বেয়ে সুন্দরবনের গহিনের উদ্দেশ্যে যাত্রা। হারবাড়িয়া ইকো-ট্যুরিজম কেন্দ্রে কাঠের ট্রেইলে বনের ভেতর হাঁটা ও বাঘের পায়ের ছাপ পর্যবেক্ষণ। সন্ধ্যায় জাহাজের ডেকে বারবিকিউ ডিনার।',
          en: 'Board the safari cruiser at Mongla Port with welcome fresh juice. Cruise along Passur river entering the national park. Disembark at Harbaria eco-center for a wooden boardwalk hike through prime sundari canopy. Evening musical deck dinner.',
        },
        highlights: {
          bn: ['মোংলায় জাহাজে আরোহণ', 'হারবাড়িয়া কাঠের ট্রেইল ও ওয়াচ টাওয়ার', 'পশুর নদীতে সূর্যাস্ত দর্শন'],
          en: ['Boarding expedition vessel', 'Harbaria boardwalk hike', 'Sunset over Passur river'],
        },
      },
      {
        day: 2,
        title: {
          bn: 'কটকা বন্যপ্রাণী অভয়ারণ্য, বাঘের ট্রেইল ও জামতলা সি-বিচ',
          en: 'Kotka Wildlife Sanctuary, Silent Creeks & Jamtola Beach',
        },
        description: {
          bn: 'খুব ভোরে কাঠের দেশি নৌকায় নিঃশব্দে বনের ছোট খালে ক্যানেল ক্রুজিং ও পাখি দর্শন। কটকা অভয়ারণ্যে হাজারো চিত্রা হরিণ ও বন্য শূকরের দল দেখা। এরপর জামতলা সি-বিচে রোমাঞ্চকর ট্র্যাকিং ও সাগরের পাড়ে নির্জন সময় কাটানো।',
          en: 'Silent dawn country-boat row through narrow tidal creeks to observe kingfishers, otters, and monitor lizards. Morning hike through Kotka grass meadows surrounded by spotted deer herds. Afternoon trek to secluded Jamtola Sea Beach.',
        },
        highlights: {
          bn: ['ভোরের নিঃশব্দ ক্যানেল ক্রুজ', 'কটকা চিত্রা হরিণের অভয়ারণ্য', 'জামতলা নির্জন সৈকত ট্র্যাকিং'],
          en: ['Silent dawn creek rowing', 'Kotka spotted deer herds', 'Jamtola wild beach trek'],
        },
      },
      {
        day: 3,
        title: {
          bn: 'কচিখালী বন্যপ্রাণী ওয়াচ টাওয়ার, করমজল কুমির কেন্দ্র ও মোংলা ফেরত',
          en: 'Kochikhali Watchtower, Karamjal Crocodile Center & Return',
        },
        description: {
          bn: 'সকালে কচিখালী ফরেস্ট স্টেশনে নেমে গভীর ম্যানগ্রোভের ভেতর ওয়াচ টাওয়ার দর্শন। দুপুরে ফেরার পথে করমজল কুমির প্রজনন কেন্দ্র ও হরিণ পার্ক পরিদর্শন। বিকেলে মোংলা ঘাটে পৌঁছে এসি বাসে ঢাকার উদ্দেশ্যে রওনা।',
          en: 'Morning trail at Kochikhali forest station. Mid-day stop at Karamjal wildlife conservation and saltwater crocodile breeding facility. Arrive back at Mongla port by late afternoon and board return coach to Dhaka.',
        },
        highlights: {
          bn: ['কচিখালী ডিপ ফরেস্ট ট্রেইল', 'করমজল লবণাক্ত জলের কুমির সংরক্ষণাগার', 'ফরেস্ট গার্ডদের সাথে অভিজ্ঞতা বিনিময়'],
          en: ['Kochikhali deep forest trail', 'Karamjal crocodile breeding center', 'Forest ranger story session'],
        },
      },
    ],
    included: {
      bn: [
        'ঢাকা – মোংলা – ঢাকা রিটার্ন এসি বাস টিকিট',
        '৩ দিন ২ রাত জাহাজে ফুলবোর্ড এসি কেবিন স্টে',
        'প্রতিদিন ৬ বেলার রাজকীয় খাবার (সকালের নাস্তা, স্ন্যাক্স, লাঞ্চ, ডিনার ও সি-ফুড)',
        'সুন্দরবন বন বিভাগের এন্ট্রি পারমিট ও সকল রেভিনিউ ফি',
        'নিরাপত্তার জন্য ২ জন সরকারি সশস্ত্র বনরক্ষী',
        'অভিজ্ঞ ওয়াইল্ডলাইফ ন্যাচারালিস্ট গাইড',
        'ছোট খালে সাইটসিয়িং এর জন্য ইঞ্জিনবিহীন কাঠের দেশি নৌকা',
      ],
      en: [
        'Dhaka – Mongla – Dhaka return AC coach tickets',
        '3 days 2 nights full-board private cabin stay on expedition vessel',
        '6 meals daily prepared by onboard master chef (including river seafood & BBQ)',
        'Sundarbans forest department entry passes, camera permits & vessel taxes',
        'Two armed government forest rangers for total expedition security',
        'Experienced wildlife naturalist guide and tour director',
        'Country rowing boat transfers for intimate narrow creek safaris',
      ],
    },
    excluded: {
      bn: [
        'বিদেশি নাগরিকদের জন্য সরকারের অতিরিক্ত ফরেস্ট ফি',
        'ব্যক্তিগত ওষুধ ও টিপস',
      ],
      en: [
        'Foreign passport government surcharge (applicable for non-residents)',
        'Personal gratuities and personal medicines',
      ],
    },
    importantNotes: {
      bn: [
        'সুন্দরবনে মোবাইল নেটওয়ার্ক পাওয়া যায় না। জরুরি যোগাযোগের জন্য জাহাজে স্যাটেলাইট রেডিও ব্যবস্থা রয়েছে।',
        'বনের শান্ত পরিবেশ বজায় রাখতে উচ্চস্বরে কথা বলা বা বন্যপ্রাণীদের বিরক্ত করা আইনত দণ্ডনীয়।',
      ],
      en: [
        'Cellular network is unavailable inside deep mangrove; ship has satellite communication.',
        'Strict wildlife etiquette: zero littering, no smoking on forest trails, no loud audio.',
      ],
    },
  },
  {
    id: 'bandarban-mountain-journey',
    slug: 'bandarban-mountain-journey',
    category: 'hill-tracts',
    categoryLabel: {
      bn: 'পাহাড় ও ঝরনা অভিযান',
      en: 'High Altitude & Waterfalls',
    },
    destination: {
      bn: 'বান্দরবান, নীলগিরি ও থানচি',
      en: 'Bandarban & Nilgiri Hills',
    },
    title: {
      bn: 'বান্দরবান নীলগিরি মেঘচুম্বী চূড়া ও স্বর্ণমন্দির ওডিসি',
      en: 'Bandarban Nilgiri Sky Peaks & Golden Temple Odyssey',
    },
    shortDescription: {
      bn: '২৪০০ ফুট উঁচুতে মেঘের স্পর্শ, নীলগিরি ও নীলাচল ভিউপয়েন্ট, শৈলপ্রপাত ঝরনা এবং বম ও মারমা সংস্কৃতির অভিজ্ঞতা।',
      en: 'Touch passing clouds at 2,400 feet, panoramic Nilgiri & Nilachal vistas, Shoilo Propat cascades, and Marma heritage.',
    },
    detailedDescription: {
      bn: 'বাংলাদেশের সবচেয়ে উঁচু ও দুর্গম পাহাড়ি জেলা বান্দরবান। আঁকাবাঁকা পাহাড়ি পথ দিয়ে চান্দের গাড়িতে যাত্রা করে পৌঁছে যান ২৪০০ ফুট উঁচুতে মেঘের স্পর্শে অবস্থিত নীলগিরিতে। সাথে রয়েছে নীলাচলের চোখ জুড়ানো সূর্যাস্ত, শৈলপ্রপাতের স্নিগ্ধ জলধারা এবং ঐতিহ্যবাহী বৌদ্ধ স্বর্ণমন্দির। যারা পাহাড়ের আসল গাম্ভীর্য উপভোগ করতে চান তাদের জন্য অনন্য এক ট্রিপ।',
      en: 'Discover the dramatic alpine ridge-lines of Bandarban, home to Bangladesh’s highest peaks. Ascend the legendary serpentine mountain pass by 4x4 Chander Gari to reach Nilgiri, where mist caresses your hands at 2,400 feet altitude. Watch the golden dusk over Nilachal, hear the rushing waters of Shoilo Propat, and visit the serene Golden Buddha Temple.',
    },
    duration: {
      days: 3,
      nights: 2,
      text: {
        bn: '৩ দিন / ২ রাত',
        en: '3 Days / 2 Nights',
      },
    },
    priceBDT: 8200,
    coverImage: '/images/bandarban_hills_1791788946228.jpg',
    galleryImages: [
      '/images/bandarban_hills_1791788946228.jpg',
      '/images/hero_sajek_sunrise_1791788897775.jpg',
    ],
    maxGroupSize: 12,
    featured: false,
    isVerifiedPackage: false,
    accommodation: {
      bn: 'বান্দরবান হিল ভিউ ইকো-রিসোর্ট / নীলগিরি সংলগ্ন কটেজ',
      en: 'Hill-view Boutique Eco Resort with panoramic valley vistas',
    },
    transport: {
      bn: 'ঢাকা-বান্দরবান এসি স্লিপার/সিট বাস ও ৩ দিনের রিজার্ভ ফোর হুইল জিপ',
      en: 'Dhaka-Bandarban return AC Coach & dedicated 4x4 Chander Gari Jeep',
    },
    departurePoint: {
      bn: 'ঢাকা ফকিরাপুল / কলাবাগান',
      en: 'Dhaka Fakirapool / Kalabagan',
    },
    itinerary: [
      {
        day: 1,
        title: {
          bn: 'পাহাড়ে পদার্পণ ও স্বর্ণমন্দির ও নীলাচল সূর্যাস্ত',
          en: 'Arrival in Bandarban, Golden Temple & Nilachal Sunset',
        },
        description: {
          bn: 'ভোরে বান্দরবান শহরে পৌঁছে রিসোর্টে ফ্রেশ হওয়া। সকালে বৌদ্ধ ধাতু জাদি (স্বর্ণমন্দির) দর্শন। বিকেলে নীলাচলের দৃষ্টিনন্দন পাহাড়ি চূড়ায় মেঘের লুকোচুরি ও সূর্যাস্ত উপভোগ। রাতে পাহাড়ি স্থানীয় বাজারে কেনাকাটা।',
          en: 'Morning arrival in Bandarban town, check in to hill-view resort. Visit the magnificent Golden Buddhist Temple (Buddha Dhatu Jadi). Late afternoon spent atop Nilachal watching sunset over rolling mountain folds.',
        },
        highlights: {
          bn: ['স্বর্ণমন্দির স্থাপত্য ও আধ্যাত্মিক পরিবেশ', 'নীলাচল ভিউপয়েন্ট সূর্যাস্ত', 'মারমা হস্তশিল্প বাজার'],
          en: ['Buddha Dhatu Jadi Golden Temple', 'Nilachal 360-degree sunset point', 'Marma textile market'],
        },
      },
      {
        day: 2,
        title: {
          bn: 'মেঘচুম্বী নীলগিরি অভিযান ও শৈলপ্রপাত ঝরনা',
          en: 'Ascent to Nilgiri Sky Ridge & Shoilo Propat Waterfall',
        },
        description: {
          bn: 'সকালে রিজার্ভ চান্দের গাড়িতে করে মেঘের দেশ নীলগিরির উদ্দেশ্যে যাত্রা। পথে শৈলপ্রপাত ঝরনা ও চিম্বুক পাহাড়ে বিরতি। নীলগিরির সর্বোচ্চ চূড়ায় দাঁড়িয়ে দিগন্তজোড়া মেঘ আর পাহাড়ের রূপ উপভোগ। সন্ধ্যায় কটেজে ফিরতি যাত্রা।',
          en: 'Embark on a high-altitude expedition along the Chimbuk ridge to Nilgiri hill station. Stand amidst floating clouds at 2,400 feet. On the return path, stop at natural Shoilo Propat cascades and indigenous Bawm villages.',
        },
        highlights: {
          bn: ['২৪০০ ফুট উঁচুতে নীলগিরি ভিউপয়েন্ট', 'চিম্বুক পাহাড়ের আদিবাসী জনপদ', 'শৈলপ্রপাত স্নিগ্ধ ঝরনা'],
          en: ['Nilgiri summit above cloudline', 'Chimbuk tribal cultural stops', 'Shoilo Propat cascade refresh'],
        },
      },
      {
        day: 3,
        title: {
          bn: 'মেঘলা পর্যটন কমপ্লেক্স, ঝুলন্ত সেতু ও বিদায়',
          en: 'Meghla Lake Hanging Bridge, Tribal Feast & Return',
        },
        description: {
          bn: 'সকালে মেঘলা পর্যটন কেন্দ্রে সবুজ হ্রদের ওপর ঝুলন্ত সেতুতে হাঁটা ও ক্যাবল কার রাইড। স্থানীয় পাহাড়ি রেস্তোরাঁয় বিশেষ ব্যাম্বু চিকেন দিয়ে লাঞ্চ। বিকেলে বান্দরবান শহর ঘুরে রাতের বাসে ঢাকার উদ্দেশ্যে যাত্রা।',
          en: 'Morning exploration of Meghla Tourism Complex featuring hanging bridges over emerald lakes. Traditional hill-tribal lunch featuring aromatic bamboo shoot dishes. Evening coach back to Dhaka.',
        },
        highlights: {
          bn: ['মেঘলা ঝুলন্ত সেতু ও কেবল কার', 'ঐতিহ্যবাহী ব্যাম্বু চিকেন লাঞ্চ', 'আরামদায়ক ফিরতি যাত্রা'],
          en: ['Meghla hanging bridge crossing', 'Bamboo chicken gastronomic lunch', 'Comfortable return coach'],
        },
      },
    ],
    included: {
      bn: [
        'ঢাকা – বান্দরবান – ঢাকা রিটার্ন এসি বাস',
        '২ রাত প্রিমিয়াম হিলভিউ রিসোর্টে টুইন শেয়ারিং স্টে',
        '৩ দিনের সকল বেলার খাবার ও স্পেশাল পাহাড়ি ডিশ',
        '৩ দিনের সার্বক্ষণিক রিজার্ভ চান্দের গাড়ি',
        'নীলগিরি, নীলাচল ও স্বর্ণমন্দির সকল এন্ট্রি পারমিট',
        'স্থানীয় রেজিস্টার্ড ট্রাভেল গাইড সহায়তা',
      ],
      en: [
        'Dhaka – Bandarban – Dhaka return AC coach tickets',
        '2 nights lodging in premium valley-view resort',
        'All meals across 3 days including ethnic culinary dishes',
        'Dedicated 4x4 Chander Gari throughout entire tour',
        'All hill tract entry permits, security passes & tolls',
        'Certified local mountain tour leader',
      ],
    },
    excluded: {
      bn: [
        'মেঘলা ক্যাবল কার ও বোট রাইড ফি',
        'ব্যক্তিগত ওষুধ ও শপিং খরচ',
      ],
      en: [
        'Optional cable car and paddle boat fees at Meghla',
        'Personal medications and souvenir shopping',
      ],
    },
    importantNotes: {
      bn: [
        'পাহাড়ি আঁকাবাঁকা পথে মোশন সিকনেস এড়াতে প্রয়োজনীয় ওষুধ সাথে রাখুন।',
        'আদিবাসী সম্প্রদায়ের ছবি তোলার পূর্বে বিনয়ের সাথে অনুমতি নেওয়া শিষ্টাচার।',
      ],
      en: [
        'Winding mountain roads can induce motion sickness; please carry appropriate pills.',
        'Respect indigenous communities: always ask permission before taking personal photographs.',
      ],
    },
  },
  {
    id: 'saint-martins-island-getaway',
    slug: 'saint-martins-island-getaway',
    category: 'island',
    categoryLabel: {
      bn: 'প্রবাল দ্বীপ ও সমুদ্র বিলাস',
      en: 'Coral Island & Marine Serenity',
    },
    destination: {
      bn: 'সেন্টমার্টিন দ্বীপ ও ছেঁড়াদ্বীপ, কক্সবাজার',
      en: 'Saint Martin’s Coral Island & Chhera Dwip',
    },
    title: {
      bn: 'সেন্টমার্টিন প্রবাল দ্বীপের নীল জলরাশি ও ছেঁড়াদ্বীপ ট্রেইল',
      en: 'Saint Martin’s Coral Island & Chhera Dwip Expedition',
    },
    shortDescription: {
      bn: 'বাংলাদেশের একমাত্র প্রবাল দ্বীপে নারকেল বাগানে রিসোর্ট স্টে, নীল সাগরে বারবিকিউ ও কাঁচের মতো স্বচ্ছ জলরাশি।',
      en: 'Eco-resort stay among coconut groves on Bangladesh’s only coral island, crystal turquoise waters & live seafood grills.',
    },
    detailedDescription: {
      bn: 'বঙ্গোপসাগরের বুকে জেগে থাকা বাংলাদেশের একমাত্র প্রবাল দ্বীপ সেন্টমার্টিন বা নারিকেল জিঞ্জিরা। নাফ নদী পাড়ি দিয়ে শিপ ক্রুজে দ্বীপে পৌঁছানো, পশ্চিম সৈকতের নারকেল বাগানের ভেতরে ইকো-রিসোর্টে রাত্রিযাপন, গভীর রাতে সাগরের গর্জনের পাশে কাঁকড়া ও রূপচাঁদা ফ্রাই এবং ভাটার সময় পায়ে হেঁটে অথবা ট্রলারে ছেঁড়াদ্বীপের জীবন্ত প্রবাল দর্শন। এক অনবদ্য দ্বীপ জীবনের গল্প।',
      en: 'Located at the southernmost tip of Bangladesh in the Bay of Bengal, Saint Martin’s Island is a tropical coral paradise. Cruise down the Naf River on sea-going ships, relax in eco-resorts shaded by leaning coconut palms, savor fresh grilled kingfish and crabs under starry night skies, and explore pristine live coral reefs at Chhera Dwip during low tide.',
    },
    duration: {
      days: 3,
      nights: 2,
      text: {
        bn: '৩ দিন / ২ রাত',
        en: '3 Days / 2 Nights',
      },
    },
    priceBDT: 10800,
    coverImage: '/images/coxs_bazar_sunset_1791788910726.jpg',
    galleryImages: [
      '/images/coxs_bazar_sunset_1791788910726.jpg',
      '/images/sundarbans_mangrove_1791788934964.jpg',
    ],
    maxGroupSize: 18,
    featured: true,
    isVerifiedPackage: false,
    accommodation: {
      bn: 'পশ্চিম সৈকত সংলগ্ন নারিকেল কুঞ্জ ইকো-রিসোর্ট (সি-ফেসিং রুম)',
      en: 'West Beach Eco-Resort surrounded by coconut palms with sea-facing porch',
    },
    transport: {
      bn: 'ঢাকা-টেকনাফ এসি বাস এবং টেকনাফ-সেন্টমার্টিন সি-ক্রুজ শিপ',
      en: 'Dhaka-Teknaf return AC Coach & Luxury Sea-going Cruise Ship',
    },
    departurePoint: {
      bn: 'ঢাকা (ফকিরাপুল / সায়দাবাদ কাউন্টার)',
      en: 'Dhaka (Fakirapool / Sayedabad Counter)',
    },
    itinerary: [
      {
        day: 1,
        title: {
          bn: 'নাফ নদী ক্রুজ ও প্রবাল দ্বীপে পদার্পণ',
          en: 'Naf River Marine Cruise & Arrival in Coral Paradise',
        },
        description: {
          bn: 'ভোরে টেকনাফ দমদমিয়া ঘাটে পৌঁছে বিলাসবহুল সি-ট্রাক শিপে আরোহণ। নাফ নদী ও মিয়ানমার সীমান্তের অপরূপ দৃশ্য দেখতে দেখতে সেন্টমার্টিনে আগমন। রিসোর্টে চেক-ইন ও দুপুরে ফ্রেশ রূপচাঁদা মাছ দিয়ে মধ্যাহ্নভোজ। বিকেলে পশ্চিম সৈকতে সূর্যাস্ত।',
          en: 'Arrive at Teknaf Damdamia ghat at dawn and board high-capacity cruise ship. Sail down Naf river witnessing Myanmar hills across the border. Disembark on coral jetty, check into island eco-resort, and enjoy beachside lunch.',
        },
        highlights: {
          bn: ['নাফ নদী ও নীল সমুদ্র শিপ ক্রুজ', 'দ্বীপের ঐতিহ্যবাহী ডাব ও রূপচাঁদা মাছ', 'পশ্চিম সৈকতের জাদুকরী সূর্যাস্ত'],
          en: ['Naf River sea cruise', 'Sweet green coconut & local pomfret', 'West beach magical sunset'],
        },
      },
      {
        day: 2,
        title: {
          bn: 'ছেঁড়াদ্বীপ লাইভ কোরাল ট্রেইল ও বিচ বারবিকিউ',
          en: 'Chhera Dwip Coral Expedition & Starry Beach BBQ',
        },
        description: {
          bn: 'সকালে ভাটায় ইঞ্জিন বোটে বা পায়ে হেঁটে বাংলাদেশের শেষ ভূখণ্ড ছেঁড়াদ্বীপে যাত্রা। জীবন্ত প্রবাল, নীল পানি ও প্রবাল প্রাচীরের সৌন্দর্য উপভোগ। বিকেলে রিসোর্টে রিল্যাক্সেশন ও রাতে সমুদ্রের পাড়ে কোরাল মাছের বারবিকিউ পার্টি।',
          en: 'Morning engine boat excursion to Chhera Dwip, the southernmost coral outcropping of Bangladesh. Marvel at crystal-clear turquoise waters and ancient corals. Evening live coral fish BBQ on the sand with ambient acoustic music.',
        },
        highlights: {
          bn: ['ছেঁড়াদ্বীপের জীবন্ত প্রবাল দর্শন', 'কাঁচের মতো স্বচ্ছ নীল জল', 'সৈকতে লাইভ কোরাল ফিশ বারবিকিউ'],
          en: ['Chhera Dwip living coral reefs', 'Pristine turquoise lagoons', 'Live beach seafood barbecue'],
        },
      },
      {
        day: 3,
        title: {
          bn: 'দ্বীপের মেঠোপথে সাইক্লিং ও বিদায় বেলা',
          en: 'Island Village Bicycle Tour & Return Cruise',
        },
        description: {
          bn: 'সকালে দ্বীপের জেলেপাড়া ও নারকেল বাগানের পথ ধরে সাইক্লিং। দুপুরের খাবার শেষে সেন্টমার্টিন জেটি থেকে টেকনাফের ফিরতি জাহাজে আরোহণ। রাতে এসি বাসে ঢাকার উদ্দেশ্যে যাত্রা।',
          en: 'Early morning leisurely bicycle ride through tranquil fishing hamlets and shell-strewn lanes. Fresh coastal lunch followed by afternoon cruise back to Teknaf mainland and onward night coach to Dhaka.',
        },
        highlights: {
          bn: ['দ্বীপের মেঠোপথে বাইসাইকেল রাইড', 'জেলেদের মাছ ধরার দৃশ্য', 'স্মরণীয় ফিরতি ক্রুজ'],
          en: ['Island village bicycle loop', 'Traditional fishermen netting haul', 'Scenic return sea cruise'],
        },
      },
    ],
    included: {
      bn: [
        'ঢাকা – টেকনাফ – ঢাকা রিটার্ন লাক্সারি এসি বাস টিকিট',
        'টেকনাফ – সেন্টমার্টিন – টেকনাফ রিটার্ন শিপ টিকিট (ওপেন ডেক)',
        'সেন্টমার্টিন দ্বীপে ২ রাত প্রিমিয়াম রিসোর্ট স্টে',
        'প্রতিদিনের ৩ বেলার খাবার ও স্পেশাল কোরাল বারবিকিউ ডিনার',
        'ছেঁড়াদ্বীপ যাওয়ার ট্রলার ও গাইড চার্জ',
        'পরিবেশ অধিদপ্তর ও স্থানীয় ট্রাভেল পারমিট ফি',
      ],
      en: [
        'Dhaka – Teknaf – Dhaka return luxury AC coach',
        'Teknaf – Saint Martin – Teknaf return sea cruise ship tickets',
        '2 nights accommodation in beach eco-resort',
        'All gourmet meals including live coral fish BBQ dinner',
        'Boat expedition to Chhera Dwip with island guide',
        'All environmental passes and island entry fees',
      ],
    },
    excluded: {
      bn: [
        'দ্বীপে সাইকেল বা ভ্যান ভাড়ার ব্যক্তিগত খরচ',
        'ব্যক্তিগত শপিং ও অতিরিক্ত স্ন্যাক্স',
      ],
      en: [
        'Personal bicycle or rickshaw-van rentals on island',
        'Souvenir shell craft shopping and personal extras',
      ],
    },
    importantNotes: {
      bn: [
        'সেন্টমার্টিন একটি স্পর্শকাতর ইকোলজিক্যাল জোন। দ্বীপ থেকে প্রবাল বা ঝিনুক সংগ্রহ করা আইনত দণ্ডনীয়।',
        'সরকারি মৌসুমি নিয়মানুযায়ী জাহাজ চলাচলের সময়সূচী নির্ধারিত হয়।',
      ],
      en: [
        'Saint Martin’s is an ecologically critical area: strictly illegal to collect live coral or seashells.',
        'Ship timings strictly adhere to government maritime safety schedules.',
      ],
    },
  },
];

export const destinationsList: DestinationInfo[] = [
  {
    id: 'sajek-valley',
    name: {
      bn: 'সাজেক ভ্যালি',
      en: 'Sajek Valley',
    },
    region: {
      bn: 'রাঙ্গামাটি পার্বত্য জেলা',
      en: 'Rangamati Hill District',
    },
    image: '/images/hero_sajek_sunrise_1791788897775.jpg',
    packageCount: 1,
    highlights: {
      bn: 'মেঘের রাজ্য, কংলাক পাহাড় ও হ্যালিপ্যাড সূর্যাস্ত',
      en: 'Kingdom of clouds, Konglak peak, helipad sunsets',
    },
  },
  {
    id: 'coxs-bazar',
    name: {
      bn: 'কক্সবাজার ও ইনানী',
      en: 'Cox’s Bazar & Inani',
    },
    region: {
      bn: 'চট্টগ্রাম উপকূলীয় অঞ্চল',
      en: 'Chittagong Coastal Belt',
    },
    image: '/images/coxs_bazar_sunset_1791788910726.jpg',
    packageCount: 2,
    highlights: {
      bn: '১২০ কিমি দীর্ঘ বালুকাময় সৈকত ও মেরিন ড্রাইভ',
      en: '120km unbroken beach & scenic Marine Drive',
    },
  },
  {
    id: 'sreemangal-sylhet',
    name: {
      bn: 'শ্রীমঙ্গল ও সিলেট',
      en: 'Sreemangal & Sylhet',
    },
    region: {
      bn: 'সিলেট বিভাগ',
      en: 'Sylhet Division',
    },
    image: '/images/sylhet_tea_gardens_1791788922427.jpg',
    packageCount: 1,
    highlights: {
      bn: 'সবুজ চা বাগান, লাউয়াছড়া বন ও সাতরঙা চা',
      en: 'Terraced tea gardens, rainforest, 7-layer tea',
    },
  },
  {
    id: 'sundarbans',
    name: {
      bn: 'সুন্দরবন ম্যানগ্রোভ',
      en: 'Sundarbans Mangrove',
    },
    region: {
      bn: 'খুলনা ও বাগেরহাট',
      en: 'Khulna & Bagerhat',
    },
    image: '/images/sundarbans_mangrove_1791788934964.jpg',
    packageCount: 1,
    highlights: {
      bn: 'রয়্যাল বেঙ্গল টাইগার, নদী ক্রুজ ও বন্যপ্রাণী অভয়ারণ্য',
      en: 'Royal Bengal tiger trails, cruise, deer sanctuaries',
    },
  },
  {
    id: 'bandarban',
    name: {
      bn: 'বান্দরবান',
      en: 'Bandarban',
    },
    region: {
      bn: 'পার্বত্য চট্টগ্রাম',
      en: 'Chittagong Hill Tracts',
    },
    image: '/images/bandarban_hills_1791788946228.jpg',
    packageCount: 1,
    highlights: {
      bn: 'নীলগিরি, নীলাচল ও সর্বোচ্চ পাহাড়ি শৃঙ্গ',
      en: 'Nilgiri sky ridge, Nilachal, waterfalls & culture',
    },
  },
];

export const sampleTestimonials = [
  {
    id: '1',
    name: {
      bn: 'সাব্বির আহমেদ ও ফারহানা',
      en: 'Sabbir Ahmed & Farhana',
    },
    location: {
      bn: 'ঢাকা (উত্তরা)',
      en: 'Uttara, Dhaka',
    },
    trip: {
      bn: 'সাজেক ভ্যালি মেঘের রাজ্য অভিযান',
      en: 'Sajek Valley Kingdom of Clouds',
    },
    quote: {
      bn: 'পরিবার নিয়ে প্রথমবার সাজেক গিয়েছিলাম। চান্দের গাড়ির ড্রাইভ থেকে শুরু করে কটেজের ব্যালকনি ভিউ—সবকিছু ছিল অসাধারণ গোছানো। বিশেষ করে স্থানীয় গাইড আমাদের যেভাবে যত্ন নিয়েছেন তা মনে রাখার মতো।',
      en: 'Our family’s first trip to Sajek was effortless. From the reserved Chander Gari convoy to the cloud-view wooden cottage, the logistics were remarkably smooth. Highly recommend their local guides.',
    },
    rating: 5,
  },
  {
    id: '2',
    name: {
      bn: 'ড. নাফিস করিম',
      en: 'Dr. Nafis Karim',
    },
    location: {
      bn: 'চট্টগ্রাম',
      en: 'Chattogram',
    },
    trip: {
      bn: 'সুন্দরবন বিলাসবহুল শিপ ক্রুজ',
      en: 'Sundarbans Royal Bengal Trail',
    },
    quote: {
      bn: 'সুন্দরবনের ৩ দিনের ক্রুজে খাবারের মান ও নিরাপত্তা ছিল অভাবনীয়। জাহাজের মাস্টার শেফের সামুদ্রিক মাছের রান্না এবং বনের ছোট খালে নিঃশব্দ বোটিং ছিল এক অনবদ্য অভিজ্ঞতা।',
      en: 'The 3-day Sundarbans cruise exceeded all expectations. Security with armed rangers was reassuring, and silent dawn creek rowing was an unforgettable nature experience.',
    },
    rating: 5,
  },
  {
    id: '3',
    name: {
      bn: 'তানজিলা হক ও বন্ধুরা',
      en: 'Tanzila Haque & Group',
    },
    location: {
      bn: 'সিলেট',
      en: 'Sylhet',
    },
    trip: {
      bn: 'কক্সবাজার ও ইনানী মেরিন ড্রাইভ',
      en: 'Cox’s Bazar Coastal Retreat',
    },
    quote: {
      bn: 'ইনানীর প্রবাল সৈকতে ওপেন হুড জিপে ভ্রমণ আর সূর্যাস্ত দেখার মুহূর্তটি আজীবন মনে থাকবে। কোনো গোপন ফি ছিল না, যা প্রতিশ্রুতি দিয়েছিল ঠিক সেটাই পেয়েছি।',
      en: 'Cruising Marine Drive in an open-hood jeep to Inani at golden hour was pure magic. Zero hidden costs and total transparency. Will definitely book again.',
    },
    rating: 5,
  },
];
