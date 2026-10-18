import ExcelJS from "exceljs";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Member } from "@/lib/registration";
import { buildWhere, readFilters } from "@/lib/regFilters";
import { formatDateTime } from "@/lib/utils";

export async function GET(req: Request) {
  if (!(await getSessionUser())) return new Response("Unauthorized", { status: 401 });
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const rows = await db.registration.findMany({ where: buildWhere(readFilters(sp)), orderBy: { id: "asc" } });

  const wb = new ExcelJS.Workbook();
  wb.creator = "BIESF Bangladesh";
  const ws = wb.addWorksheet("Registrations", { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = [
    { header: "Registration ID", key: "regId", width: 18 },
    { header: "Registered (BD time)", key: "createdAt", width: 20 },
    { header: "Status", key: "status", width: 16 },
    { header: "Mode", key: "mode", width: 14 },
    { header: "Entry", key: "entryType", width: 11 },
    { header: "Members", key: "memberCount", width: 9 },
    { header: "Category", key: "category", width: 28 },
    { header: "Level", key: "level", width: 11 },
    { header: "Full name", key: "fullName", width: 24 },
    { header: "Date of birth", key: "dateOfBirth", width: 13 },
    { header: "Class / year", key: "classYear", width: 14 },
    { header: "WhatsApp", key: "whatsapp", width: 15 },
    { header: "Email", key: "email", width: 26 },
    { header: "District", key: "district", width: 14 },
    { header: "Institution", key: "institution", width: 28 },
    { header: "Passport", key: "passport", width: 10 },
    { header: "Team members", key: "members", width: 50 },
    { header: "Supervisor", key: "supervisorName", width: 20 },
    { header: "Supervisor institution", key: "supervisorInstitution", width: 24 },
    { header: "Supervisor phone", key: "supervisorPhone", width: 15 },
    { header: "Guardian", key: "guardianName", width: 20 },
    { header: "Guardian phone", key: "guardianPhone", width: 15 },
    { header: "Project title", key: "projectTitle", width: 34 },
    { header: "Project stage", key: "projectStage", width: 13 },
    { header: "Paper ready", key: "paperReady", width: 12 },
    { header: "Summary", key: "projectSummary", width: 60 },
    { header: "Heard from", key: "heardFrom", width: 16 },
    { header: "File uploaded", key: "file", width: 12 },
  ];
  for (const r of rows) {
    let members: Member[] = [];
    try {
      members = JSON.parse(r.members);
    } catch {}
    ws.addRow({
      ...r,
      createdAt: formatDateTime(r.createdAt),
      members: members.map((m) => [m.name, m.classYear, m.institution, m.phone].filter(Boolean).join(", ")).join(" | "),
      file: r.fileName ? "Yes" : "",
    });
  }
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF163496" } };
  ws.autoFilter = { from: "A1", to: { row: 1, column: ws.columns.length } };

  const buf = await wb.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="biesf-registrations-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
