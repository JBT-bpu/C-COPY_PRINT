import { BrandIcon } from "@/components/ui/BrandIcon";

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
            className="relative py-10 md:py-16 px-3 md:px-6"
        >
            {/* Lime-green tray panel — services cards float on it (matches 11.png) */}
            <div className="max-w-7xl mx-auto bg-green rounded-[36px] md:rounded-[60px] px-6 md:px-12 py-12 md:py-16">
                {/* Section head — kicker + title on the start side, blurb on the end side */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">
                    <div>
                        <p className="text-ink/70 font-extrabold text-sm tracking-wide mb-2">
                            שירותי דפוס מתקדמים
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.05] text-ink max-w-2xl">
                            כל מה שהעסק צריך — במקום אחד
                        </h2>
                    </div>
                    <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-md">
                        כרטיסים, פליירים, שילוט, הדפסות בפורמט רחב, תוכניות בניין, קאפה,
                        אלוקובונד ועוד.
                    </p>
                </div>

                {/* 4 → 3 → 2 → 1 col responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {SERVICES.map((s) => (
                        <a
                            key={s.title}
                            href={s.href}
                            className={[
                                "group relative block min-h-[220px] p-7 rounded-[28px] overflow-hidden",
                                "bg-white/95 border border-ink/[0.06]",
                                "shadow-[0_16px_40px_rgba(15,23,42,0.10)]",
                                "transition-all duration-300 ease-[var(--ease-premium)]",
                                "hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(0,0,0,0.16)] hover:border-green/60",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
                            ].join(" ")}
                        >
                            {/* Hover crop-mark frame */}
                            <span
                                aria-hidden
                                className="absolute inset-3 rounded-[22px] border border-green/0 group-hover:border-green/45 transition-colors duration-300 pointer-events-none"
                            />

                            <div className="mb-5 flex size-12 items-center justify-center rounded-[18px] bg-linear-to-br from-green/20 to-green/5 shadow-[inset_0_0_0_1px_rgba(141,198,65,0.24)]">
                                <BrandIcon name={s.icon} className="size-7" />
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-ink">
                                {s.title}
                            </h3>

                            <p className="text-sm md:text-[15px] leading-relaxed text-ink-soft">
                                {s.description}
                            </p>

                            <span
                                aria-hidden
                                className="absolute bottom-6 start-7 text-green-deep font-extrabold text-xl transition-transform duration-300 group-hover:-translate-x-1"
                            >
                                ←
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
