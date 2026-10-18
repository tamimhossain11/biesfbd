# BIESF 2026 Bangladesh (biesfbd.com)

Official Bangladesh website for BIESF 2026, run by Dreams of Bangladesh (DoB).
Public site + registration form + private admin panel, in one Next.js app.

- **Stack:** Next.js 16, React 19, Tailwind 4, Prisma + SQLite, sharp (image compression), exceljs (Excel export).
- **Data:** everything lives in `storage/`: the database (`biesf.db`), student uploads (`private/`),
  admin-uploaded images (`media/`) and daily backups (`backups/`). Back up this folder.

## Run locally

```bash
cp .env.example .env        # then edit SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run setup               # creates the database and seeds all website content + first admin
npm run dev                 # http://localhost:3000, admin at /admin
```

> If your shell has `NODE_ENV=production` set, run dev with `NODE_ENV=development npm run dev`.

## Deploy (VPS, e.g. Ubuntu + Nginx)

This app needs a **Node.js server with a persistent disk** (any VPS, Railway/Render with a volume, cPanel "Node.js app", etc.).
It does **not** work on serverless hosts like Vercel/Netlify, because SQLite and uploads need a real disk.

```bash
# on the server (Node 20.9+)
git clone <repo> biesfbd && cd biesfbd
cp .env.example .env && nano .env      # SITE_URL=https://biesfbd.com, new SESSION_SECRET (openssl rand -hex 32), admin login, SMTP
npm ci
npm run setup                          # first time only
npm run build
npx pm2 start "npm start" --name biesfbd && npx pm2 save    # runs on port 3000 (set PORT to change)
```

Nginx (then `certbot --nginx -d biesfbd.com -d www.biesfbd.com` for HTTPS):

```nginx
server {
  server_name biesfbd.com www.biesfbd.com;
  client_max_body_size 60m;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

**Updating:** `git pull && npm ci && npx prisma db push && npm run build && npx pm2 restart biesfbd`.

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

- **Automatic:** while the production server runs, a database snapshot is saved to `storage/backups/` once a day (last 30 kept).
- **Manual:** Admin → Settings → "Download database backup", or `npm run backup`.
- Copy `storage/` off the server regularly (e.g. a nightly `rsync`/`rclone` cron), since server-only backups don't survive a lost server.

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
