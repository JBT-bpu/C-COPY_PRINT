"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
    children: React.ReactNode;
    className?: string;
    /** Animation direction */
    direction?: "up" | "down" | "left" | "right" | "none";
    /** Distance in pixels to travel */
    distance?: number;
    /** Duration in seconds */
    duration?: number;
    /** Delay in seconds */
    delay?: number;
    /** GSAP ease */
    ease?: string;
    /** When to trigger (0–1 viewport position) */
    start?: string;
    /** Stagger children (if multiple) */
    stagger?: number;
    /** Whether to pin */
    pin?: boolean;
};

export function ScrollReveal({
    children,
    className,
    direction = "up",
    distance = 60,
    duration = 1,
    delay = 0,
    ease = "power3.out",
    start = "top 85%",
    stagger = 0,
    pin = false,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;

        registerGsap();

        const el = ref.current;
        if (!el) return;

        // Guard against React Strict Mode double-invocation. Without this,
        // gsap.from()'s "capture current as final" semantics combine with
        // the cleanup-kill to leave elements stuck at the FROM state when
        // the effect re-runs.
        if (el.dataset.scrollRevealDone === "true") return;
        el.dataset.scrollRevealDone = "true";

        const axis = direction === "up" || direction === "down" ? "y" : "x";
        const sign =
            direction === "up" ? 1 : direction === "down" ? -1 : direction === "left" ? 1 : direction === "right" ? -1 : 0;

        const fromVars =
            direction === "none"
                ? { opacity: 0 }
                : { opacity: 0, [axis]: sign * distance };
        const toVars =
            direction === "none"
                ? { opacity: 1 }
                : { opacity: 1, [axis]: 0 };

        const targets = stagger > 0 ? el.children : el;

        // fromTo (not from) — explicit endpoints make the tween idempotent
        // and survive cleanup → re-create cycles without getting "stuck."
        const anim = gsap.fromTo(targets, fromVars, {
            ...toVars,
            duration,
            delay,
            ease,
            stagger,
            scrollTrigger: {
                trigger: el,
                start,
                toggleActions: "play none none none",
                pin,
            },
        });

        return () => {
            anim.scrollTrigger?.kill();
            // Don't kill the tween — let it complete in case Strict Mode
            // re-invokes; the dataset guard prevents a second run anyway.
        };
    }, [prefersReduced, direction, distance, duration, delay, ease, start, stagger, pin]);

    return (
        <div
            ref={ref}
            className={cn(
                prefersReduced ? "" : "will-change-transform",
                className
            )}
        >
            {children}
        </div>
    );
}
