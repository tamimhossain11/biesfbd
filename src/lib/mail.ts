import "server-only";
import nodemailer from "nodemailer";
import type { Registration } from "@prisma/client";
import type { SiteSettings } from "./settings";
import { waLink } from "./utils";

function transporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#eef3fb;font-family:Arial,Helvetica,sans-serif;color:#0E1E5C">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
  <tr><td style="background:#163496;padding:20px 24px;border-bottom:4px solid #F0A828;color:#fff;font-size:18px;font-weight:bold">${esc(title)}</td></tr>
  <tr><td style="padding:24px;font-size:15px;line-height:1.6">${body}</td></tr>
  <tr><td style="background:#0E1E5C;color:#c7d2fe;padding:14px 24px;font-size:12px">Dreams of Bangladesh: Official Representative &amp; National Selection Body of BIESF for Bangladesh</td></tr>
  </table></td></tr></table></body></html>`;
}

export async function sendRegistrationEmails(reg: Registration, s: SiteSettings) {
  const t = transporter();
  if (!t) {
    console.warn("[mail] SMTP_HOST not set, skipping registration emails for", reg.regId);
    return;
  }
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const wa = waLink(s.whatsapp1, `Hi DoB, I registered for BIESF 2026. My ID is ${reg.regId}.`);
  const siteUrl = process.env.SITE_URL || "";

  const student = t.sendMail({
    from,
    to: reg.email,
    subject: `BIESF 2026 registration received: ${reg.regId}`,
    html: layout(
      "Registration received!",
      `<p>Dear ${esc(reg.fullName)},</p>
       <p>Thank you for registering for <b>BIESF 2026</b> (Bali International Engineering Science Fair) through Dreams of Bangladesh.</p>
       <p style="font-size:18px">Your Registration ID: <b style="color:#163496">${esc(reg.regId ?? "")}</b></p>
       <p>Our team will contact you on WhatsApp within <b>24–48 hours</b>.</p>
       <p><b>Project:</b> ${esc(reg.projectTitle)}<br/><b>Category:</b> ${esc(reg.category)}<br/><b>Mode:</b> ${esc(reg.mode)}</p>
       <p><a href="${wa}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Message us on WhatsApp</a></p>
       <p style="font-size:13px;color:#475569">WhatsApp: ${esc(s.whatsapp1)} | ${esc(s.whatsapp2)}</p>`,
    ),
  });

  const alertTo = s.notifyEmails
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const alert = alertTo.length
    ? t.sendMail({
        from,
        to: alertTo,
        replyTo: reg.email,
        subject: `New BIESF registration ${reg.regId}: ${reg.fullName} (${reg.mode})`,
        html: layout(
          `New registration ${reg.regId ?? ""}`,
          `<p><b>${esc(reg.fullName)}</b> · ${esc(reg.institution)} · ${esc(reg.district)}</p>
           <p>${esc(reg.entryType)} (${reg.memberCount}) · ${esc(reg.mode)} · ${esc(reg.level)}<br/>
           Category: ${esc(reg.category)}<br/>Project: ${esc(reg.projectTitle)}</p>
           <p>WhatsApp: ${esc(reg.whatsapp)} · Email: ${esc(reg.email)}</p>
           <p><a href="${siteUrl}/admin/registrations/${reg.id}" style="color:#163496;font-weight:bold">Open in admin panel →</a></p>`,
        ),
      })
    : Promise.resolve();

  const results = await Promise.allSettled([student, alert]);
  for (const r of results) if (r.status === "rejected") console.error("[mail] send failed:", r.reason);
}
