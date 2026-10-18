import type { Prisma } from "@prisma/client";

export type RegFilters = { q?: string; status?: string; mode?: string; category?: string; level?: string; type?: string };

export function readFilters(sp: Record<string, string | string[] | undefined>): RegFilters {
  const g = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string).trim().slice(0, 200) : undefined) || undefined;
  return { q: g("q"), status: g("status"), mode: g("mode"), category: g("category"), level: g("level"), type: g("type") };
}

export function buildWhere(f: RegFilters): Prisma.RegistrationWhereInput {
  const where: Prisma.RegistrationWhereInput = {};
  if (f.status) where.status = f.status;
  if (f.mode) where.mode = f.mode;
  if (f.category) where.category = f.category;
  if (f.level) where.level = f.level;
  if (f.type) where.entryType = f.type;
  if (f.q) {
    const q = f.q;
    where.OR = ["regId", "fullName", "email", "whatsapp", "institution", "projectTitle", "district", "supervisorName"].map((k) => ({
      [k]: { contains: q, mode: "insensitive" as const },
    }));
  }
  return where;
}

export function toQuery(f: RegFilters, extra: Record<string, string> = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...f, ...extra })) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
}
