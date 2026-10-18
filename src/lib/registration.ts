// Registration form model + validation, shared by the browser form and the API route.
import {
  CATEGORY_NAMES, DISTRICTS, ENTRY_TYPES, HEARD_FROM, LEVELS, MODES, PAPER_READY, PASSPORT_OPTIONS, PROJECT_STAGES,
} from "./constants";
import { ageOn, wordCount } from "./utils";

export type Member = { name: string; classYear: string; institution: string; phone: string };

export type RegData = {
  mode: string;
  entryType: string;
  memberCount: number;
  category: string;
  level: string;
  fullName: string;
  dateOfBirth: string;
  classYear: string;
  whatsapp: string;
  email: string;
  district: string;
  institution: string;
  passport: string;
  members: Member[];
  supervisorName: string;
  supervisorInstitution: string;
  supervisorPhone: string;
  guardianName: string;
  guardianPhone: string;
  projectTitle: string;
  projectSummary: string;
  projectStage: string;
  paperReady: string;
  heardFrom: string;
  agree: boolean;
};

export const EMPTY_REG: RegData = {
  mode: "", entryType: "", memberCount: 1, category: "", level: "",
  fullName: "", dateOfBirth: "", classYear: "", whatsapp: "", email: "", district: "", institution: "", passport: "",
  members: [], supervisorName: "", supervisorInstitution: "", supervisorPhone: "", guardianName: "", guardianPhone: "",
  projectTitle: "", projectSummary: "", projectStage: "", paperReady: "", heardFrom: "", agree: false,
};

export const STEP_TITLES = ["Participation", "Student / leader", "Team & supervisor", "Project"] as const;

export type Errors = Record<string, string>;

const PHONE = /^\+?\d{10,15}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const cleanPhone = (p: string) => p.replace(/[\s\-().]/g, "");

export const isTeam = (d: RegData) => d.entryType === "Team";
const BLANK: Member = { name: "", classYear: "", institution: "", phone: "" };
/** The (memberCount - 1) members besides the leader, padded with blanks. */
export const teamMembers = (d: RegData): Member[] =>
  Array.from({ length: Math.max(0, Math.min(5, d.memberCount - 1)) }, (_, i) => d.members[i] ?? BLANK);
export const showPassport = (d: RegData) => d.mode !== "Online (Zoom)";
export const isMinor = (d: RegData) => {
  const age = ageOn(d.dateOfBirth);
  return age !== null && age < 18;
};

function oneOf(e: Errors, key: string, value: string, list: readonly string[], msg: string) {
  if (!list.includes(value)) e[key] = msg;
}
function text(e: Errors, key: string, value: string, min: number, max: number, msg: string) {
  const v = value.trim();
  if (v.length < min) e[key] = msg;
  else if (v.length > max) e[key] = `Please keep this under ${max} characters.`;
}
function phone(e: Errors, key: string, value: string, required: boolean) {
  const v = cleanPhone(value);
  if (!v) {
    if (required) e[key] = "Phone number is required.";
  } else if (!PHONE.test(v)) e[key] = "Enter a valid phone number, e.g. 01712345678.";
}

export function validateStep(step: number, d: RegData): Errors {
  const e: Errors = {};
  if (step === 0) {
    oneOf(e, "mode", d.mode, MODES, "Please choose a mode.");
    oneOf(e, "entryType", d.entryType, ENTRY_TYPES, "Please choose Individual or Team.");
    if (isTeam(d) && !(d.memberCount >= 2 && d.memberCount <= 6)) e.memberCount = "A team has 2 to 6 members.";
    oneOf(e, "category", d.category, CATEGORY_NAMES, "Please choose a category.");
    oneOf(e, "level", d.level, LEVELS, "Please choose your level.");
  }
  if (step === 1) {
    text(e, "fullName", d.fullName, 2, 120, "Please enter your full name.");
    const age = ageOn(d.dateOfBirth);
    if (!d.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    else if (age === null || age < 6 || age > 40) e.dateOfBirth = "Please enter a valid date of birth.";
    text(e, "classYear", d.classYear, 1, 60, "Please enter your class or year.");
    phone(e, "whatsapp", d.whatsapp, true);
    if (!EMAIL.test(d.email.trim())) e.email = "Please enter a valid email address.";
    oneOf(e, "district", d.district, DISTRICTS, "Please choose your district.");
    text(e, "institution", d.institution, 2, 200, "Please enter your institution name.");
    if (d.passport && !PASSPORT_OPTIONS.includes(d.passport as never)) e.passport = "Please choose an option.";
  }
  if (step === 2) {
    if (isTeam(d)) {
      // Validate every required member slot, not just the ones the user has touched.
      teamMembers(d).forEach((m, i) => {
        text(e, `members.${i}.name`, m.name, 2, 120, "Member name is required.");
        text(e, `members.${i}.classYear`, m.classYear, 1, 60, "Class/year is required.");
        if (m.institution.length > 200) e[`members.${i}.institution`] = "Too long.";
        phone(e, `members.${i}.phone`, m.phone, false);
      });
    }
    const team = isTeam(d);
    if (team || d.supervisorName) text(e, "supervisorName", d.supervisorName, 2, 120, "Supervisor name is required for teams.");
    if (team) text(e, "supervisorInstitution", d.supervisorInstitution, 2, 200, "Supervisor institution is required for teams.");
    phone(e, "supervisorPhone", d.supervisorPhone, team);
    if (isMinor(d)) {
      text(e, "guardianName", d.guardianName, 2, 120, "Guardian name is required for students under 18.");
      phone(e, "guardianPhone", d.guardianPhone, true);
    } else phone(e, "guardianPhone", d.guardianPhone, false);
  }
  if (step === 3) {
    text(e, "projectTitle", d.projectTitle, 3, 200, "Please enter your project title.");
    const wc = wordCount(d.projectSummary);
    if (wc < 100 || wc > 300) e.projectSummary = `Summary must be 100–300 words (now ${wc}).`;
    oneOf(e, "projectStage", d.projectStage, PROJECT_STAGES, "Please choose your project stage.");
    oneOf(e, "paperReady", d.paperReady, PAPER_READY, "Please choose an option.");
    if (d.heardFrom && !HEARD_FROM.includes(d.heardFrom as never)) e.heardFrom = "Please choose an option.";
    if (!d.agree) e.agree = "Please tick the box to continue.";
  }
  return e;
}

export function validateAll(d: RegData) {
  return Object.assign({}, ...[0, 1, 2, 3].map((s) => validateStep(s, d))) as Errors;
}

const STEP0 = ["mode", "entryType", "memberCount", "category", "level"];
const STEP1 = ["fullName", "dateOfBirth", "classYear", "whatsapp", "email", "district", "institution", "passport"];

export function stepOfField(field: string) {
  if (STEP0.includes(field)) return 0;
  if (STEP1.includes(field)) return 1;
  if (/^(members\.|supervisor|guardian)/.test(field)) return 2;
  return 3;
}

/** Coerce untrusted JSON into RegData (unknown keys dropped, wrong types blanked). */
export function coerce(input: unknown): RegData {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const s = (k: string) => (typeof o[k] === "string" ? (o[k] as string).slice(0, 5000) : "");
  const membersRaw = Array.isArray(o.members) ? o.members.slice(0, 5) : [];
  const members = membersRaw.map((m) => {
    const r = (m && typeof m === "object" ? m : {}) as Record<string, unknown>;
    const g = (k: string) => (typeof r[k] === "string" ? (r[k] as string).slice(0, 300) : "");
    return { name: g("name"), classYear: g("classYear"), institution: g("institution"), phone: g("phone") };
  });
  const entryType = s("entryType");
  return {
    mode: s("mode"), entryType, memberCount: entryType === "Team" ? Number(o.memberCount) || 0 : 1, category: s("category"), level: s("level"),
    fullName: s("fullName"), dateOfBirth: s("dateOfBirth"), classYear: s("classYear"), whatsapp: s("whatsapp"), email: s("email"),
    district: s("district"), institution: s("institution"), passport: s("passport"), members,
    supervisorName: s("supervisorName"), supervisorInstitution: s("supervisorInstitution"), supervisorPhone: s("supervisorPhone"),
    guardianName: s("guardianName"), guardianPhone: s("guardianPhone"), projectTitle: s("projectTitle"), projectSummary: s("projectSummary"),
    projectStage: s("projectStage"), paperReady: s("paperReady"), heardFrom: s("heardFrom"), agree: o.agree === true,
  };
}
