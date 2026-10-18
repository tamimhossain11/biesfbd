# BIESF 2026 Bangladesh (biesfbd.com)

Official Bangladesh website for BIESF 2026, run by Dreams of Bangladesh (DoB).
Public site + registration form + private admin panel, in one Next.js app.

- **Stack:** Next.js 16, React 19, Tailwind 4, Prisma + PostgreSQL, Vercel Blob (uploads), sharp, exceljs.
- **Data:** registrations and content in Postgres. Uploads go to Vercel Blob when `BLOB_READ_WRITE_TOKEN`
  is set, otherwise to local disk under `storage/` (local dev / VPS).

## Deploy on Vercel

1. **Import** the GitHub repo in Vercel (framework: Next.js; Vercel uses the `vercel-build` script automatically).
2. **Storage → Prisma Postgres:** connect it to the project with the custom prefix **`DATABASE`**, so the
   variable is named `DATABASE_URL`. (If it ends up with another name, add `DATABASE_URL` yourself with the same value.)
3. **Storage → Blob:** create a Blob store and connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
4. **Settings → Environment Variables** (Production + Preview):

   | Name | Value |
   | --- | --- |
   | `SESSION_SECRET` | long random string (`openssl rand -hex 32`) |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first admin login (created on the first deploy) |
   | `SITE_URL` | `https://biesfbd.com` (or the `*.vercel.app` URL until the domain is ready) |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | optional: confirmation + alert emails |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | optional: Cloudflare Turnstile spam check |

5. **Deploy.** Each build runs `prisma db push` (creates/updates tables) and the seed (first admin + website
   content, only once), then builds the site.
6. **Domains:** add `biesfbd.com` in Project → Domains and update the DNS records Vercel shows.

Vercel limits: requests to the server are capped at 4.5 MB, so student files (≤10 MB) upload straight from the
browser to Blob, and admin photos are shrunk in the browser before upload (gallery: ~10 photos per upload).

## Run locally

```bash
cp .env.example .env        # set DATABASE_URL (local Postgres), SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run setup               # creates the tables and seeds all website content + first admin
npm run dev                 # http://localhost:3000, admin at /admin
```

Without `BLOB_READ_WRITE_TOKEN`, uploads are saved to `storage/` on disk.
If your shell has `NODE_ENV=production` set, run dev with `NODE_ENV=development npm run dev`.

## Deploy on a VPS instead (optional)

Needs Node 20.9+ and a Postgres database. Blob is optional (without it, files go to `storage/`, so back that folder up).

```bash
git clone <repo> biesfbd && cd biesfbd
cp .env.example .env && nano .env
npm ci && npm run setup && npm run build
npx pm2 start "npm start" --name biesfbd && npx pm2 save    # port 3000; put Nginx + HTTPS in front
```

## Configure after launch

| What | Where |
| --- | --- |
| Event dates, venue, notice bar, WhatsApp numbers, socials, registration on/off, fees switch (keep OFF) | Admin → Settings & dates |
| Meta Pixel ID (fires `Lead` on successful registration) + GA4 ID | Admin → Settings & dates → Tracking |
| ICGI authorization letter, home banner photo, promo video | Admin → Settings & dates → Media |
| News, results, achievements, gallery, FAQ, support list, schedule | Admin sidebar |
| Confirmation email to student + alert email to team | `.env` → `SMTP_*`, `MAIL_FROM`; team addresses in Settings → "Send new-registration alerts to" |
| Spam protection (Cloudflare Turnstile) | `.env` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (rebuild after setting). Honeypot + rate limiting are always on. |
| Team logins (Admin / Editor) | Admin → Team users |

Roles: **Admin** can do everything. **Editor** can manage registrations and edit content, but not Settings or Users.

## Backups

- **Database:** Prisma Postgres keeps its own backups (see your Prisma/Vercel plan).
- **Manual export:** Admin → Settings → "Download full backup (JSON)" downloads every table
  (registrations, notes, content, settings; no passwords). Do this regularly, especially before the event.
- **Excel:** Admin → Registrations → "Export to Excel".

## Content still needed from DoB

- **Logos:** `public/brand/{dob,icgi,biesf}.webp` were taken from the brief PDF and are low-res (ICGI/BIESF especially).
  Replace them with the official high-resolution files (same names, any size; keep the aspect ratio).
- **Photos:** `public/photos/*` are free Unsplash photos of Bali (Unsplash License). Replace or add DoB's competition photos via Admin → Gallery.
- **Email / office address**, **YouTube channel URL**, **promo video**, **ICGI authorization letter**: add in Admin → Settings.

## Launch checklist (from the brief)

1. Home, BIESF 2026, How to Join, Register, Contact pages live
2. Form works (individual + team), Thank-You page, Registration ID, emails (needs SMTP)
3. Admin: see registrations, change status, export Excel
4. WhatsApp buttons open the right number on Android and iPhone
5. No fees, bank details, QR codes, ICGI contacts or old deadlines anywhere
6. Tested on mobile + Facebook in-app browser
7. Meta Pixel "Lead" event working (add Pixel ID, submit a test registration, check Events Manager → Test events)
