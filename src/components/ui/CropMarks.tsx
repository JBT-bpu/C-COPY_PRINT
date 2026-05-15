"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * CropMarks — four registration crosshairs at the corners of a tray.
 * On scroll-in, they pulse from invisible to full opacity, then settle
 * to a subtle 0.18 opacity. A print-shop nod — registration marks are
 * what a press uses to align the inks.
 *
 * Reduced motion: just renders the marks at settled opacity, no pulse.
 */
interface CropMarksProps {
    /** Mark color (default brand green) */
    color?: string;
    /** Margin in px from the corner (default 12) */
    inset?: number;
    /** Mark arm length in px (default 14) */
    size?: number;
}

export function CropMarks({
    color = "var(--color-green-deep)",
    inset = 24,
    size = 14,
}: CropMarksProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        registerGsap();

        const el = containerRef.current;
        if (!el) return;
        if (el.dataset.cropMarksDone === "true") return;
        el.dataset.cropMarksDone = "true";

        const marks = el.querySelectorAll<HTMLSpanElement>(".crop-mark");
        if (!marks.length) return;

        gsap.set(marks, { opacity: 0, scale: 0.6 });

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(marks, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(marks, {
                            opacity: 0.18,
                            duration: 0.6,
                            delay: 0.2,
                            ease: "power2.inOut",
                        });
                    },
                });
            },
        });

        return () => {
            trigger.kill();
        };
    }, [prefersReduced]);

    const arm = `${size}px`;
    const thick = "2px";

    return (
        <div
            ref={containerRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
        >
            {/* Four corners, each rendered as two short bars forming a crosshair */}
            {[
                { className: "top-0 start-0", h: "top-0 start-0", v: "top-0 start-0" },
                { className: "top-0 end-0", h: "top-0 end-0", v: "top-0 end-0" },
                { className: "bottom-0 start-0", h: "bottom-0 start-0", v: "bottom-0 start-0" },
                { className: "bottom-0 end-0", h: "bottom-0 end-0", v: "bottom-0 end-0" },
            ].map((corner, i) => (
                <span
                    key={i}
                    className={cn(
                        "crop-mark absolute block",
                        prefersReduced ? "opacity-[0.18]" : "opacity-0",
                        corner.className
                    )}
                    style={{
                        width: arm,
                        height: arm,
                        margin: inset,
                    }}
                >
                    {/* Horizontal arm */}
                    <span
                        className={cn("absolute block", corner.h)}
                        style={{
                            width: arm,
                            height: thick,
                            background: color,
                        }}
                    />
                    {/* Vertical arm */}
                    <span
                        className={cn("absolute block", corner.v)}
                        style={{
                            width: thick,
                            height: arm,
                            background: color,
                        }}
                    />
                </span>
            ))}
        </div>
    );
}
