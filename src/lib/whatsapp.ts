import { BookingInquiry, Language, SiteConfig } from '../types';
import { siteConfig } from '../config/siteConfig';

export interface WhatsAppValidation {
  isValidNumber: boolean;
  sanitizedNumber: string;
  errorMessage?: string;
}

/**
 * Validates international format phone number configured in siteConfig
 */
export function validateBusinessWhatsApp(phoneNumber: string): WhatsAppValidation {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  // Valid Bangladeshi mobile is 8801XXXXXXXXX (13 digits) or similar international format (at least 10 digits)
  if (!digitsOnly || digitsOnly.length < 10 || digitsOnly === '8801711000000') {
    // If it's the placeholder demo number '8801711000000'
    return {
      isValidNumber: false,
      sanitizedNumber: digitsOnly,
      errorMessage: 'Agency WhatsApp number is currently set to a demo placeholder (8801711000000). Please update siteConfig.ts with your real agency WhatsApp number before launching.',
    };
  }

  return {
    isValidNumber: true,
    sanitizedNumber: digitsOnly,
  };
}

/**
 * Generates an inquiry message in Bangla or English
 */
export function formatInquiryMessage(
  inquiry: BookingInquiry,
  packageTitle: string,
  language: Language,
  config?: SiteConfig
): string {
  const activeConfig = config || siteConfig;
  if (language === 'bn') {
    return [
      `*আসসালামু আলাইকুম / নমস্কার,*`,
      `আমি ${activeConfig.agencyName} ওয়েবসাইট থেকে একটি ট্যুর বুকিং অনুসন্ধান পাঠাচ্ছি:`,
      ``,
      `📍 *প্যাকেজ:* ${packageTitle}`,
      `👤 *নাম:* ${inquiry.fullName}`,
      `📱 *মোবাইল:* ${inquiry.phone}`,
      inquiry.email ? `✉️ *ইমেইল:* ${inquiry.email}` : null,
      `📅 *যাত্রার সম্ভাব্য তারিখ:* ${inquiry.travelDate}`,
      `👥 *যাত্রী সংখ্যা:* ${inquiry.travelersCount} জন`,
      inquiry.specialRequests
        ? `📝 *বিশেষ চাহিদা:* ${inquiry.specialRequests}`
        : null,
      ``,
      `দয়া করে উক্ত তারিখে সিট ও রুম ফাঁকা থাকা সাপেক্ষে চূড়ান্ত মূল্য ও বুকিং প্রক্রিয়া জানিয়ে বাধিত করবেন। ধন্যবাদ!`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    `*Hello ${activeConfig.agencyName} Team,*`,
    `I would like to inquire about booking a tour package via your website:`,
    ``,
    `📍 *Tour Package:* ${packageTitle}`,
    `👤 *Name:* ${inquiry.fullName}`,
    `📱 *Phone:* ${inquiry.phone}`,
    inquiry.email ? `✉️ *Email:* ${inquiry.email}` : null,
    `📅 *Preferred Travel Date:* ${inquiry.travelDate}`,
    `👥 *Travelers:* ${inquiry.travelersCount} Person(s)`,
    inquiry.specialRequests
      ? `📝 *Special Notes:* ${inquiry.specialRequests}`
      : null,
    ``,
    `Please confirm room availability, final pricing, and booking instructions. Thank you!`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the WhatsApp wa.me URL
 */
export function buildWhatsAppUrl(
  inquiry: BookingInquiry,
  packageTitle: string,
  language: Language,
  config?: SiteConfig
): { url: string; rawText: string; isDemoNotice: boolean; messageText: string } {
  const activeConfig = config || siteConfig;
  const validation = validateBusinessWhatsApp(activeConfig.whatsappNumber);
  const messageText = formatInquiryMessage(inquiry, packageTitle, language, activeConfig);
  const encodedText = encodeURIComponent(messageText);

  // If placeholder, we still construct the link so the user can test or copy message
  const targetNumber = validation.isValidNumber ? validation.sanitizedNumber : '8801711000000';
  const url = `https://wa.me/${targetNumber}?text=${encodedText}`;

  return {
    url,
    rawText: messageText,
    isDemoNotice: !validation.isValidNumber,
    messageText,
  };
}
