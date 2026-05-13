"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * PrinterTrayReveal — children slide up into view like printed
 * sheets emerging from a printer tray.
 *
 * Each direct child is treated as a "printed sheet" and is
 * staggered automatically.
 */
interface PrinterTrayRevealProps {
    children: React.ReactNode;
    className?: string;
    /** Stagger between each child in seconds — default 0.12 */
    stagger?: number;
    /** Animation duration per child — default 0.8 */
    duration?: number;
    /** Extra y offset (px) — default 60 */
    offset?: number;
}

export function PrinterTrayReveal({
    children,
    className,
    stagger = 0.12,
    duration = 0.8,
    offset = 60,
}: PrinterTrayRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        registerGsap();

        const container = containerRef.current;
        if (!container) return;

        const sheets = container.querySelectorAll<HTMLElement>(".printer-sheet");
        if (!sheets.length) return;

        // Set initial states
        gsap.set(sheets, {
            y: offset,
            opacity: 0,
            rotate: 0.3,
        });

        const ctx = gsap.context(() => {
            gsap.to(sheets, {
                y: 0,
                opacity: 1,
                rotate: 0,
                duration,
                stagger,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    once: true,
                },
            });
        });

        return () => ctx.revert();
    }, [prefersReduced, stagger, duration, offset]);

    // Reduced-motion: just render children
    if (prefersReduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div ref={containerRef} className={cn(className)}>
            {children}
        </div>
    );
}

/**
 * PrinterSheet — wrapper for each "printed sheet" item.
 * Must be a direct child of PrinterTrayReveal.
 */
interface PrinterSheetProps {
    children: React.ReactNode;
    className?: string;
}

export function PrinterSheet({ children, className }: PrinterSheetProps) {
    return (
        <div className={cn("printer-sheet", className)}>
            {children}
        </div>
    );
}
