"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ScanLine — a thin green scan-line that sweeps horizontally across
 * its children when they scroll into view. Inspired by a print scanner
 * bar passing over paper.
 *
 * The line is a narrow gradient bar (~40% width) that moves from
 * one side to the other, creating a scanner sweep effect.
 */
interface ScanLineProps {
    children: React.ReactNode;
    className?: string;
    /** Line color — default green */
    color?: string;
    /** Line thickness in px — default 2 */
    thickness?: number;
    /** Glow size in px — default 16 */
    glow?: number;
    /** Animation duration in seconds — default 1.0 */
    duration?: number;
    /** Delay after scroll trigger in seconds — default 0.2 */
    delay?: number;
}

export function ScanLine({
    children,
    className,
    color = "rgba(141, 198, 65, 0.5)",
    thickness = 2,
    glow = 16,
    duration = 1.0,
    delay = 0.2,
}: ScanLineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced || !barRef.current || !containerRef.current) return;
        registerGsap();

        const bar = barRef.current;
        const container = containerRef.current;

        // Check RTL
        const isRTL = document.documentElement.dir === "rtl";

        // Initial state: bar off-screen to the start side
        gsap.set(bar, {
            xPercent: isRTL ? 60 : -60,
            opacity: 0,
        });

        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                delay,
            })
                .to(bar, { opacity: 1, duration: 0.15 })
                .to(bar, {
                    xPercent: isRTL ? -60 : 60,
                    duration,
                    ease: "power2.inOut",
                }, "<0.05")
                .to(bar, { opacity: 0, duration: 0.2 }, ">-0.2");
        });

        return () => ctx.revert();
    }, [prefersReduced, color, thickness, glow, duration, delay]);

    return (
        <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
            {children}
            {/* Scan-line bar */}
            <div
                ref={barRef}
                className="absolute inset-y-0 pointer-events-none"
                style={{
                    left: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                aria-hidden
            >
                <div
                    style={{
                        width: "40%",
                        height: `${thickness}px`,
                        background: `linear-gradient(90deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`,
                        boxShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px rgba(141, 198, 65, 0.1)`,
                        borderRadius: thickness,
                    }}
                />
            </div>
        </div>
    );
}
