/* Seeds the first admin + all website copy from the brief.
 * Safe to re-run (it runs on every Vercel deploy): the content is only seeded once. */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";
  if (email && password) {
    const exists = await db.user.findUnique({ where: { email } });
    if (!exists) {
      await db.user.create({
        data: { email, name: "DoB Admin", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`✓ Admin user created: ${email}`);
    }
  } else {
    console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD not set; no admin user created.");
  }

  if (await db.setting.findUnique({ where: { key: "seeded" } })) {
    console.log("✓ Content already seeded; skipping.");
    return;
  }

  if ((await db.faq.count()) === 0) {
    const faqs: [string, string, boolean][] = [
      ["What is BIESF 2026?", "An international science and innovation competition by ICGI in Bali, Indonesia.", true],
      ["What does Dreams of Bangladesh do?", "We are the Official Representative & National Selection Body for Bangladesh. We select, prepare and guide Bangladeshi students.", true],
      ["Who can join?", "School, college and university students in Bangladesh.", true],
      ["Can I join alone?", "Yes, individually or as a team of up to 6 with 1 supervisor.", true],
      ["Is there a selection round?", "No exam round. Selection is by registration, project review and a short interview with DoB.", true],
      ["Offline or online?", "Offline = present in Bali (16–20 Nov). Online = present from Bangladesh on Zoom (25–27 Nov).", false],
      ["Do I need a paper?", "Yes, a short paper in English. We will guide you.", false],
      ["What is the fee?", "Contact us on WhatsApp: 01754002201 / 01746342152.", false],
      ["Who are the international judges?", "Judges appointed by ICGI. DoB only manages the Bangladesh selection.", false],
      ["How do I register?", "Fill in the form on this website. Our team will contact you on WhatsApp.", false],
    ];
    await db.faq.createMany({
      data: faqs.map(([question, answer, showOnHome], i) => ({ question, answer, showOnHome, sortOrder: i })),
    });
    console.log("✓ FAQ seeded");
  }

  if ((await db.supportItem.count()) === 0) {
    const items: [string, string, string][] = [
      ["Project mentoring", "One-to-one guidance from the DoB team to sharpen your idea, method and results before the international round.", "GraduationCap"],
      ["Research paper help", "We help you write and format your English paper (max 12 pages, A4, Arial 12) using the official BIESF template.", "FileText"],
      ["Poster & presentation practice", "A0 poster review and mock 7-minute talks with 8-minute Q&A, so you are confident in front of international judges.", "Presentation"],
      ["ICGI registration", "Once you are confirmed, DoB registers your team with ICGI and handles the paperwork for you.", "ClipboardCheck"],
      ["Travel coordination (offline)", "For the Bali round we coordinate travel plans and keep parents updated throughout the trip.", "Plane"],
      ["Zoom support (online)", "For the online round we run a tech check and stay with you on the day, so you can present from Bangladesh.", "Video"],
    ];
    await db.supportItem.createMany({
      data: items.map(([title, description, icon], i) => ({ title, description, icon, sortOrder: i })),
    });
    console.log("✓ Support items seeded");
  }

  if ((await db.scheduleItem.count()) === 0) {
    const rows: [string, string, string, string][] = [
      ["16 Nov", "Opening Ceremony & Judging Day 1", "06:00 AM onwards", "Offline"],
      ["17 Nov", "Judging Day 2", "08:00 AM", "Offline"],
      ["18 Nov", "Private Judging (selected) & Cultural Exchange", "06:00 AM", "Offline"],
      ["19 Nov", "Awarding Ceremony", "08:00 AM", "Offline"],
      ["20 Nov", "FunEdu Trip", "05:00 AM", "Offline"],
      ["25 Nov", "Opening & Online Judging Day 1", "07:30 AM", "Online"],
      ["26 Nov", "Online Judging Day 2", "09:00 AM", "Online"],
      ["27 Nov", "Online Awarding Ceremony", "01:00 PM", "Online"],
    ];
    await db.scheduleItem.createMany({
      data: rows.map(([date, activity, bdTime, mode], i) => ({ date, activity, bdTime, mode, sortOrder: i })),
    });
    console.log("✓ Schedule seeded");
  }

  if ((await db.achievement.count()) === 0) {
    await db.achievement.createMany({
      data: [
        { event: "WICE 2026", location: "Malaysia", teams: 23, gold: 17, silver: 6, summary: "23 Bangladeshi teams competed at the World Invention Competition & Exhibition 2026 in Malaysia.", sortOrder: 0 },
        { event: "Innovation World Cup 2026", location: "Indonesia", gold: 18, platinum: 3, special: "IYSA Special Award", summary: "Bangladesh teams won 18 Gold and 3 Platinum medals, plus an IYSA Special Award.", sortOrder: 1 },
        { event: "WICE 2025", location: "Malaysia", teams: 17, gold: 14, silver: 3, summary: "17 Bangladeshi teams competed at WICE 2025 in Malaysia.", sortOrder: 2 },
      ],
    });
    console.log("✓ Achievements seeded");
  }

  if ((await db.newsPost.count()) === 0) {
    const now = Date.now();
    await db.newsPost.createMany({
      data: [
        {
          title: "Registration is open for BIESF 2026 Bangladesh selection",
          slug: "registration-open-biesf-2026",
          kind: "News",
          excerpt: "School, college and university students can now register online for the Bangladesh selection of BIESF 2026.",
          body: "Dreams of Bangladesh has opened registration for the Bangladesh selection of the 1st Bali International Engineering Science Fair (BIESF 2026).\n\nStudents can join individually or as a team of up to 6 members with 1 supervisor, in any of the 8 categories. Choose to present offline in Bali (16–20 November 2026) or online on Zoom from Bangladesh (25–27 November 2026).\n\nThere is no exam round. Selection is by registration, project review and a short interview with the DoB team. Register on this website and our team will contact you on WhatsApp within 24–48 hours.",
          publishedAt: new Date(now),
        },
        {
          title: "Dreams of Bangladesh named Official Representative of BIESF in Bangladesh",
          slug: "dob-official-representative-biesf",
          kind: "News",
          excerpt: "DoB is the Official Representative & National Selection Body of BIESF 2026 for Bangladesh.",
          body: "BIESF 2026 is organised by ICGI (Indonesian Centre for Giftedness Innovation), Indonesia, with IPB University and IYSA.\n\nDreams of Bangladesh (DoB) is the Official Representative & National Selection Body of BIESF for Bangladesh. DoB selects Bangladesh's participants and prepares them for the international round. International judging and awards are decided by ICGI.",
          publishedAt: new Date(now - 60_000),
        },
        {
          title: "Bangladesh wins 17 Gold and 6 Silver at WICE 2026, Malaysia",
          slug: "wice-2026-results",
          kind: "Result",
          excerpt: "23 Bangladeshi teams represented the country at WICE 2026 in Malaysia, bringing home 17 Gold and 6 Silver medals.",
          body: "23 Bangladeshi teams guided by Dreams of Bangladesh competed at WICE 2026 in Malaysia, winning 17 Gold and 6 Silver medals.\n\nCongratulations to every student, supervisor and parent who made this possible!",
          publishedAt: new Date(now - 120_000),
        },
      ],
    });
    console.log("✓ News seeded");
  }

  if ((await db.galleryAlbum.count()) === 0) {
    await db.galleryAlbum.create({
      data: {
        title: "Bali: Island of the Gods",
        description: "A look at where BIESF 2026 takes place. Competition photos from DoB will be added here.",
        photos: {
          create: [
            { url: "/photos/hero-ulun-danu.webp", caption: "Pura Ulun Danu Bratan", sortOrder: 0 },
            { url: "/photos/tanah-lot.webp", caption: "Tanah Lot (FunEdu Trip)", sortOrder: 1 },
            { url: "/photos/kelingking.webp", caption: "Kelingking Beach, Nusa Penida", sortOrder: 2 },
            { url: "/photos/rice-terrace.webp", caption: "Tegallalang rice terraces", sortOrder: 3 },
            { url: "/photos/pura-bratan.webp", caption: "Temple at sunrise", sortOrder: 4 },
            { url: "/photos/diamond-beach.webp", caption: "Diamond Beach", sortOrder: 5 },
          ],
        },
      },
    });
    console.log("✓ Gallery seeded");
  }

  await db.setting.create({ data: { key: "seeded", value: new Date().toISOString() } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
