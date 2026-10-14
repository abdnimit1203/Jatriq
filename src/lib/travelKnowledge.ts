/**
 * Intelligent Bangladesh Travel Knowledge Engine
 * Self-contained knowledge base for Bangladesh tourism and Jatriq Tour Operator.
 * Provides instant, zero-latency answers for all active tour packages and logistics,
 * used both on the server and as a browser-side resilient fallback.
 */
export function generateLocalKnowledgeReply(
  userText: string,
  lang: 'bn' | 'en' = 'bn',
  tourContext?: any
): string {
  const query = userText.toLowerCase();

  const tourName = tourContext
    ? lang === 'bn'
      ? tourContext.title?.bn || tourContext.title?.en
      : tourContext.title?.en || tourContext.title?.bn
    : '';

  // 1. Destination NOT in our package catalog (e.g. Kuakata, Tanguar Haor, Kaptai)
  const isKuakata = query.includes('kuakata') || query.includes('কুয়াকাটা') || query.includes('কুয়াকাটা');
  const isTanguar = query.includes('tanguar') || query.includes('টাঙ্গুয়ার') || query.includes('টাঙ্গুয়ার');
  const isKaptai = query.includes('kaptai') || query.includes('কাপ্তাই');

  if (isKuakata || isTanguar || isKaptai) {
    const destName = isKuakata ? 'কুয়াকাটা (Kuakata)' : isTanguar ? 'টাঙ্গুয়ার হাওর (Tanguar Haor)' : 'কাপ্তাই (Kaptai Lake)';
    if (lang === 'bn') {
      return `**প্যাকেজ সংক্রান্ত তথ্য:**
দুঃখিত, বর্তমানে আমাদের **${destName}** গন্তব্যের জন্য কোনো নির্ধারিত নিয়মিত গ্রুপ প্যাকেজ চালু নেই।

💡 **তবে আপনার জন্য বিকল্প সুবিধা:**
• আপনার পরিবার বা ফ্রেন্ডস গ্রুপের জন্য আমরা **স্পেশাল কাস্টম প্রাইভেট ট্যুর** আয়োজন করে দিতে পারব। সরাসরি আমাদের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন: **+880 1812-345678**।
• এছাড়া আমাদের বর্তমানে চালু থাকা শীর্ষ প্যাকেজগুলো দেখতে পারেন:
  - 🌊 **কক্সবাজার সমুদ্র সৈকত** (৩ দিন / ২ রাত — ৳৯,৫০০)
  - ☁️ **সাজেক ভ্যালি মেঘের রাজ্য** (৩ দিন / ২ রাত — ৳৮,৫০০)
  - 🏝️ **সেন্ট মার্টিন'স দ্বীপ** (৩ দিন / ২ রাত — ৳৯,২০০)
  - 🌿 **সিলেট ও শ্রীমঙ্গল চা বাগান** (৩ দিন / ২ রাত — ৳৭,২০০)
  - 🐅 **সুন্দরবন ম্যানগ্রোভ সাফারি** (৩ দিন / ২ রাত — ৳১৩,৫০০)
  - ⛰️ **বান্দরবান নীলগিরি ট্র্যাকিং** (৩ দিন / ২ রাত — ৳৮,২০০)`;
    } else {
      return `**Package Availability Notice:**
Currently, we do not have a scheduled regular group package for **${destName}**.

💡 **Available Options for You:**
• We can organize a **Custom Private Tour** tailored specifically for your family or friends. Contact our tour planner directly on WhatsApp: **+880 1812-345678**.
• Alternatively, explore our top active tour packages:
  - 🌊 **Cox's Bazar Beach** (3 Days / 2 Nights — ৳9,500)
  - ☁️ **Sajek Valley Cloud Kingdom** (3 Days / 2 Nights — ৳8,500)
  - 🏝️ **Saint Martin's Island** (3 Days / 2 Nights — ৳9,200)
  - 🌿 **Sylhet & Sreemangal Tea Estates** (3 Days / 2 Nights — ৳7,200)
  - 🐅 **Sundarbans Mangrove Safari** (3 Days / 2 Nights — ৳13,500)
  - ⛰️ **Bandarban Nilgiri Treks** (3 Days / 2 Nights — ৳8,200)`;
    }
  }

  // 2. Inquiring if package exists for existing destinations (Banglish / Bangla)
  const isAskingSajek = query.includes('sajek') || query.includes('সাজেক') || query.includes('sajak');
  const isAskingCox = query.includes('cox') || query.includes('bazar') || query.includes('কক্সবাজার') || query.includes('kox') || query.includes('coxbazar');
  const isAskingSylhet = query.includes('sylhet') || query.includes('sreemangal') || query.includes('সিলেট') || query.includes('শ্রীমঙ্গল') || query.includes('srimangal') || query.includes('ratargul');
  const isAskingSundarban = query.includes('sundarban') || query.includes('shundorbon') || query.includes('সুন্দরবন') || query.includes('sundorban');
  const isAskingBandarban = query.includes('bandarban') || query.includes('বান্দরবান') || query.includes('nilgiri') || query.includes('নীলগিরি');
  const isAskingSaintMartin =
    query.includes('saint martin') ||
    query.includes('saintmartin') ||
    query.includes('st martin') ||
    query.includes('সেন্টমার্টিন') ||
    query.includes('সেন্ট মার্টিন') ||
    query.includes('chhera dwip') ||
    query.includes('ছেঁড়াদ্বীপ');

  if (isAskingSajek) {
    if (lang === 'bn') {
      return `**হ্যাঁ, আমাদের সাজেক ভ্যালির সিগনেচার প্যাকেজ চালু রয়েছে!**
• **প্যাকেজ:** সাজেক ভ্যালি মেঘের রাজ্য অভিযান (৩ দিন / ২ রাত)
• **মূল্য:** ৳৮,৫০০ প্রতি জন
• **অন্তর্ভুক্ত:** ঢাকা-খাগড়াছড়ি রিটার্ন এসি বাস, কাঠের ইকো-কটেজ (মেঘের ভিউ), ৩ বেলার খাবার, স্পেশাল ব্যাম্বু চিকেন ও বার-বি-কিউ ডিনার, ৪x৪ রিজার্ভ চান্দের গাড়ি, ও গাইড।
• **বুকিং:** ওয়েবসাইট থেকে সরাসরি 'Book Now' করুন অথবা হোয়াটসঅ্যাপে জানান: **+880 1812-345678**।`;
    } else {
      return `**Yes, our Sajek Valley Signature Package is active!**
• **Package:** Sajek Valley Kingdom of Clouds (3 Days / 2 Nights)
• **Price:** ৳8,500 per person
• **Includes:** Return AC coach from Dhaka, private cloud-view wooden cottage, all meals, special Bamboo Chicken & BBQ dinner, reserved 4x4 Chander Gari, and licensed guide.
• **Book Now:** Click 'Book Now' on the tour page or message on WhatsApp: **+880 1812-345678**.`;
    }
  }

  if (isAskingCox) {
    if (lang === 'bn') {
      return `**হ্যাঁ, আমাদের কক্সবাজারের প্রিমিয়াম প্যাকেজ চালু রয়েছে!**
• **প্যাকেজ ১:** কক্সবাজার সৈকত ও মেরিন ড্রাইভ ট্যুর (৩ দিন / ২ রাত — ৳৯,৫০০)
• **প্যাকেজ ২:** সেন্ট্রাল কক্সবাজার লাক্সারি বিচ রিট্রিট (৪ দিন / ৩ রাত — ৳১০,৮০০)
• **অন্তর্ভুক্ত:** এসি হুন্দাই বাস, সমুদ্রমুখী ৩-তারকা হোটেল স্টে, সকালের কমপ্লিমেন্টারি বুফে, ইনানী বিচ ও হিমছড়ি চান্দের গাড়ি সাফারী।
• **বুকিং:** সরাসরি 'Book Now' পেজ থেকে অথবা হোয়াটসঅ্যাপ করুন: **+880 1812-345678**।`;
    } else {
      return `**Yes, our Cox's Bazar Tour Packages are active!**
• **Package 1:** Cox's Bazar Beach & Marine Drive (3 Days / 2 Nights — ৳9,500)
• **Package 2:** Luxury Beachfront Retreat (4 Days / 3 Nights — ৳10,800)
• **Includes:** AC Highway coach, sea-facing hotel stay, daily buffet breakfast, Inani Beach & Himchhari excursion.
• **Book Now:** Click 'Book Now' or message WhatsApp: **+880 1812-345678**.`;
    }
  }

  if (isAskingSylhet) {
    if (lang === 'bn') {
      return `**হ্যাঁ, আমাদের সিলেট ও শ্রীমঙ্গল প্যাকেজ চালু রয়েছে!**
• **প্যাকেজ:** সিলেট সবুজ চা বাগান ও রাতারগুল সোয়াম্প ফরেস্ট (৩ দিন / ২ রাত)
• **মূল্য:** ৳৭,২০০ প্রতি জন
• **অন্তর্ভুক্ত:** এসি ট্রান্সপোর্ট, শ্রীমঙ্গল গ্রিন রিসোর্ট, রাতারগুল ডিঙ্গি নৌকা ভ্রমণ, বিছনাকান্দি ও জাফলং জিরো পয়েন্ট সফর।
• **যোগাযোগ:** হোয়াটসঅ্যাপে সরাসরি বুকিং দিন: **+880 1812-345678**।`;
    } else {
      return `**Yes, our Sylhet & Sreemangal Tour is active!**
• **Package:** Sylhet Green Tea Estates & Ratargul Swamp (3 Days / 2 Nights)
• **Price:** ৳7,200 per person
• **Includes:** AC coach, tea valley resort stay, traditional boat safari in Ratargul, Bisnakhandi & Jaflong border tours.
• **Contact:** WhatsApp helpline: **+880 1812-345678**.`;
    }
  }

  if (isAskingSundarban) {
    if (lang === 'bn') {
      return `**হ্যাঁ, আমাদের সুন্দরবন ম্যানগ্রোভ সাফারি চালু রয়েছে!**
• **প্যাকেজ:** সুন্দরবন ওয়াইল্ডলাইফ ক্রুজ ও ম্যানগ্রোভ সাফারি (৩ দিন / ২ রাত)
• **মূল্য:** ৳১৩,৫০০ প্রতি জন
• **অন্তর্ভুক্ত:** বিলাসবহুল এসি ট্যুরিস্ট জাহাজ, সব বেলার বুফে খাবার ও ফ্রেশ সামুদ্রিক মাছের বার-বি-কিউ, বন বিভাগ সশস্ত্র গার্ড পারমিট, কটকা ওয়াচ টাওয়ার ও জামতলী সমুদ্র সৈকত।
• **যোগাযোগ:** হোয়াটসঅ্যাপে যোগাযোগ করুন: **+880 1812-345678**।`;
    } else {
      return `**Yes, our Sundarbans Mangrove Safari is active!**
• **Package:** Sundarbans Wildlife Cruise & Mangrove Safari (3 Days / 2 Nights)
• **Price:** ৳13,500 per person
• **Includes:** Luxury tourist cruise ship, full board buffet meals with seafood BBQ, armed forest guard escorts, Kotka watchtower & Jamtoli beach trek.
• **WhatsApp:** **+880 1812-345678**.`;
    }
  }

  if (isAskingBandarban) {
    if (lang === 'bn') {
      return `**হ্যাঁ, আমাদের বান্দরবান ট্র্যাকিং প্যাকেজ চালু রয়েছে!**
• **প্যাকেজ:** বান্দরবান পাহাড়ি মেঘ ও নীলগিরি অভিযান (৩ দিন / ২ রাত)
• **মূল্য:** ৳৮,২০০ প্রতি জন
• **অন্তর্ভুক্ত:** রিজার্ভ চান্দের গাড়ি, নীলগিরি, নীলাচল, শৈলপ্রপাত ও স্বর্ণমন্দির দর্শন, পাহাড়ি রিসোর্টে থাকা ও ঐতিহ্যবাহী খাবার।
• **বুকিং:** হোয়াটসঅ্যাপ করুন: **+880 1812-345678**।`;
    } else {
      return `**Yes, our Bandarban Hill Trek Package is active!**
• **Package:** Bandarban Mountain Mist & Nilgiri Expedition (3 Days / 2 Nights)
• **Price:** ৳8,200 per person
• **Includes:** Reserved 4x4 Chander Gari, entry to Nilgiri, Nilachal, Shailaprapad, Golden Temple, scenic hilltop cottage, and local meals.
• **WhatsApp:** **+880 1812-345678**.`;
    }
  }

  if (isAskingSaintMartin) {
    if (lang === 'bn') {
      return `**হ্যাঁ, আমাদের সেন্ট মার্টিন'স দ্বীপ স্পেশাল প্যাকেজ চালু রয়েছে!**
• **প্যাকেজ:** সেন্ট মার্টিন'স কোরাল দ্বীপ ও ব্লু ওয়াটার অবকাশ (৩ দিন / ২ রাত)
• **মূল্য:** ৳৯,২০০ প্রতি জন
• **অন্তর্ভুক্ত:** ঢাকা-টেকনাফ রিটার্ন হাইওয়ে বাস, বিলাসবহুল শিপ টিকিট, বিচ ভিউ রিসোর্টে রাত্রিযাপন, সব বেলার খাবার ও বার-বি-কিউ, ছেঁড়াদ্বীপ ভ্রমণ ও সার্বক্ষণিক গাইড।
• **বুকিং:** ওয়েবসাইট থেকে সরাসরি 'Book Now' করুন অথবা হোয়াটসঅ্যাপে জানান: **+880 1812-345678**।`;
    } else {
      return `**Yes, our Saint Martin's Island Tour Package is active!**
• **Package:** Saint Martin's Island Coral Island & Blue Water Getaway (3 Days / 2 Nights)
• **Price:** ৳9,200 per person
• **Includes:** Return highway coach, sea cruise ship tickets, beachfront resort stay, all meals with fresh seafood BBQ, Chhera Dwip excursion, and licensed guide.
• **Book Now:** Click 'Book Now' on the tour page or message on WhatsApp: **+880 1812-345678**.`;
    }
  }

  // 3. Sajek convoy & timings
  if (query.includes('convoy') || query.includes('কনভয়') || query.includes('সময়') || query.includes('somoy') || query.includes('timing')) {
    if (lang === 'bn') {
      return `**সাজেক ভ্যালি আর্মি কনভয় ও যাতায়াত তথ্য:**
• **যাওয়ার কনভয় (দীঘিনালা থেকে সাজেক):**
  - সকালের কনভয়: সকাল ১০:৩০ টা
  - বিকেলের কনভয়: দুপুর ০২:৩০ টা
• **ফেরার কনভয় (সাজেক থেকে দীঘিনালা):**
  - সকালের কনভয়: সকাল ১০:০০ টা
  - বিকেলের কনভয়: দুপুর ০২:০০ টা

💡 **জরুরি টিপস:**
• অবশ্যই নির্দিষ্ট সময়ের অন্তত ৩০ মিনিট আগে পৌঁছে চান্দের গাড়ি রেজিস্টার করতে হবে।
• আসল জাতীয় পরিচয়পত্র (NID) অথবা জন্মনিবন্ধন কার্ড সাথে রাখুন।
• রাতে পাহাড়ে ঠান্ডা থাকে, হালকা শাল বা জ্যাকেট সাথে রাখা ভালো।
• মোবাইল নেটওয়ার্ক ও সোলার চার্জিংয়ের জন্য পাওয়ার ব্যাংক সাথে রাখুন।`;
    } else {
      return `**Sajek Valley Army Convoy & Timing Schedule:**
• **Going to Sajek (Dighinala ➔ Sajek):**
  - Morning Convoy: 10:30 AM
  - Afternoon Convoy: 02:30 PM
• **Returning from Sajek (Sajek ➔ Dighinala):**
  - Morning Convoy: 10:00 AM
  - Afternoon Convoy: 02:00 PM

💡 **Important Traveler Tips:**
• Arrive at the checkpoint at least 30 minutes before convoy departure.
• Original National ID (NID) or Passport/Birth Certificate is mandatory for checkpoints.
• Nights and early mornings in Sajek can be chilly—bring a light jacket or shawl.
• Solar power is common in cottages; carrying a fully charged power bank is recommended.`;
    }
  }

  // 4. Packing & essentials
  if (query.includes('pack') || query.includes('নেওয়া') || query.includes('newa') || query.includes('jinis') || query.includes('cloth') || query.includes('bag') || query.includes('essential')) {
    if (lang === 'bn') {
      return `**বাংলাদেশ পাহাড়ি ও সৈকত ভ্রমণের জন্য প্রয়োজনীয় প্যাকিং তালিকা:**
• **জরুরি কাগজপত্র:** আসল NID বা পাসপোর্টের ফটোকপি (চেকপয়েন্টে প্রয়োজন)।
• **পোশাক:** আরামদায়ক সুতি পোশাক, পাহাড়ি সকালে/রাতে হালকা গরম শাল বা জ্যাকেট।
• **জুতো:** পাহাড়ে হাঁটার জন্য ভালো গ্রিপযুক্ত স্নিকার্স বা ট্র্যাকিং স্যান্ডেল।
• **গেজেট:** হাই-ক্যাপাসিটি পাওয়ার ব্যাংক ও চার্জিং ক্যাবল (সাজেকে সোলার বিদ্যুৎ থাকে)।
• **ফার্স্ট এইড:** মোশন সিকনেস (বমির ওষুধ), ওআরএস স্যালাইন, প্যারাসিটামল ও ব্যক্তিগত ওষুধ।
• **অন্যান্য:** সানগ্লাস, সানস্ক্রিন এবং বৃষ্টির দিনে ফোল্ডিং ছাতা।`;
    } else {
      return `**Recommended Packing Checklist for Bangladesh Tours:**
• **Documents:** Original NID or Passport copy (mandatory at security checkpoints).
• **Clothing:** Breathable casual wear, lightweight windbreaker/fleece for chilly hill evenings.
• **Footwear:** Comfortable walking shoes or trekking sandals with anti-slip grip.
• **Power:** High-capacity power bank (resorts in Sajek run on solar/generator at set hours).
• **Medical Kit:** Motion sickness pills (for winding hill roads), ORS saline, pain relief, insect repellent.
• **Sun & Rain:** Sunscreen, UV sunglasses, and a compact umbrella.`;
    }
  }

  // 5. Contextual Tour inquiry
  if (tourContext) {
    if (lang === 'bn') {
      return `**"${tourName}" প্যাকেজ সম্পর্কে বিশেষ তথ্য:**
• এই প্যাকেজে রয়েছে আরামদায়ক যাতায়াত, নির্বাচিত রিসোর্ট ও স্থানীয় দর্শনীয় স্থান পরিদর্শন।
• গ্রুপ সাইজ সীমিত হওয়ায় পরিবার ও বন্ধুদের জন্য নিরাপদ এবং উপভোগ্য।
• বিস্তারিত বুকিংয়ের জন্য প্যাকেজ পাতার 'Book Now' বাটনে ক্লিক করতে পারেন অথবা সরাসরি আমাদের হোয়াটসঅ্যাপে নক দিন: **+880 1812-345678**।`;
    } else {
      return `**About "${tourName}":**
• This curated package includes comfortable transfers, handpicked scenic cottages, and local sightseeing excursions.
• Our small group policy ensures attentive service, safety for female travelers, and family-friendly pacing.
• To reserve seats, click "Book Now" on the tour page or message us directly on WhatsApp at **+880 1812-345678**.`;
    }
  }

  // Default warm concierge response
  if (lang === 'bn') {
    return `যাত্রিক ট্রাভেল সার্ভিসে আপনাকে স্বাগতম! 
আমরা বর্তমানে **সাজেক ভ্যালি**, **কক্সবাজার**, **বান্দরবান**, **সিলেট ও শ্রীমঙ্গল**, **সেন্ট মার্টিন** এবং **সুন্দরবন**-এর নিয়মিত প্রিমিয়াম প্যাকেজ পরিচালনা করি।
• কোনো নির্দিষ্ট প্যাকেজের মূল্য, কনভয় সময়সূচি, বা বুকিং সম্পর্কে জানতে চান? আমাকে যেকোনো প্রশ্ন করতে পারেন (বাংলা বা Banglish-এ)।
• সরাসরি সহায়তার জন্য হোয়াটসঅ্যাপ করুন: **+880 1812-345678**।`;
  } else {
    return `Welcome to Jatriq Tour Operator!
We specialize in curated tours across **Sajek Valley**, **Cox's Bazar**, **Bandarban**, **Sylhet & Sreemangal**, **Saint Martin's Island**, and **Sundarbans**.
• You can ask me about convoy schedules, packing advice, custom itineraries, or family discounts.
• For immediate booking assistance, call or WhatsApp our helpline at **+880 1812-345678**.`;
  }
}
