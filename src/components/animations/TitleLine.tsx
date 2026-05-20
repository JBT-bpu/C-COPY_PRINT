"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LineColor = "green" | "white";

interface TitleLineProps {
    children: React.ReactNode;
    className?: string;
    /** Sweep color — use "white" on green backgrounds (e.g. Services lime tray). */
    color?: LineColor;
}

const SWEEP_DURATION = 1.5;

const PALETTES = {
    green: {
        hot: "rgba(141, 198, 65, 0.95)",
        mid: "rgba(141, 198, 65, 0.8)",
        trail: "rgba(141, 198, 65, 0.55)",
        glow: "rgba(141, 198, 65, 0.55)",
        soft: "rgba(141, 198, 65, 0.18)",
    },
    white: {
        hot: "rgba(255, 255, 255, 0.95)",
        mid: "rgba(255, 255, 255, 0.85)",
        trail: "rgba(255, 255, 255, 0.6)",
        glow: "rgba(255, 255, 255, 0.55)",
        soft: "rgba(255, 255, 255, 0.2)",
    },
};

/**
 * TitleLine — refined scanner sweep that sits BELOW the title.
 *
 * Same anchor (below the title block) for every section regardless of
 * whether the title is one line or two, so the decoration reads as a
 * consistent set across the page. Bar width is clamped (180–320 px) so
 * short and long titles get the same visual weight.
 *
 * RTL-aware: sweep direction follows `document.documentElement.dir`.
 */
export function TitleLine({
    children,
    className,
    color = "green",
}: TitleLineProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (
            prefersReduced ||
            !wrapperRef.current ||
            !barRef.current ||
            !trailRef.current
        )
            return;
        registerGsap();

        const wrapper = wrapperRef.current;
        const bar = barRef.current;
        const trail = trailRef.current;
        const isRTL = document.documentElement.dir === "rtl";

        gsap.set(bar, { xPercent: isRTL ? 70 : -70, opacity: 0 });
        gsap.set(trail, {
            scaleX: 0,
            transformOrigin: isRTL ? "100% 50%" : "0% 50%",
            opacity: 0,
        });

        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                delay: 0.15,
            })
                .to(
                    [bar, trail],
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                )
                .to(
                    bar,
                    {
                        xPercent: isRTL ? -70 : 70,
                        duration: SWEEP_DURATION,
                        ease: "power3.inOut",
                    },
                    "<+0.05"
                )
                .to(
                    trail,
                    { scaleX: 1, duration: SWEEP_DURATION, ease: "power3.inOut" },
                    "<"
                )
                .to(bar, { opacity: 0, duration: 0.6, ease: "sine.out" }, ">")
                .to(trail, { opacity: 0, duration: 1.2, ease: "sine.out" }, "<");
        });

        return () => ctx.revert();
    }, [prefersReduced]);

    const palette = PALETTES[color];

    return (
        <div
            ref={wrapperRef}
            className={cn("w-fit max-w-full", className)}
        >
            {children}
            {/* Decoration zone — fixed-height band BELOW the title.
                Same anchor for every section regardless of title line count. */}
            <div className="relative overflow-hidden mt-3 h-7">
                {/* Ink trail — soft underline that grows in sync with the sweep */}
                <div
                    ref={trailRef}
                    aria-hidden
                    className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[6px] rounded-full pointer-events-none"
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, ${palette.trail} 10%, ${palette.trail} 90%, transparent 100%)`,
                        opacity: 0,
                    }}
                />
                {/* Scanner head — bright sweep bar with clamped width
                    so visual weight stays constant across short and long titles */}
                <div
                    ref={barRef}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    style={{ opacity: 0 }}
                    aria-hidden
                >
                    <div
                        style={{
                            width: "clamp(180px, 55%, 320px)",
                            height: "12px",
                            background: `linear-gradient(90deg, transparent 0%, ${palette.mid} 28%, ${palette.hot} 50%, ${palette.mid} 72%, transparent 100%)`,
                            boxShadow: `0 0 28px ${palette.glow}, 0 0 56px ${palette.soft}`,
                            borderRadius: 999,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
