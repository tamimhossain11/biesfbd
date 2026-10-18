"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit, verifyTurnstile } from "@/lib/spam";
import { str } from "@/lib/utils";

export type ContactState = { ok?: boolean; error?: string };

const schema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  phone: z.string().regex(/^[+\d][\d\s-]{6,18}$/, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.string().email("Please enter a valid email")]),
  message: z.string().min(5, "Please write a short message").max(3000),
});

export async function sendContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  if (str(fd, "company")) return { ok: true }; // honeypot
  const h = await headers();
  const ip = clientIp(h);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) return { error: "Too many messages. Please try again later or WhatsApp us." };
  if (!(await verifyTurnstile(str(fd, "cf-turnstile-response") || null, ip))) return { error: "Spam check failed. Please try again." };

  const parsed = schema.safeParse({ name: str(fd, "name"), phone: str(fd, "phone"), email: str(fd, "email"), message: str(fd, "message") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  await db.contactMessage.create({ data: { ...parsed.data, email: parsed.data.email || null } });
  return { ok: true };
}
