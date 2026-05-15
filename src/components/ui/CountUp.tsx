"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

interface CountUpProps {
    /** Final numeric value to count to */
    to: number;
    /** Optional suffix rendered after the number (e.g. "+") */
    suffix?: string;
    /** Tween duration in seconds (default 1.2) */
    duration?: number;
    /** ScrollTrigger start (default "top 85%") */
    triggerStart?: string;
}

/**
 * CountUp — tweens a number from 0 to `to` when scrolled into view.
 * The final rendered value matches `${Math.round(value)}${suffix}`.
 *
 * Reduced motion: renders the final value immediately, no animation.
 */
export function CountUp({
    to,
    suffix = "",
    duration = 1.2,
    triggerStart = "top 85%",
}: CountUpProps) {
    const elRef = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState<string>(`0${suffix}`);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) {
            setDisplay(`${to}${suffix}`);
            return;
        }

        registerGsap();
        const el = elRef.current;
        if (!el) return;

        // Guard against React Strict Mode double-init
        if (el.dataset.countUpDone === "true") return;
        el.dataset.countUpDone = "true";

        const obj = { v: 0 };
        const tween = gsap.to(obj, {
            v: to,
            duration,
            ease: "power2.out",
            onUpdate: () => setDisplay(`${Math.round(obj.v)}${suffix}`),
            scrollTrigger: {
                trigger: el,
                start: triggerStart,
                once: true,
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
        };
    }, [to, suffix, duration, triggerStart, prefersReduced]);

    return <span ref={elRef}>{display}</span>;
}
