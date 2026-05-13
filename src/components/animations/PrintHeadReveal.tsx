"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * PrintHeadReveal — sweeps a thin green "print head" line over its children.
 *
 * Note on LCP: the children remain visible at all times so they are eligible
 * to be measured as the Largest Contentful Paint element on first paint.
 * An earlier version clipped the children to invisible during the scan
 * (clip-path inset 0 0 100% 0) which delayed LCP by `delay + duration` —
 * roughly 1.9s for the hero. The current version keeps content visible and
 * animates only the overlay line, so the visual still reads as a "print
 * head pass" without paying the LCP cost.
 */
interface PrintHeadRevealProps {
    children: React.ReactNode;
    className?: string;
    /** Delay before the scan line starts — default 0.2 */
    delay?: number;
    /** Scan duration in seconds — default 1.4 */
    duration?: number;
}

export function PrintHeadReveal({
    children,
    className,
    delay = 0.2,
    duration = 1.4,
}: PrintHeadRevealProps) {
    const lineRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        registerGsap();

        const line = lineRef.current;
        if (!line) return;

        gsap.set(line, { yPercent: -10, opacity: 1 });

        const tl = gsap.timeline({ delay });

        tl.to(line, {
            yPercent: 110,
            duration,
            ease: "none",
        });

        tl.to(line, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
        });

        return () => {
            tl.kill();
        };
    }, [prefersReduced, delay, duration]);

    // Reduced-motion: skip the scan-line entirely
    if (prefersReduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div className={cn("relative", className)}>
            {/* Children render normally — visible from first paint for fast LCP */}
            {children}

            {/* Decorative scan line layered above, doesn't affect LCP measurement */}
            <div
                ref={lineRef}
                className="absolute inset-x-0 top-0 h-[3px] z-10 pointer-events-none opacity-0"
                aria-hidden
            >
                <div className="w-full h-full bg-green" />
                <div
                    className="absolute inset-x-0 -top-2 h-7 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, transparent, rgba(141,198,65,0.25), transparent)",
                    }}
                />
            </div>
        </div>
    );
}
