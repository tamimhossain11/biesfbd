"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileUp, Info, Loader2, X } from "lucide-react";
import {
  CATEGORIES, DISTRICTS, HEARD_FROM, LEVELS, MODES, PAPER_READY, PASSPORT_OPTIONS, PROJECT_STAGES,
} from "@/lib/constants";
import {
  EMPTY_REG, STEP_TITLES, isMinor, isTeam, showPassport, stepOfField, validateStep,
  type Errors, type Member, type RegData,
} from "@/lib/registration";
import { cn, wordCount } from "@/lib/utils";
import { Turnstile } from "./Turnstile";

const DRAFT_KEY = "biesf-reg-draft-v1";
const MAX_FILE = 10 * 1024 * 1024;
const EMPTY_MEMBER: Member = { name: "", classYear: "", institution: "", phone: "" };

export function RegisterForm({ directUpload = false }: { directUpload?: boolean }) {
  const router = useRouter();
  const [d, setD] = useState<RegData>(EMPTY_REG);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [restored, setRestored] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Restore / save a draft so a dropped connection doesn't lose everything.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        setD({ ...EMPTY_REG, ...JSON.parse(raw), agree: false });
        setRestored(true);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (d !== EMPTY_REG) localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {}
  }, [d]);

  const set = <K extends keyof RegData>(k: K, v: RegData[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k as string]: "" }));
  };
  const setMember = (i: number, k: keyof Member, v: string) => {
    setD((p) => {
      const members = [...p.members];
      while (members.length <= i) members.push({ ...EMPTY_MEMBER });
      members[i] = { ...members[i], [k]: v };
      return { ...p, members };
    });
    const key = `members.${i}.${k}`;
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (!first) return;
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input,select,textarea")?.focus({ preventScroll: true });
    });
  };

  const next = () => {
    const errs = validateStep(step, d);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep((s) => s + 1);
    scrollTop();
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    scrollTop();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return next();
    const errs = validateStep(3, d);
    if (file && file.size > MAX_FILE) errs.file = "File is larger than 10 MB.";
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);

    setSubmitting(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.set("data", JSON.stringify(d));
      if (file && directUpload) {
        // Upload straight to Vercel Blob (files can be bigger than the server's request limit).
        const { upload } = await import("@vercel/blob/client");
        const safe = file.name.replace(/[^\w.-]+/g, "_").slice(-80) || "file";
        try {
          const blob = await upload(`registrations/${safe}`, file, { access: "public", handleUploadUrl: "/api/register/upload", contentType: file.type });
          fd.set("fileUrl", blob.url);
          fd.set("fileOriginal", file.name);
        } catch (err) {
          setErrors({ file: `Upload failed: ${(err as Error).message}. Try again, or submit without the file.` });
          setSubmitting(false);
          return focusFirstError({ file: "x" });
        }
      } else if (file) fd.set("file", file);
      const ts = formRef.current?.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value;
      if (ts) fd.set("cf-turnstile-response", ts);
      fd.set("company", (formRef.current?.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "");
      const res = await fetch("/api/register", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.regId) {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        router.push(`/register/thank-you?id=${encodeURIComponent(json.regId)}`);
        return;
      }
      if (json.errors) {
        setErrors(json.errors);
        const first = Object.keys(json.errors)[0];
        const s = first === "file" ? 3 : stepOfField(first);
        setStep(s);
        focusFirstError(json.errors);
      } else {
        setFormError(json.error || "Something went wrong. Please try again or contact us on WhatsApp.");
      }
    } catch {
      setFormError("Network error. Please check your internet connection and try again.");
    }
    setSubmitting(false);
  };

  const team = isTeam(d);
  const minor = isMinor(d);
  const wc = wordCount(d.projectSummary);

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Stepper */}
      <ol className="mb-6 grid grid-cols-4 gap-2">
        {STEP_TITLES.map((t, i) => (
          <li key={t} className="min-w-0">
            <div className={cn("h-1.5 rounded-full", i < step ? "bg-dob" : i === step ? "bg-orange" : "bg-line")} />
            <p className={cn("mt-2 flex items-center gap-1.5 truncate text-xs font-semibold", i === step ? "text-royal" : "text-navy/50")}>
              <span className={cn("hidden size-5 shrink-0 place-items-center rounded-full text-[10px] sm:grid", i < step ? "bg-dob text-white" : i === step ? "bg-orange text-navy" : "bg-line text-navy/60")}>
                {i < step ? <Check className="size-3" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="truncate">{t}</span>
            </p>
          </li>
        ))}
      </ol>

      {restored && step === 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-cyan-light p-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0 text-royal" />
          <p className="flex-1">We restored your unfinished registration on this device.</p>
          <button type="button" className="font-semibold text-royal underline" onClick={() => { setD(EMPTY_REG); setRestored(false); try { localStorage.removeItem(DRAFT_KEY); } catch {} }}>
            Start over
          </button>
        </div>
      )}

      <form ref={formRef} onSubmit={submit} noValidate className="card p-5 sm:p-8">
        <p className="eyebrow">Part {String.fromCharCode(65 + step)} of D</p>
        <h2 className="mt-1 text-2xl font-bold text-royal">{STEP_TITLES[step]}</h2>
        <p className="mb-6 mt-1 text-sm text-navy/60"><span className="text-rose-600">*</span> = required</p>

        {step === 0 && (
          <div className="space-y-6">
            <Choice field="mode" label="Participation mode" required options={MODES} value={d.mode} onChange={(v) => set("mode", v)} error={errors.mode}
              hint={d.mode === "Not sure" ? "No problem: our team will help you decide." : undefined} />
            <Choice field="entryType" label="Individual or team?" required options={["Individual", "Team"]} value={d.entryType} error={errors.entryType}
              onChange={(v) => { set("entryType", v); set("memberCount", v === "Team" ? Math.max(2, d.memberCount) : 1); }} />
            {team && (
              <Field field="memberCount" label="Number of members (including leader)" required error={errors.memberCount} hint="Max 6 members + 1 supervisor.">
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <label key={n} className="choice min-w-14 justify-center">
                      <input type="radio" className="sr-only" name="memberCount" checked={d.memberCount === n} onChange={() => set("memberCount", n)} />
                      {n}
                    </label>
                  ))}
                </div>
              </Field>
            )}
            <Field field="category" label="Category" required error={errors.category}>
              <div className="grid gap-2 sm:grid-cols-2">
                {CATEGORIES.map((c) => (
                  <label key={c.name} className="choice">
                    <input type="radio" className="sr-only" name="category" checked={d.category === c.name} onChange={() => set("category", c.name)} />
                    <Radio checked={d.category === c.name} /> {c.name}
                  </label>
                ))}
              </div>
            </Field>
            <Choice field="level" label="Level" required options={LEVELS} value={d.level} onChange={(v) => set("level", v)} error={errors.level} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field field="fullName" label={team ? "Team leader full name" : "Full name"} required error={errors.fullName} className="sm:col-span-2">
              <input className={cn("input", errors.fullName && "input-error")} value={d.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
            </Field>
            <Field field="dateOfBirth" label="Date of birth" required error={errors.dateOfBirth}>
              <input type="date" className={cn("input", errors.dateOfBirth && "input-error")} value={d.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} max={new Date().toISOString().slice(0, 10)} />
            </Field>
            <Field field="classYear" label="Class / year" required error={errors.classYear}>
              <input className={cn("input", errors.classYear && "input-error")} value={d.classYear} onChange={(e) => set("classYear", e.target.value)} placeholder="e.g. Class 9, HSC 1st year, 2nd year BSc" />
            </Field>
            <Field field="whatsapp" label="WhatsApp number" required error={errors.whatsapp}>
              <input className={cn("input", errors.whatsapp && "input-error")} value={d.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />
            </Field>
            <Field field="email" label="Email" required error={errors.email}>
              <input type="email" className={cn("input", errors.email && "input-error")} value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" />
            </Field>
            <Field field="district" label="District" required error={errors.district}>
              <select className={cn("input", errors.district && "input-error")} value={d.district} onChange={(e) => set("district", e.target.value)}>
                <option value="">Select district</option>
                {DISTRICTS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field field="institution" label="Institution name" required error={errors.institution}>
              <input className={cn("input", errors.institution && "input-error")} value={d.institution} onChange={(e) => set("institution", e.target.value)} placeholder="School / college / university" />
            </Field>
            {showPassport(d) && (
              <div className="sm:col-span-2">
                <Choice field="passport" label="Do you have a passport? (for offline in Bali)" options={PASSPORT_OPTIONS} value={d.passport} onChange={(v) => set("passport", v)} error={errors.passport} />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            {team && (
              <div className="space-y-4">
                <h3 className="font-bold text-navy">Team members <span className="font-normal text-navy/60">(besides the leader)</span></h3>
                {Array.from({ length: d.memberCount - 1 }, (_, i) => {
                  const m = d.members[i] ?? EMPTY_MEMBER;
                  return (
                    <fieldset key={i} className="rounded-2xl border border-line bg-royal-50/40 p-4">
                      <legend className="px-1 text-sm font-bold text-royal">Member {i + 2}</legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field field={`members.${i}.name`} label="Name" required error={errors[`members.${i}.name`]}>
                          <input className={cn("input", errors[`members.${i}.name`] && "input-error")} value={m.name} onChange={(e) => setMember(i, "name", e.target.value)} />
                        </Field>
                        <Field field={`members.${i}.classYear`} label="Class / year" required error={errors[`members.${i}.classYear`]}>
                          <input className={cn("input", errors[`members.${i}.classYear`] && "input-error")} value={m.classYear} onChange={(e) => setMember(i, "classYear", e.target.value)} />
                        </Field>
                        <Field field={`members.${i}.institution`} label="Institution" error={errors[`members.${i}.institution`]}>
                          <input className="input" value={m.institution} onChange={(e) => setMember(i, "institution", e.target.value)} />
                        </Field>
                        <Field field={`members.${i}.phone`} label="Phone" error={errors[`members.${i}.phone`]}>
                          <input className={cn("input", errors[`members.${i}.phone`] && "input-error")} value={m.phone} onChange={(e) => setMember(i, "phone", e.target.value)} inputMode="tel" />
                        </Field>
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-bold text-navy">Supervisor {!team && <span className="font-normal text-navy/60">(optional for individuals)</span>}</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field field="supervisorName" label="Supervisor name" required={team} error={errors.supervisorName}>
                  <input className={cn("input", errors.supervisorName && "input-error")} value={d.supervisorName} onChange={(e) => set("supervisorName", e.target.value)} />
                </Field>
                <Field field="supervisorInstitution" label="Institution" required={team} error={errors.supervisorInstitution}>
                  <input className={cn("input", errors.supervisorInstitution && "input-error")} value={d.supervisorInstitution} onChange={(e) => set("supervisorInstitution", e.target.value)} />
                </Field>
                <Field field="supervisorPhone" label="Phone" required={team} error={errors.supervisorPhone}>
                  <input className={cn("input", errors.supervisorPhone && "input-error")} value={d.supervisorPhone} onChange={(e) => set("supervisorPhone", e.target.value)} inputMode="tel" />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-navy">
                Parent / guardian {minor ? <span className="text-sm font-medium text-orange-600">(required: you are under 18)</span> : <span className="font-normal text-navy/60">(optional)</span>}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field field="guardianName" label="Guardian name" required={minor} error={errors.guardianName}>
                  <input className={cn("input", errors.guardianName && "input-error")} value={d.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
                </Field>
                <Field field="guardianPhone" label="Guardian phone" required={minor} error={errors.guardianPhone}>
                  <input className={cn("input", errors.guardianPhone && "input-error")} value={d.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} inputMode="tel" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Field field="projectTitle" label="Project title" required error={errors.projectTitle}>
              <input className={cn("input", errors.projectTitle && "input-error")} value={d.projectTitle} onChange={(e) => set("projectTitle", e.target.value)} />
            </Field>
            <Field field="projectSummary" label="Short summary (100–300 words)" required error={errors.projectSummary}>
              <textarea rows={8} className={cn("input", errors.projectSummary && "input-error")} value={d.projectSummary} onChange={(e) => set("projectSummary", e.target.value)}
                placeholder="What problem does your project solve? How does it work? What have you done so far?" />
              <p className={cn("mt-1 text-right text-xs font-semibold", wc >= 100 && wc <= 300 ? "text-dob" : "text-navy/50")}>{wc} / 100–300 words</p>
            </Field>
            <Choice field="projectStage" label="Project stage" required options={PROJECT_STAGES} value={d.projectStage} onChange={(v) => set("projectStage", v)} error={errors.projectStage} />
            <Choice field="paperReady" label="Is your paper ready?" required options={PAPER_READY} value={d.paperReady} onChange={(v) => set("paperReady", v)} error={errors.paperReady}
              hint={d.paperReady === "Need help" ? "Great: DoB will guide you with the paper." : undefined} />

            <Field field="file" label="Upload a file (optional)" error={errors.file} hint="Project proposal, paper draft or photo. PDF or JPG, max 10 MB.">
              {file ? (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-royal-50/50 p-3 text-sm">
                  <FileUp className="size-5 shrink-0 text-royal" />
                  <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
                  <span className="shrink-0 text-navy/60">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button type="button" onClick={() => setFile(null)} className="grid size-8 place-items-center rounded-full hover:bg-white" aria-label="Remove file"><X className="size-4" /></button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line bg-royal-50/30 p-6 text-center text-sm hover:border-royal/50">
                  <FileUp className="size-7 text-royal" />
                  <span className="font-semibold text-royal">Choose a file</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      if (f && f.size > MAX_FILE) setErrors((x) => ({ ...x, file: "File is larger than 10 MB." }));
                      else { setErrors((x) => ({ ...x, file: "" })); setFile(f); }
                    }} />
                </label>
              )}
            </Field>

            <Field field="heardFrom" label="How did you hear about us?" error={errors.heardFrom}>
              <select className="input" value={d.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
                <option value="">Select (optional)</option>
                {HEARD_FROM.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>

            <div data-field="agree">
              <label className={cn("flex cursor-pointer gap-3 rounded-xl border p-4 text-sm leading-6", errors.agree ? "border-rose-400 bg-rose-50" : "border-line bg-royal-50/40")}>
                <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[#163496]" checked={d.agree} onChange={(e) => set("agree", e.target.checked)} />
                <span>
                  I confirm the information is correct and agree that Dreams of Bangladesh may contact me (and my guardian/supervisor) on WhatsApp, phone or email about BIESF 2026.
                  I understand that DoB runs the Bangladesh selection and that international judging and awards are decided by ICGI. <span className="text-rose-600">*</span>
                </span>
              </label>
              {errors.agree && <p className="field-error">{errors.agree}</p>}
            </div>

            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <Turnstile />
          </div>
        )}

        {formError && <p className="mt-6 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700" role="alert">{formError}</p>}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn btn-ghost" disabled={submitting}><ArrowLeft className="size-4" /> Back</button>
          ) : <span />}
          {step < 3 ? (
            <button type="submit" className="btn btn-primary btn-lg">Next <ArrowRight className="size-4" /></button>
          ) : (
            <button type="submit" className="btn btn-register btn-lg" disabled={submitting}>
              {submitting ? <><Loader2 className="size-4 animate-spin" /> Submitting…</> : <>Submit registration <Check className="size-4" /></>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ field, label, required, error, hint, className, children }: {
  field: string; label: string; required?: boolean; error?: string; hint?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div data-field={field} className={className}>
      <label className="label">{label} {required && <span className="text-rose-600">*</span>}</label>
      {children}
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="mt-1 text-xs text-navy/60">{hint}</p> : null}
    </div>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span className={cn("grid size-4 shrink-0 place-items-center rounded-full border-2", checked ? "border-royal" : "border-slate-300")}>
      {checked && <span className="size-2 rounded-full bg-royal" />}
    </span>
  );
}

function Choice({ field, label, options, value, onChange, required, error, hint }: {
  field: string; label: string; options: readonly string[]; value: string; onChange: (v: string) => void; required?: boolean; error?: string; hint?: string;
}) {
  return (
    <Field field={field} label={label} required={required} error={error} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="choice">
            <input type="radio" className="sr-only" name={field} checked={value === o} onChange={() => onChange(o)} />
            <Radio checked={value === o} /> {o}
          </label>
        ))}
      </div>
    </Field>
  );
}
