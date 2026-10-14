import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Persistent AI Config file path
const CONFIG_FILE_PATH = path.resolve(__dirname, 'ai-config.json');

interface StoredAIConfig {
  apiKey?: string;
  provider?: 'gemini' | 'groq' | 'openai' | 'auto';
  model?: string;
  updatedAt?: string;
}

// In-memory cache of saved config
let activeConfig: StoredAIConfig = {
  provider: 'auto',
};

// Load saved config on startup
try {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    const raw = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    activeConfig = JSON.parse(raw);
    console.log('Loaded persistent AI config for provider:', activeConfig.provider || 'gemini');
  }
} catch (e) {
  console.warn('Could not read existing ai-config.json, starting fresh');
}

/**
 * Determine the AI provider from key format or explicit choice
 */
function resolveProvider(key: string, explicitProvider?: string): 'gemini' | 'groq' | 'openai' {
  if (explicitProvider && explicitProvider !== 'auto') {
    return explicitProvider as 'gemini' | 'groq' | 'openai';
  }
  const cleanKey = key.trim();
  if (cleanKey.startsWith('gsk_')) return 'groq';
  if (cleanKey.startsWith('sk-')) return 'openai';
  return 'gemini';
}

/**
 * Get active API key preferring:
 * 1. Request header 'x-custom-api-key'
 * 2. Saved persistent config in ai-config.json
 * 3. Environment variables (GEMINI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY)
 */
function getEffectiveAIConfig(customKeyHeader?: string) {
  const headerKey = (customKeyHeader || '').trim();
  const fileKey = (activeConfig.apiKey || '').trim();
  const envGemini = (process.env.GEMINI_API_KEY || '').trim();
  const envGroq = (process.env.GROQ_API_KEY || '').trim();
  const envOpenAI = (process.env.OPENAI_API_KEY || '').trim();

  let apiKey = '';
  let provider = activeConfig.provider || 'auto';
  let model = activeConfig.model || '';

  if (headerKey) {
    apiKey = headerKey;
  } else if (fileKey) {
    apiKey = fileKey;
  } else if (envGemini) {
    apiKey = envGemini;
    provider = 'gemini';
  } else if (envGroq) {
    apiKey = envGroq;
    provider = 'groq';
  } else if (envOpenAI) {
    apiKey = envOpenAI;
    provider = 'openai';
  }

  const determinedProvider = resolveProvider(apiKey, provider);

  // Default optimal models
  if (!model) {
    if (determinedProvider === 'groq') model = 'llama-3.3-70b-versatile';
    else if (determinedProvider === 'openai') model = 'gpt-4o-mini';
    else model = 'gemini-3.8-flash';
  }

  return { apiKey, provider: determinedProvider, model };
}

// System prompt for travel concierge
const AI_CONCIERGE_SYSTEM_PROMPT = `
You are "Jatriq AI Travel Concierge" (যাত্রিক ভ্রমণ সহকারী), a warm, expert travel consultant for Bangladesh tourism and Jatriq Tour Operator.

Core Capabilities & Language Handling:
1. Banglish Understanding (CRITICAL):
   - You effortlessly understand Banglish (Bengali written with English characters, e.g., "sajek er package price koto?", "kuakata jabo package ache ki?", "amra 4 jon family niye jabo", "bandarban e kon kon jayga dekhbo?").
   - Answer in clear, polite Bengali (বাংলা) or English according to user convenience.

2. Destination & Package Existence Policy (CRITICAL):
   - Jatriq Tour Operator currently HAS active scheduled tour packages for ONLY these 5 destinations:
     1. Sajek Valley (সাজেক ভ্যালি) — 3 Days / 2 Nights (~৳8,500)
     2. Cox's Bazar Beach (কক্সবাজার) — 3 Days / 2 Nights (~৳9,500) and Luxury Beach Retreat 4 Days / 3 Nights (~৳10,800)
     3. Sylhet & Sreemangal (সিলেট ও শ্রীমঙ্গল) — 3 Days / 2 Nights (~৳7,200)
     4. Sundarbans Mangrove Safari (সুন্দরবন) — 3 Days / 2 Nights (~৳13,500)
     5. Bandarban Hill Treks (বান্দরবান) — 3 Days / 2 Nights (~৳8,200)
   - IF user asks about ANY destination NOT in this list (e.g. Kuakata, Saint Martin, Tanguar Haor, Kaptai Lake, Rangamati town, Chittagong, Rajshahi, etc.):
     - You MUST explicitly state that Jatriq does NOT currently have a regular scheduled group package for that destination.
     - State that we CAN arrange a customized private tour for their family or group upon request.
     - Direct them to message our WhatsApp (+880 1812-345678) for custom itineraries.
     - Recommend our closest available packages (e.g., if asking for beach/Kuakata, recommend Cox's Bazar; if asking for hills/Rangamati, recommend Sajek Valley or Bandarban).
   - IF user asks about an EXISTING destination (Sajek, Cox's Bazar, Sylhet, Sundarbans, Bandarban):
     - Enthusiastically confirm that we have dedicated packages available, mention highlights and price, and guide them to the Book Now page or WhatsApp.

3. Logistics & Practical Guidance:
   - Sajek convoy timings (Dighinala to Sajek: 10:30 AM & 02:30 PM; Sajek to Dighinala: 10:00 AM & 02:00 PM).
   - National ID card / birth certificate requirement for army checkpoints.
   - 4x4 Chander Gari, solar power, packing power banks, modest clothing.
`;

/**
 * Intelligent Bangladesh Travel Knowledge Engine (Fallback when external APIs are rate limited or offline)
 */
function generateLocalKnowledgeReply(userText: string, lang: 'bn' | 'en', tourContext?: any): string {
  const query = userText.toLowerCase();

  // If tourContext is provided, customize
  const tourName = tourContext ? (lang === 'bn' ? tourContext.title?.bn || tourContext.title?.en : tourContext.title?.en || tourContext.title?.bn) : '';

  // 1. Destination NOT in our package catalog (e.g. Kuakata, Saint Martin, Tanguar Haor, Kaptai)
  const isKuakata = query.includes('kuakata') || query.includes('কুয়াকাটা') || query.includes('কুয়াকাটা');
  const isSaintMartin = query.includes('saint martin') || query.includes('saintmartin') || query.includes('st martin') || query.includes('সেন্টমার্টিন') || query.includes('সেন্ট মার্টিন');
  const isTanguar = query.includes('tanguar') || query.includes('টাঙ্গুয়ার') || query.includes('টাঙ্গুয়ার');
  const isKaptai = query.includes('kaptai') || query.includes('কাপ্তাই');

  if (isKuakata || isSaintMartin || isTanguar || isKaptai) {
    const destName = isKuakata ? 'কুয়াকাটা (Kuakata)' : isSaintMartin ? "সেন্ট মার্টিন'স দ্বীপ (Saint Martin's Island)" : isTanguar ? 'টাঙ্গুয়ার হাওর (Tanguar Haor)' : 'কাপ্তাই (Kaptai Lake)';
    if (lang === 'bn') {
      return `**প্যাকেজ সংক্রান্ত তথ্য:**
দুঃখিত, বর্তমানে আমাদের **${destName}** গন্তব্যের জন্য কোনো নির্ধারিত নিয়মিত গ্রুপ প্যাকেজ চালু নেই।

💡 **তবে আপনার জন্য বিকল্প সুবিধা:**
• আপনার পরিবার বা ফ্রেন্ডস গ্রুপের জন্য আমরা **স্পেশাল কাস্টম প্রাইভেট ট্যুর** আয়োজন করে দিতে পারব। সরাসরি আমাদের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন: **+880 1812-345678**।
• এছাড়া আমাদের বর্তমানে চালু থাকা শীর্ষ প্যাকেজগুলো দেখতে পারেন:
  - 🌊 **কক্সবাজার সমুদ্র সৈকত** (৩ দিন / ২ রাত — ৳৯,৫০০)
  - ☁️ **সাজেক ভ্যালি মেঘের রাজ্য** (৩ দিন / ২ রাত — ৳৮,৫০০)
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
  const isAskingPackage = query.includes('package') || query.includes('প্যাকেজ') || query.includes('price') || query.includes('dam') || query.includes('koto') || query.includes('ache') || query.includes('ase') || query.includes('cost') || query.includes('taka') || query.includes('টাকা') || query.includes('খরচ') || query.includes('khoroch') || query.includes('jaoyar') || query.includes('jabo');
  const isAskingFamily = query.includes('family') || query.includes('পরিবার') || query.includes('kids') || query.includes('bachha') || query.includes('parents');
  const isGeneralHelp = query.includes('help') || query.includes('সাহায্য') || query.includes('ki ki') || query.includes('ki ache') || query.includes('list');

  if (isAskingPackage && isAskingSajek) {
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

  if (isAskingPackage && isAskingCox) {
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

  if (isAskingPackage && isAskingSylhet) {
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

  if (isAskingPackage && isAskingSundarban) {
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

  if (isAskingPackage && isAskingBandarban) {
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

  // 3. Sajek convoy & timings
  if (query.includes('convoy') || query.includes('কনভয়') || query.includes('সাজেক') || query.includes('sajek') || query.includes('সময়') || query.includes('somoy') || query.includes('timing')) {
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

  // 5. Meals, amenities & inclusions
  if (query.includes('খাবার') || query.includes('khabar') || query.includes('meal') || query.includes('food') || query.includes('include') || query.includes('hotel') || query.includes('resort')) {
    if (lang === 'bn') {
      return `**যাত্রিক ট্রাভেল প্যাকেজের অন্তর্ভুক্ত সুবিধাসমূহ:**
• **যাতায়াত:** ঢাকা থেকে এসি/নন-এসি বাস ও পাহাড়ি রুটে সংরক্ষিত ৪x৪ চান্দের গাড়ি।
• **আবাসন:** পাহাড়ে প্রিমিয়াম ইকো-কটেজ (মেঘের ভিউ) এবং সৈকতে তারকা মানের রিসোর্ট।
• **খাবার:** সকালের নাস্তা, দুপুর ও রাতের দেশীয় সুস্বাদু খাবার (সাজেকে ১ রাত ব্যাম্বো চিকেন ও বার-বি-কিউ ডিনার অন্তর্ভুক্ত)।
• **গাইড:** স্থানীয় অভিজ্ঞ পাহাড়ি গাইড ও ২৪/৭ ট্রাভেল সাপোর্ট।
• **অতিরিক্ত খরচ নেই:** এন্ট্রি ফি ও চান্দের গাড়ির তেল খরচ প্যাকেজেই অন্তর্ভুক্ত থাকে।`;
    } else {
      return `**What is Included in Jatriq Tour Packages:**
• **Transit:** Reserved coach from Dhaka + reserved 4x4 Chander Gari for mountain passes.
• **Stay:** Premium view-facing eco-cottages in hill tracts and top-tier beach resorts in coastal areas.
• **Meals:** Full-board dining (breakfast, lunch, traditional dinner with special Tribal Bamboo Chicken / BBQ evening).
• **Local Guide:** Friendly local certified guide plus 24/7 dedicated trip coordinator.
• **Sightseeing & Tolls:** All scenic entry tickets, forest passes, and vehicle tolls included.`;
    }
  }

  // 6. Contextual Tour inquiry
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
আমরা বর্তমানে **সাজেক ভ্যালি**, **কক্সবাজার**, **বান্দরবান**, **সিলেট ও শ্রীমঙ্গল** এবং **সুন্দরবন**-এর নিয়মিত প্রিমিয়াম প্যাকেজ পরিচালনা করি।
• কোনো নির্দিষ্ট প্যাকেজের মূল্য, কনভয় সময়সূচি, বা বুকিং সম্পর্কে জানতে চান? আমাকে যেকোনো প্রশ্ন করতে পারেন (বাংলা বা Banglish-এ)।
• সরাসরি সহায়তার জন্য হোয়াটসঅ্যাপ করুন: **+880 1812-345678**।`;
  } else {
    return `Welcome to Jatriq Tour Operator!
We specialize in curated tours across **Sajek Valley**, **Cox's Bazar**, **Bandarban**, **Sylhet & Sreemangal**, and **Sundarbans**.
• You can ask me about convoy schedules, packing advice, custom itineraries, or family discounts.
• For immediate booking assistance, call or WhatsApp our helpline at **+880 1812-345678**.`;
  }
}

/**
 * Call Groq / OpenAI compatible API
 */
async function callOpenAICompatible(
  apiKey: string,
  endpoint: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || '';
}

/**
 * Call Gemini API using @google/genai SDK
 */
async function callGemini(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Try configured model, fallback to gemini-2.5-flash
  const primaryModel = model || 'gemini-2.5-flash';

  const response = await ai.models.generateContent({
    model: primaryModel,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    },
  });

  return response.text || '';
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// GET /api/settings/ai-config
app.get('/api/settings/ai-config', (_req: Request, res: Response) => {
  const current = getEffectiveAIConfig();
  const maskedKey = current.apiKey
    ? `${current.apiKey.slice(0, 6)}...${current.apiKey.slice(-4)}`
    : '';

  return res.json({
    hasCustomKey: Boolean(current.apiKey),
    provider: current.provider,
    model: current.model,
    maskedKey,
    isPersisted: Boolean(activeConfig.apiKey),
  });
});

// POST /api/settings/ai-config (Save key persistently)
app.post('/api/settings/ai-config', (req: Request, res: Response) => {
  try {
    const { apiKey, provider, model } = req.body;

    const trimmedKey = (apiKey || '').trim();
    const resolvedProv = resolveProvider(trimmedKey, provider);

    activeConfig = {
      apiKey: trimmedKey,
      provider: resolvedProv,
      model: model || (resolvedProv === 'groq' ? 'llama-3.3-70b-versatile' : resolvedProv === 'openai' ? 'gpt-4o-mini' : 'gemini-2.5-flash'),
      updatedAt: new Date().toISOString(),
    };

    // Save to disk
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(activeConfig, null, 2), 'utf-8');

    const maskedKey = trimmedKey ? `${trimmedKey.slice(0, 6)}...${trimmedKey.slice(-4)}` : '';

    return res.json({
      success: true,
      message: trimmedKey ? 'AI configuration saved successfully.' : 'Reverted to default configuration.',
      provider: activeConfig.provider,
      model: activeConfig.model,
      maskedKey,
    });
  } catch (err: any) {
    console.error('Failed to save AI config:', err);
    return res.status(500).json({ success: false, error: 'Could not save AI configuration to disk.' });
  }
});

// DELETE /api/settings/ai-config
app.delete('/api/settings/ai-config', (_req: Request, res: Response) => {
  try {
    activeConfig = { provider: 'auto' };
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      fs.unlinkSync(CONFIG_FILE_PATH);
    }
    return res.json({ success: true, message: 'Cleared custom AI settings.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/test-key
app.get('/api/test-key', async (req: Request, res: Response) => {
  try {
    const customKeyHeader = req.headers['x-custom-api-key'] as string | undefined;
    const { apiKey, provider, model } = getEffectiveAIConfig(customKeyHeader);

    if (!apiKey) {
      return res.json({
        ok: true,
        model: 'Built-in Tourism Knowledge Engine',
        provider: 'local',
        usingCustomKey: false,
        msg: 'Free tier ready with built-in instant travel knowledge fallback.',
      });
    }

    let reply = '';
    if (provider === 'groq') {
      reply = await callOpenAICompatible(
        apiKey,
        'https://api.groq.com/openai/v1/chat/completions',
        model || 'llama-3.3-70b-versatile',
        [{ role: 'user', content: 'Say "OK"' }],
        'You are an assistant. Reply with OK.'
      );
    } else if (provider === 'openai') {
      reply = await callOpenAICompatible(
        apiKey,
        'https://api.openai.com/v1/chat/completions',
        model || 'gpt-4o-mini',
        [{ role: 'user', content: 'Say "OK"' }],
        'You are an assistant. Reply with OK.'
      );
    } else {
      // Gemini
      reply = await callGemini(
        apiKey,
        model || 'gemini-2.5-flash',
        [{ role: 'user', content: 'Say "OK"' }],
        'You are an assistant. Reply with OK.'
      );
    }

    return res.json({
      ok: true,
      provider,
      model,
      sample: reply.slice(0, 100),
      usingCustomKey: Boolean(apiKey),
      msg: `Verified! Successfully connected to ${provider.toUpperCase()} (${model}).`,
    });
  } catch (err: any) {
    console.warn('Test key connection error:', err.message);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Connection test failed. Please verify API key format.',
    });
  }
});

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, tourContext, userLanguage } = req.body;
  const customKeyHeader = req.headers['x-custom-api-key'] as string | undefined;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const lastMessage = messages[messages.length - 1]?.content || '';
  const lang = (userLanguage === 'bn' ? 'bn' : 'en') as 'bn' | 'en';

  let systemPrompt = AI_CONCIERGE_SYSTEM_PROMPT;
  if (tourContext) {
    systemPrompt += `\n\nCURRENT TOUR IN FOCUS:\n${JSON.stringify(tourContext, null, 2)}\nWhen answering questions about this tour, prioritize accurate details from this package.`;
  }
  if (userLanguage) {
    systemPrompt += `\nUser preferred language: ${userLanguage === 'bn' ? 'Bangla (বাংলা)' : 'English'}.`;
  }

  const { apiKey, provider, model } = getEffectiveAIConfig(customKeyHeader);

  // If no API key is set, immediately respond with the intelligent built-in knowledge base!
  if (!apiKey) {
    const fallbackReply = generateLocalKnowledgeReply(lastMessage, lang, tourContext);
    return res.json({ text: fallbackReply, success: true, fallback: true });
  }

  try {
    let replyText = '';
    if (provider === 'groq') {
      replyText = await callOpenAICompatible(
        apiKey,
        'https://api.groq.com/openai/v1/chat/completions',
        model || 'llama-3.3-70b-versatile',
        messages,
        systemPrompt
      );
    } else if (provider === 'openai') {
      replyText = await callOpenAICompatible(
        apiKey,
        'https://api.openai.com/v1/chat/completions',
        model || 'gpt-4o-mini',
        messages,
        systemPrompt
      );
    } else {
      // Gemini
      try {
        replyText = await callGemini(apiKey, model || 'gemini-2.5-flash', messages, systemPrompt);
      } catch (geminiErr: any) {
        // If 3.8 or custom model failed, try gemini-2.5-flash
        console.warn('Gemini primary model failed, attempting gemini-2.5-flash fallback:', geminiErr.message);
        replyText = await callGemini(apiKey, 'gemini-2.5-flash', messages, systemPrompt);
      }
    }

    if (!replyText || !replyText.trim()) {
      replyText = generateLocalKnowledgeReply(lastMessage, lang, tourContext);
    }

    return res.json({ text: replyText, success: true });
  } catch (err: any) {
    console.error('Chat AI Service Error, providing resilient local knowledge fallback:', err.message);
    // Never show "server too busy high demand" to the visitor!
    // Provide full, informative local knowledge answer
    const fallbackReply = generateLocalKnowledgeReply(lastMessage, lang, tourContext);
    return res.json({
      text: fallbackReply,
      success: true,
      warning: 'Live AI quota busy; delivered via verified travel knowledge base.',
    });
  }
});

// POST /api/translate
app.post('/api/translate', async (req: Request, res: Response) => {
  const { fields, targetLang, sourceLang } = req.body;
  const customKeyHeader = req.headers['x-custom-api-key'] as string | undefined;

  if (!fields || typeof fields !== 'object') {
    return res.status(400).json({ error: 'Fields object is required' });
  }

  const { apiKey, provider, model } = getEffectiveAIConfig(customKeyHeader);

  const prompt = `
You are a professional travel localization expert specialized in Bangladesh tourism terminology.
Translate the following travel package content from ${sourceLang === 'bn' ? 'Bangla' : 'English'} to ${targetLang === 'bn' ? 'Bangla (fluent, appealing, culturally authentic)' : 'English (clear, evocative, professional)'}.

Input JSON of fields to translate:
${JSON.stringify(fields, null, 2)}

Instructions:
1. Maintain exact JSON keys.
2. For strings, provide the translated string.
3. For arrays of strings (e.g. inclusions, highlights), translate each item into an array of strings.
4. Keep destination names, landmark names, and numerical values accurate (e.g. Sajek Valley -> সাজেক ভ্যালি, Bandarban -> বান্দরবান).
5. Output ONLY a valid JSON object matching the keys of the input. Do not include markdown code block syntax (\`\`\`json).
`;

  // Fallback translator if no key or API error
  const localTranslateFallback = () => {
    const translated: Record<string, any> = {};
    for (const [key, val] of Object.entries(fields)) {
      if (typeof val === 'string') {
        if (targetLang === 'bn') {
          translated[key] = val.replace(/Sajek/gi, 'সাজেক').replace(/Bandarban/gi, 'বান্দরবান').replace(/Cox's Bazar/gi, 'কক্সবাজার').replace(/Sylhet/gi, 'সিলেট');
        } else {
          translated[key] = val.replace(/সাজেক/g, 'Sajek').replace(/বান্দরবান/g, 'Bandarban').replace(/কক্সবাজার/g, "Cox's Bazar").replace(/সিলেট/g, 'Sylhet');
        }
      } else if (Array.isArray(val)) {
        translated[key] = val;
      } else {
        translated[key] = val;
      }
    }
    return translated;
  };

  if (!apiKey) {
    return res.json({ translations: localTranslateFallback(), success: true });
  }

  try {
    let rawText = '';
    if (provider === 'groq') {
      rawText = await callOpenAICompatible(
        apiKey,
        'https://api.groq.com/openai/v1/chat/completions',
        model || 'llama-3.3-70b-versatile',
        [{ role: 'user', content: prompt }],
        'You are a JSON translation engine. Output only valid JSON.'
      );
    } else if (provider === 'openai') {
      rawText = await callOpenAICompatible(
        apiKey,
        'https://api.openai.com/v1/chat/completions',
        model || 'gpt-4o-mini',
        [{ role: 'user', content: prompt }],
        'You are a JSON translation engine. Output only valid JSON.'
      );
    } else {
      // Gemini
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      rawText = response.text || '{}';
    }

    const cleanJson = (rawText || '{}').trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const translatedData = JSON.parse(cleanJson);
    return res.json({ translations: translatedData, success: true });
  } catch (err: any) {
    console.warn('Translate error, applying fallback:', err.message);
    return res.json({ translations: localTranslateFallback(), success: true });
  }
});

// Dev / Prod Vite serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
