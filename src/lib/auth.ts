import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { SESSION_COOKIE, verifySession, type SessionUser } from "./session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  // Make sure the account still exists and pick up role changes.
  const user = await db.user.findUnique({ where: { id: session.uid } });
  if (!user) return null;
  return { uid: user.id, email: user.email, name: user.name, role: user.role === "ADMIN" ? "ADMIN" : "EDITOR" };
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin?denied=1");
  return user;
}
