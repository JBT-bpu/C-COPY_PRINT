"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { ScanLine } from "@/components/animations/ScanLine";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CropMarks } from "@/components/ui/CropMarks";
import { cn } from "@/lib/utils";

/**
 * Tiny helper: register a ScrollTrigger that runs `from` → `to` on enter.
 * Returns a ref to attach to the element. Honors prefers-reduced-motion.
 */
function useConstructOnEnter(
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    triggerStart = "top 85%"
) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        registerGsap();
        const el = ref.current;
        if (!el) return;
        if (el.dataset.constructDone === "true") return;
        el.dataset.constructDone = "true";

        gsap.set(el, fromVars);

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: triggerStart,
            once: true,
            onEnter: () => {
                gsap.to(el, { ...toVars, ease: "power2.out" });
            },
        });

        return () => {
            trigger.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefersReduced]);

    return ref;
}

/**
 * Popular products — 4 cards with CSS-drawn sample visuals (no real
 * photography yet). Matches ccopy_maximum_wow_html_demo.html §products
 * with the .sample-box, .sample-roll, .sample-card, .sample-sign mockups.
 *
 * Each .visual block is a small simulated product preview built with
 * absolutely-positioned divs + gradients — drop-in replaceable with real
 * photography later.
 */

type Product = {
    title: string;
    description: string;
    visual: "box" | "roll" | "card" | "sign";
};

const PRODUCTS: Product[] = [
    {
        title: "אריזות וקופסאות",
        description: "מארזי מותג, קופסאות פרימיום, תוויות וקופסאות מבריסטול.",
        visual: "box",
    },
    {
        title: "רולאפים ושמשוניות",
        description: "רול-אפים, שמשוניות חוץ ופנים, מתקני תצוגה לתערוכות.",
        visual: "roll",
    },
    {
        title: "כרטיסי ביקור",
        description: "Premium, מבריסטול, מט, למינציה, חיתוך מיוחד.",
        visual: "card",
    },
    {
        title: "שלטים ופוסטרים",
        description: "פורמט רחב, פוסטרים אקדמיים, שלטי חוץ ופנים.",
        visual: "sign",
    },
];

function SampleBox() {
    // Unfolds: starts flat (scaleY 0 from bottom), unrolls to full height.
    const ref = useConstructOnEnter(
        { scaleY: 0, transformOrigin: "50% 100%", opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.65 }
    );
    return (
        <div
            ref={ref}
            aria-hidden
            className={cn(
                "absolute w-[120px] h-[72px] rounded-[10px]",
                "rotate-[-10deg] start-[38px] top-[28px]",
                "shadow-[0_18px_28px_rgba(0,0,0,.16)]",
                "border-b-[14px] border-green",
                "bg-linear-to-br from-white to-[#e7eadf]"
            )}
        />
    );
}

function SampleRoll() {
    // Unrolls: starts collapsed (scaleX 0 from start side), unrolls to full width.
    const ref = useConstructOnEnter(
        { scaleX: 0, transformOrigin: "100% 50%", opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7 }
    );
    return (
        <div
            ref={ref}
            aria-hidden
            className={cn(
                "absolute w-[70px] h-[94px] rounded-[12px]",
                "rotate-[7deg] start-[70px] top-[10px]",
                "shadow-[0_18px_28px_rgba(0,0,0,.16)]"
            )}
            style={{
                background:
                    "linear-gradient(90deg, var(--color-green), #fff 38%, #222 40%, #111 100%)",
            }}
        />
    );
}

function SampleCard() {
    // Flips into place: starts rotated + scaled down, lands flat.
    const ref = useConstructOnEnter(
        { scale: 0.7, rotateY: -45, opacity: 0 },
        { scale: 1, rotateY: 0, opacity: 1, duration: 0.55 }
    );
    return (
        <div
            ref={ref}
            aria-hidden
            className={cn(
                "absolute w-[110px] h-[68px] rounded-[8px]",
                "rotate-[8deg] start-[44px] top-[28px]",
                "shadow-[0_18px_28px_rgba(0,0,0,.16)]"
            )}
            style={{
                background:
                    "linear-gradient(135deg, #fff 0 68%, var(--color-green) 69%)",
            }}
        />
    );
}

function SampleSign() {
    // Plate stamps in first, then green underline strokes in from the start side.
    const plateRef = useConstructOnEnter(
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45 }
    );
    const underlineRef = useConstructOnEnter(
        { scaleX: 0, transformOrigin: "100% 50%" },
        { scaleX: 1, duration: 0.5, delay: 0.3 }
    );
    return (
        <>
            <div
                ref={plateRef}
                aria-hidden
                className={cn(
                    "absolute w-[140px] h-[60px] rounded-[8px]",
                    "rotate-[-3deg] start-[30px] top-[36px]",
                    "shadow-[0_18px_28px_rgba(0,0,0,.18)]",
                    "bg-ink"
                )}
            />
            <div
                ref={underlineRef}
                aria-hidden
                className={cn(
                    "absolute w-[110px] h-[10px] rounded-full",
                    "start-[45px] top-[60px] bg-green"
                )}
            />
        </>
    );
}

const VISUAL_MAP = {
    box: <SampleBox />,
    roll: <SampleRoll />,
    card: <SampleCard />,
    sign: <SampleSign />,
};

export function Products() {
    return (
        <section
            id="products"
            aria-label="מוצרים נבחרים"
            className="relative py-12 md:py-28 px-4 md:px-10"
        >
            <div className="relative max-w-7xl mx-auto p-5 md:p-14 rounded-[28px] md:rounded-[44px] bg-white border-[10px] md:border-[22px] border-green shadow-[0_10px_0_0_var(--color-green-deep),0_30px_80px_rgba(141,198,65,0.30)]">
                <CropMarks />
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-12">
                    <div>
                        <p className="text-green-deep font-extrabold text-sm md:text-base tracking-wide mb-2">
                            מוצרים נבחרים
                        </p>
                        <ScanLine>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-ink max-w-2xl">
                                דוגמאות דפוס שמרגישות כמו מוצר אמיתי
                            </h2>
                        </ScanLine>
                    </div>
                    <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-md">
                        הכרטיסים נראים כמו דוגמאות מודפסות שיוצאות ממכונה ונכנסות לתוך
                        מסלול ירוק.
                    </p>
                </div>

                <ScrollReveal stagger={0.08} direction="up" distance={40} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {PRODUCTS.map((p) => (
                        <article
                            key={p.title}
                            className={cn(
                                "group relative min-h-[200px] rounded-[22px] sm:rounded-[28px] overflow-hidden",
                                "bg-white/95 border border-ink/[0.06]",
                                "shadow-[0_16px_40px_rgba(15,23,42,0.10)]",
                                "transition-transform duration-300 hover:-translate-y-2"
                            )}
                        >
                            {/* Visual area — CSS-drawn sample stand-in */}
                            <div className="relative m-3.5 h-[118px] rounded-[22px] overflow-hidden bg-linear-to-br from-[#e8ece4] to-white">
                                {VISUAL_MAP[p.visual]}
                            </div>

                            {/* Text */}
                            <div className="px-6 pb-6">
                                <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1.5 text-ink">
                                    {p.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-ink-soft">
                                    {p.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </ScrollReveal>
            </div>
        </section>
    );
}
