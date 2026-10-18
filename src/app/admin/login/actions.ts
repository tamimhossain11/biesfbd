"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/spam";
import { str } from "@/lib/utils";

const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function login(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) return { error: "Too many attempts. Try again in 15 minutes." };

  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = email ? await db.user.findUnique({ where: { email } }) : null;
  // Compare against a dummy hash when the user doesn't exist, to keep timing similar.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "Wrong email or password." };

  const token = await signSession({ uid: user.id, email: user.email, name: user.name, role: user.role === "ADMIN" ? "ADMIN" : "EDITOR" });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && (process.env.SITE_URL ?? "").startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
