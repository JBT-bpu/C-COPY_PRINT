/**
 * How it works — 5 numbered steps in a clean grid. Matches
 * ccopy_maximum_wow_build_plan.md §5 (the WOW plan's 5-step flow)
 * and the demo's clean numbered-list aesthetic. The previous GSAP
 * pin-and-scroll behavior was dropped to keep this rebuild simple
 * and on-spec; can be added back later behind a feature flag.
 */

type Step = {
    n: string;
    title: string;
    description: string;
};

const STEPS: Step[] = [
    {
        n: "01",
        title: "שולחים קובץ או בקשה",
        description: "דרך האתר, וואטסאפ או בסניף — אנחנו מקבלים את כל סוגי הקבצים.",
    },
    {
        n: "02",
        title: "בודקים התאמה להדפסה",
        description: "רזולוציה, צבעים, בליד והכנת קובץ — בדיקה מקצועית לפני אישור.",
    },
    {
        n: "03",
        title: "הצעת מחיר ואישור",
        description: "תוך שעה בשעות העבודה. תיאום זמני אספקה, חומרים וגימור.",
    },
    {
        n: "04",
        title: "מדפיסים ומבצעים גימור",
        description: "HP Indigo, UV, פורמט רחב — איכות HD, גימור מקצועי במקום.",
    },
    {
        n: "05",
        title: "איסוף עצמי או שליח",
        description: "אסיפה מאחד הסניפים, שליח לגוש דן באותו יום, שאר הארץ ב-48 שעות.",
    },
];

export function Process() {
    return (
        <section
            id="process"
            aria-label="התהליך"
            className="relative py-20 md:py-28 px-5 md:px-10"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">
                    <div>
                        <p className="text-green-deep font-extrabold text-sm tracking-wide mb-2">
                            איך זה עובד
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] text-ink max-w-2xl">
                            מקובץ ראשון ועד מוצר ביד — חמישה צעדים
                        </h2>
                    </div>
                    <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-sm">
                        תהליך עבודה בנוי לדיוק. כל שלב מותאם להבטיח תוצאת דפוס מקצועית
                        ללא הפתעות.
                    </p>
                </div>

                <div className="relative">
                    {/* Dashed connector behind the steps on desktop */}
                    <div
                        aria-hidden
                        className="hidden lg:block absolute top-9 inset-x-12 h-px border-t-2 border-dashed border-green/40 pointer-events-none"
                    />

                    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 relative">
                        {STEPS.map((step) => (
                            <li
                                key={step.n}
                                className={[
                                    "relative bg-white/95 border border-ink/[0.06]",
                                    "rounded-[24px] p-6 min-h-[200px]",
                                    "shadow-[0_16px_40px_rgba(15,23,42,0.10)]",
                                ].join(" ")}
                            >
                                <div className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-green to-green-soft text-ink font-extrabold text-base mb-4 shadow-[0_8px_18px_rgba(141,198,65,0.4)]">
                                    {step.n}
                                </div>
                                <h3 className="text-lg font-bold tracking-tight mb-1.5 text-ink">
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-ink-soft">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
