import { after, NextResponse } from "next/server";
import { formatRegId } from "@/lib/constants";
import { db } from "@/lib/db";
import { sendRegistrationEmails } from "@/lib/mail";
import { cleanPhone, coerce, isMinor, isTeam, showPassport, teamMembers, validateAll } from "@/lib/registration";
import { getSettings } from "@/lib/settings";
import { clientIp, rateLimit, verifyTurnstile } from "@/lib/spam";
import { savePrivateUpload, useBlob, validRegistrationBlobUrl } from "@/lib/storage";

export async function POST(req: Request) {
  const s = await getSettings();
  if (!s.registrationOpen) {
    return NextResponse.json({ error: "Registration is currently closed. Please contact us on WhatsApp." }, { status: 403 });
  }

  const ip = clientIp(req.headers);
  if (!rateLimit(`register:${ip}`, 8, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes or contact us on WhatsApp." }, { status: 429 });
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission. The file may be too large (max 10 MB)." }, { status: 400 });
  }
  if (String(fd.get("company") ?? "")) return NextResponse.json({ error: "Invalid submission." }, { status: 400 }); // honeypot

  if (!(await verifyTurnstile(String(fd.get("cf-turnstile-response") ?? "") || null, ip))) {
    return NextResponse.json({ error: "Spam check failed. Please complete the check and try again." }, { status: 400 });
  }

  let data;
  try {
    data = coerce(JSON.parse(String(fd.get("data") ?? "{}")));
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }
  const errors = validateAll(data);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  // Either the browser already uploaded the file to Vercel Blob (fileUrl), or it was sent here (local disk).
  let upload: { name: string; original: string | null } | null = null;
  const fileUrl = String(fd.get("fileUrl") ?? "");
  const file = fd.get("file");
  if (fileUrl) {
    if (!useBlob() || !validRegistrationBlobUrl(fileUrl)) {
      return NextResponse.json({ errors: { file: "File upload failed. Please choose the file again." } }, { status: 422 });
    }
    upload = { name: fileUrl, original: String(fd.get("fileOriginal") ?? "").slice(0, 200) || null };
  } else if (file instanceof File && file.size > 0) {
    try {
      upload = await savePrivateUpload(file);
    } catch (e) {
      return NextResponse.json({ errors: { file: (e as Error).message } }, { status: 422 });
    }
  }

  const team = isTeam(data);
  const minor = isMinor(data);
  const reg = await db.$transaction(async (tx) => {
    const created = await tx.registration.create({
      data: {
        mode: data.mode,
        entryType: data.entryType,
        memberCount: team ? data.memberCount : 1,
        category: data.category,
        level: data.level,
        fullName: data.fullName.trim(),
        dateOfBirth: data.dateOfBirth,
        classYear: data.classYear.trim(),
        whatsapp: cleanPhone(data.whatsapp),
        email: data.email.trim().toLowerCase(),
        district: data.district,
        institution: data.institution.trim(),
        passport: showPassport(data) ? data.passport || null : null,
        members: JSON.stringify(
          team
            ? teamMembers(data).map((m) => ({ ...m, name: m.name.trim(), phone: cleanPhone(m.phone) }))
            : [],
        ),
        supervisorName: data.supervisorName.trim() || null,
        supervisorInstitution: data.supervisorInstitution.trim() || null,
        supervisorPhone: cleanPhone(data.supervisorPhone) || null,
        guardianName: minor || data.guardianName ? data.guardianName.trim() || null : null,
        guardianPhone: cleanPhone(data.guardianPhone) || null,
        projectTitle: data.projectTitle.trim(),
        projectSummary: data.projectSummary.trim(),
        projectStage: data.projectStage,
        paperReady: data.paperReady,
        heardFrom: data.heardFrom || null,
        fileName: upload?.name ?? null,
        fileOriginal: upload?.original ?? null,
      },
    });
    return tx.registration.update({ where: { id: created.id }, data: { regId: formatRegId(created.id) } });
  });

  after(() => sendRegistrationEmails(reg, s));

  return NextResponse.json({ ok: true, regId: reg.regId });
}
