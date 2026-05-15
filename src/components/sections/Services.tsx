"use client";

import { useRef } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ScanLine } from "@/components/animations/ScanLine";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CropMarks } from "@/components/ui/CropMarks";
import { useIsTouchDevice } from "@/lib/motion";

/**
 * Main service categories — flat 4-col grid matching
 * ccopy_maximum_wow_html_demo.html §services section.
 *
 * No tabs, no sub-services on the homepage — just the 6 top-level
 * categories per ccopy_maximum_wow_build_plan.md §2. Each card is a
 * white-translucent panel that floats on the cream paper / lime stroke
 * background behind it.
 *
 * Icons use the brand 3D-style sliced from icons.png (BrandIcon).
 */

type Service = {
    title: string;
    description: string;
    icon: string; // brand icon name
    href: string;
};

const SERVICES: Service[] = [
    {
        title: "בית דפוס",
        description: "חוברות, ספרים, פליירים, כרטיסי ביקור, קטלוגים ומוצרי שיווק.",
        icon: "digital-printer",
        href: "/services/print-house",
    },
    {
        title: "מכון העתקות",
        description: "פלוטים, תוכניות בניין, שרטוטים, סריקות וצילומי מסמכים.",
        icon: "document-page",
        href: "/services/copy-center",
    },
    {
        title: "פורמט רחב",
        description: "פוסטרים, רולאפים, שמשוניות, טפטים, פלוטרים ותצוגות.",
        icon: "wide-format-printer",
        href: "/services/wide-format",
    },
    {
        title: "משטחים קשיחים",
        description: "אלוקובונד, קאפה, פרספקס, PVC, קנבס, עץ ומגנטים.",
        icon: "signage-board",
        href: "/services/rigid-surfaces",
    },
    {
        title: "עיצוב וגרפיקה",
        description: "עיצוב לדפוס, התאמת צבעים, טיפוגרפיה, עיצוב לוגו והכנת קובץ.",
        icon: "design-tools",
        href: "/services/design",
    },
    {
        title: "שירותים לסטודנטים",
        description: "הדפסת תזות, צילום סיכומים, כריכות אקדמיות, פוסטרים למצגות.",
        icon: "notebook",
        href: "/services/students",
    },
];

export function Services() {
    return (
        <section
            id="services"
            aria-label="שירותים"
            className="relative py-8 md:py-16 px-3 md:px-6"
        >
            {/* Lime-green tray panel — services cards float on it (matches 11.png) */}
            <div className="relative max-w-7xl mx-auto bg-green rounded-[28px] md:rounded-[60px] px-4 md:px-12 py-8 md:py-16">
                <CropMarks color="var(--color-ink)" />
                {/* Section head — kicker + title on the start side, blurb on the end side */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-12">
                    <div>
                        <p className="text-ink/70 font-extrabold text-sm md:text-base tracking-wide mb-2">
                            שירותי דפוס מתקדמים
                        </p>
                        <ScanLine>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[58px] font-extrabold tracking-tight leading-[1.05] text-ink max-w-2xl">
                                כל מה שהעסק צריך — במקום אחד
                            </h2>
                        </ScanLine>
                    </div>
                    <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-md">
                        כרטיסים, פליירים, שילוט, הדפסות בפורמט רחב, תוכניות בניין, קאפה,
                        אלוקובונד ועוד.
                    </p>
                </div>

                {/* 4 → 3 → 2 → 1 col responsive grid */}
                <ScrollReveal stagger={0.08} direction="up" distance={40} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {SERVICES.map((s) => (
                        <ServiceCard key={s.title} service={s} />
                    ))}
                </ScrollReveal>
            </div>
        </section>
    );
}

/**
 * Service card with cursor-following green ink wash on desktop hover.
 * Tracks mousemove via CSS variables (no React re-render per move) and
 * is gated off on touch devices (no hover state to begin with).
 */
function ServiceCard({ service }: { service: Service }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const isTouch = useIsTouchDevice();

    function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
        if (isTouch) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
    }

    return (
        <a
            ref={ref}
            href={service.href}
            onMouseMove={handleMouseMove}
            className={[
                "service-card group relative block min-h-[180px] p-5 sm:p-7 rounded-[24px] sm:rounded-[28px] overflow-hidden",
                "bg-white/95 border border-ink/[0.06]",
                "shadow-[0_16px_40px_rgba(15,23,42,0.10)]",
                "transition-all duration-300 ease-[var(--ease-premium)]",
                "hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(0,0,0,0.16)] hover:border-green/60",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
            ].join(" ")}
        >
            {/* Ink wash — radial gradient that follows cursor */}
            {!isTouch && (
                <span
                    aria-hidden
                    className="service-card-wash absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
            )}

            {/* Hover crop-mark frame */}
            <span
                aria-hidden
                className="absolute inset-3 rounded-[22px] border border-green/0 group-hover:border-green/45 transition-colors duration-300 pointer-events-none"
            />

            <div className="relative mb-5 flex size-12 items-center justify-center rounded-[18px] bg-linear-to-br from-green/20 to-green/5 shadow-[inset_0_0_0_1px_rgba(141,198,65,0.24)]">
                <BrandIcon name={service.icon} className="size-7" />
            </div>

            <h3 className="relative text-xl md:text-2xl font-bold tracking-tight mb-2 text-ink">
                {service.title}
            </h3>

            <p className="relative text-sm md:text-[15px] leading-relaxed text-ink-soft">
                {service.description}
            </p>

            <span
                aria-hidden
                className="absolute bottom-6 start-7 text-green-deep font-extrabold text-xl transition-transform duration-300 group-hover:-translate-x-1"
            >
                ←
            </span>
        </a>
    );
}
