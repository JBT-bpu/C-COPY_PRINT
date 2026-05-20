"use client";

import { useState, useRef } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { PRIMARY_BRANCH, phoneHref } from "@/content/branches";
import { MagneticWrapper } from "@/components/animations/MagneticWrapper";
import { TitleLine } from "@/components/animations/TitleLine";
import { CropMarks } from "@/components/ui/CropMarks";
import { cn } from "@/lib/utils";

/**
 * Quote section — combined upload + form on a dark rounded card matching
 * ccopy_maximum_wow_html_demo.html §quote and §7 of the build plan.
 *
 * Replaces the separate CTA + Upload sections from the old layout.
 * The dark card is wrapped by a large rounded green "support shape"
 * (the build plan calls for "large rounded green support shape behind
 * form"), reusing the body's lime green that's bleeding through.
 */

type FormData = {
    name: string;
    phone: string;
    email: string;
    kind: string;
    quantity: string;
    message: string;
    honeypot: string;
    fileName: string;
};

const JOB_KINDS = [
    "כרטיסי ביקור",
    "פליירים / פוסטרים",
    "חוברות / קטלוגים",
    "שלטים / פורמט רחב",
    "אריזות / מארזים",
    "מכון העתקות",
    "אחר",
];

export function Quote() {
    const [form, setForm] = useState<FormData>({
        name: "",
        phone: "",
        email: "",
        kind: "",
        quantity: "",
        message: "",
        honeypot: "",
        fileName: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const change = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.honeypot) return;
        setStatus("loading");
        setErrorMsg("");
        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    service: form.kind,
                    message: `כמות: ${form.quantity}\n${form.message}${form.fileName ? `\nקובץ מצורף: ${form.fileName}` : ""
                        }`,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "שגיאה בשליחת הטופס");
            }
            setStatus("success");
            setForm({
                name: "",
                phone: "",
                email: "",
                kind: "",
                quantity: "",
                message: "",
                honeypot: "",
                fileName: "",
            });
        } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "שגיאה לא צפויה");
        }
    };

    const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) setForm((prev) => ({ ...prev, fileName: f.name }));
    };

    return (
        <section
            id="quote"
            aria-label="הצעת מחיר"
            className="relative py-8 md:py-16 px-3 md:px-6"
        >
            {/* Outer green frame — quotes the "large rounded green support shape" from 11.png */}
            <div className="max-w-6xl mx-auto bg-green rounded-[28px] md:rounded-[52px] p-2 md:p-5">
                <div
                    className={cn(
                        "relative rounded-[24px] md:rounded-[40px] overflow-hidden",
                        "bg-white text-ink",
                        "p-5 md:p-14",
                        "shadow-xl shadow-ink/10"
                    )}
                >
                    <CropMarks inset={30} />
                    {/* Subtle green glow behind form */}
                    <div
                        className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-green/10 blur-[100px] pointer-events-none"
                        aria-hidden
                    />
                    <div
                        className="absolute -bottom-32 -start-32 w-96 h-96 rounded-full bg-green-deep/10 blur-[100px] pointer-events-none"
                        aria-hidden
                    />

                    <div className="relative">
                        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-10 items-start">
                            {/* Left column — copy + contact methods */}
                            <div>
                                <p className="text-green-deep font-extrabold text-sm md:text-base tracking-wide mb-3">
                                    הצעת מחיר מהירה
                                </p>
                                <TitleLine>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-ink max-w-2xl text-balance mb-5">
                                        שלחו את הפרטים — נחזור תוך שעה
                                    </h2>
                                </TitleLine>
                                <p className="text-ink-soft text-base md:text-lg leading-relaxed mb-7">
                                    ספרו לנו על הפרויקט וצרפו את הקובץ אם יש לכם.
                                    הצוות שלנו יבדוק את ההתאמה ויחזור עם הצעה מותאמת.
                                </p>

                                <div className="space-y-3">
                                    <a
                                        href={phoneHref(PRIMARY_BRANCH.phone)}
                                        dir="ltr"
                                        className="inline-flex items-center gap-2.5 text-ink-soft hover:text-green-deep transition-colors"
                                    >
                                        <BrandIcon name="phone-contact" className="size-4" />
                                        {PRIMARY_BRANCH.phone}
                                    </a>
                                    <br />
                                    <a
                                        href={`mailto:${PRIMARY_BRANCH.email}`}
                                        dir="ltr"
                                        className="inline-flex items-center gap-2.5 text-ink-soft hover:text-green-deep transition-colors"
                                    >
                                        <BrandIcon name="email-envelope" className="size-4" />
                                        {PRIMARY_BRANCH.email}
                                    </a>
                                    <br />
                                    <a
                                        href="https://wa.me/972723316655"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2.5 text-ink-soft hover:text-green-deep transition-colors"
                                    >
                                        <BrandIcon name="whatsapp" className="size-4" />
                                        וואטסאפ
                                    </a>
                                </div>
                            </div>

                            {/* Right column — form */}
                            {status === "success" ? (
                                <div className="grid place-items-center min-h-[300px] text-center">
                                    <div>
                                        <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-green text-ink shadow-[0_0_40px_rgba(141,198,65,0.5)]">
                                            <BrandIcon name="approved-check" className="size-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            הטופס נשלח בהצלחה!
                                        </h3>
                                        <p className="text-ink-soft">נחזור אליכם בהקדם.</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Honeypot */}
                                    <input
                                        type="text"
                                        name="honeypot"
                                        value={form.honeypot}
                                        onChange={change}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                        className="absolute opacity-0 pointer-events-none"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field
                                            id="q-name"
                                            label="שם מלא *"
                                            name="name"
                                            value={form.name}
                                            onChange={change}
                                            required
                                            placeholder="ישראל ישראלי"
                                        />
                                        <Field
                                            id="q-phone"
                                            label="טלפון *"
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={change}
                                            required
                                            dir="ltr"
                                            placeholder="050-1234567"
                                        />
                                        <Field
                                            id="q-email"
                                            label="אימייל *"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={change}
                                            required
                                            dir="ltr"
                                            placeholder="israel@example.com"
                                        />
                                        <div>
                                            <label
                                                htmlFor="q-quantity"
                                                className="block text-xs font-semibold text-ink-soft mb-1.5"
                                            >
                                                כמות
                                            </label>
                                            <input
                                                id="q-quantity"
                                                name="quantity"
                                                type="text"
                                                value={form.quantity}
                                                onChange={change}
                                                placeholder="100, 500, 1000..."
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {/* Job kind */}
                                    <div>
                                        <label
                                            htmlFor="q-kind"
                                            className="block text-xs font-semibold text-ink-soft mb-1.5"
                                        >
                                            סוג עבודה
                                        </label>
                                        <select
                                            id="q-kind"
                                            name="kind"
                                            value={form.kind}
                                            onChange={change}
                                            className={cn(inputClass, "appearance-none")}
                                        >
                                            <option value="">בחרו סוג עבודה</option>
                                            {JOB_KINDS.map((k) => (
                                                <option key={k} value={k}>
                                                    {k}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label
                                            htmlFor="q-message"
                                            className="block text-xs font-semibold text-ink-soft mb-1.5"
                                        >
                                            פרטים נוספים
                                        </label>
                                        <textarea
                                            id="q-message"
                                            name="message"
                                            value={form.message}
                                            onChange={change}
                                            rows={3}
                                            placeholder="גודל, חומר, גימור, תאריך נדרש..."
                                            className={cn(inputClass, "resize-none")}
                                        />
                                    </div>

                                    {/* File upload */}
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={onFile}
                                            className="hidden"
                                            accept=".pdf,.ai,.psd,.indd,.jpg,.jpeg,.png"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2.5",
                                                "rounded-2xl px-4 py-3.5 text-sm font-semibold",
                                                "bg-cream/40 border border-dashed border-line",
                                                "hover:bg-cream/60 hover:border-green hover:text-green-deep",
                                                "transition-colors duration-200"
                                            )}
                                        >
                                            <BrandIcon name="upload-file" className="size-4" />
                                            {form.fileName
                                                ? `קובץ: ${form.fileName}`
                                                : "צרפו קובץ להדפסה (אופציונלי)"}
                                        </button>
                                    </div>

                                    {/* Error */}
                                    {status === "error" && (
                                        <div
                                            className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-red-700 text-sm"
                                            role="alert"
                                            aria-live="polite"
                                        >
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <MagneticWrapper strength={0.2}>
                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className={cn(
                                                "w-full inline-flex items-center justify-center gap-2 rounded-pill",
                                                "bg-linear-to-br from-green to-green-soft text-ink",
                                                "px-7 py-4 text-base font-extrabold",
                                                "shadow-[0_14px_30px_rgba(141,198,65,0.35)]",
                                                "hover:-translate-y-0.5 transition-transform duration-300",
                                                "active:scale-[0.97]",
                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                            )}
                                        >
                                            {status === "loading" ? (
                                                <>
                                                    <span className="size-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                                    שולח...
                                                </>
                                            ) : (
                                                <>
                                                    קבלו הצעת מחיר
                                                    <span aria-hidden>←</span>
                                                </>
                                            )}
                                        </button>
                                    </MagneticWrapper>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const inputClass = cn(
    "ink-underline w-full rounded-2xl bg-cream/60 border border-line",
    "px-4 py-3 text-ink placeholder:text-ink-soft/40",
    "focus:outline-none focus:border-green focus:ring-2 focus:ring-green/20",
    "transition-colors duration-200"
);

type FieldProps = {
    id: string;
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    dir?: "ltr" | "rtl";
    placeholder?: string;
};

function Field({ id, label, name, type = "text", value, onChange, required, dir, placeholder }: FieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-semibold text-ink-soft mb-1.5">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                dir={dir}
                placeholder={placeholder}
                className={cn(inputClass, dir === "ltr" && "text-left")}
                suppressHydrationWarning
            />
        </div>
    );
}
