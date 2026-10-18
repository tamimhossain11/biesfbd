import { cache } from "react";
import { db } from "./db";

export type SiteSettings = {
  // Contact (DoB only — never ICGI)
  whatsapp1: string;
  whatsapp2: string;
  email: string;
  address: string;
  website: string;
  facebook: string;
  instagram: string;
  youtube: string;
  notifyEmails: string; // comma separated; receives "new registration" alerts

  // Event dates & venue (all editable — no hard-coded deadlines)
  offlineDates: string;
  offlineShort: string;
  onlineDates: string;
  onlineShort: string;
  venueName: string;
  venueAddress: string;
  deadlineNotice: string; // optional banner, empty = hidden

  // Switches
  registrationOpen: boolean;
  feesSectionEnabled: boolean; // keep OFF
  feesText: string;

  // Media
  heroImage: string;
  promoVideoUrl: string; // YouTube link
  authorizationLetter: string; // official ICGI letter image for the About page ("" = hidden)

  // Tracking
  metaPixelId: string;
  gaMeasurementId: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp1: "01754002201",
  whatsapp2: "01746342152",
  email: "",
  address: "",
  website: "https://dreamsofbangladesh.com",
  facebook: "https://www.facebook.com/dreams.of.bangladesh",
  instagram: "https://www.instagram.com/dob.bd",
  youtube: "https://www.youtube.com/results?search_query=Dreams+of+Bangladesh",
  notifyEmails: "",

  offlineDates: "16–20 November 2026",
  offlineShort: "16–20 Nov",
  onlineDates: "24–27 November 2026",
  onlineShort: "24–27 Nov",
  venueName: "Balai Diklat Industri Denpasar",
  venueAddress: "Jl. WR Supratman No. 302, Denpasar, Bali, Indonesia",
  deadlineNotice: "",

  registrationOpen: true,
  feesSectionEnabled: false,
  feesText: "For fees & packages, contact us on WhatsApp.",

  heroImage: "/photos/hero-ulun-danu.webp",
  promoVideoUrl: "",
  authorizationLetter: "/documents/icgi-invitation-letter.webp", // redacted: no ICGI contacts / old deadline

  metaPixelId: "",
  gaMeasurementId: "",
};

const KEY = "site";

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const row = await db.setting.findUnique({ where: { key: KEY } });
  if (!row) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(row.value) as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
});

export async function saveSettings(patch: Partial<SiteSettings>) {
  const current = await getSettings();
  const value = JSON.stringify({ ...current, ...patch });
  await db.setting.upsert({ where: { key: KEY }, create: { key: KEY, value }, update: { value } });
}
