"use client";

import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Architectural connecting stroke — a wide extruded green slab that
 * snakes vertically behind the page content.
 *
 * REBUILD: uses real-pixel viewBox (sized via ResizeObserver on <main>)
 * instead of the old 100×1000 stretched viewBox. This fixes:
 *   - Distorted shapes (circles → ellipses)
 *   - Draw-on mismatches (dasharray vs non-scaling-stroke)
 *   - Filter artifacts (squashed blur)
 *
 * Three layered passes give the slab extruded depth:
 *   - shadow (darker green, offset down 3px — subtle ridge)
 *   - main slab (brand lime, wide, with soft outer glow halo)
 *   - top bevel (lighter green, offset up — fakes a highlight)
 *
 * Reduced-motion: slab renders fully drawn, no pulse dot, no scroll tween.
 */

const INITIAL_VISIBLE = 0.1; // 10% drawn at start

// Desktop stroke widths (≥ 1024 px viewport)
const DESKTO_MAIN = 88;
const DESKTO_SHADOW = 96;
const DESKTO_BEVEL = 14;

/** Viewport-responsive scale: 1 on desktop, ~0.35 on 375 px mobile. */
function strokeScale(W: number): number {
    return Math.min(1, Math.max(0.3, W / 1024));
}

/**
 * Build an S-shaped stroke path in real pixel coordinates.
 * The path snakes from top-right → left → right → left → bottom.
 *
 * Uses cubic Bézier curves (C) with generous radii so the slab
 * rounds smoothly. The bend radius scales with the viewport so
 * mobile curves stay proportional.
 */
function buildStrokePath(W: number, H: number, scale: number): string {
    const mainW = Math.round(DESKTO_MAIN * scale);
    const xR = W * 0.92;
    const xL = W * 0.08;
    const xM = W * 0.50;

    // Generous bend radius — at least 2× the scaled stroke width so the
    // slab never looks pinched. Capped by available height.
    const R = Math.max(mainW * 2, Math.min(W * 0.18, H * 0.08));

    const y1 = H * 0.22;
    const y2 = H * 0.50;
    const y3 = H * 0.78;

    return [
        `M ${xR} 0`,
        `L ${xR} ${y1 - R}`,
        // Right → Centre (smooth cubic, tangent enters vertical → exits horizontal)
        `C ${xR} ${y1} ${xM + R} ${y1} ${xM} ${y1}`,
        // Centre → Left (tangent enters horizontal → exits vertical)
        `C ${xM - R} ${y1} ${xL} ${y1} ${xL} ${y1 + R}`,
        `L ${xL} ${y2 - R}`,
        // Left → Centre
        `C ${xL} ${y2} ${xM - R} ${y2} ${xM} ${y2}`,
        // Centre → Right
        `C ${xM + R} ${y2} ${xR} ${y2} ${xR} ${y2 + R}`,
        `L ${xR} ${y3 - R}`,
        // Right → Centre
        `C ${xR} ${y3} ${xM + R} ${y3} ${xM} ${y3}`,
        // Centre → Left
        `C ${xM - R} ${y3} ${xL} ${y3} ${xL} ${y3 + R}`,
        `L ${xL} ${H}`,
    ].join(" ");
}

export function BrandStroke() {
    const shadowRef = useRef<SVGPathElement>(null);
    const mainRef = useRef<SVGPathElement>(null);
    const bevelRef = useRef<SVGPathElement>(null);
    const pulseRef = useRef<SVGCircleElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
    const prefersReduced = usePrefersReducedMotion();

    // Observe <main> for size changes
    useEffect(() => {
        const mainEl = document.getElementById("main-content");
        if (!mainEl) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setDims({ w: Math.round(width), h: Math.round(height) });
                }
            }
        });

        observer.observe(mainEl);
        return () => observer.disconnect();
    }, []);

    // Responsive scale factor (1 on desktop, ~0.35 on 375px mobile)
    const scale = dims ? strokeScale(dims.w) : 1;

    // Build path from real dimensions (scale affects bend radius)
    const pathD = useMemo(
        () => (dims ? buildStrokePath(dims.w, dims.h, scale) : ""),
        [dims, scale]
    );

    // Measure path length synchronously after DOM update
    const [pathLength, setPathLength] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (!pathD) return;
        const path = mainRef.current;
        if (!path) return;
        setPathLength(path.getTotalLength());
    }, [pathD]);

    // GSAP scroll-driven draw animation
    useEffect(() => {
        if (pathLength == null || prefersReduced || !pathD) return;

        registerGsap();

        const mainEl = document.getElementById("main-content");
        const path = mainRef.current;
        if (!mainEl || !path) return;

        const targets = [shadowRef.current, mainRef.current, bevelRef.current]
            .filter(Boolean) as SVGPathElement[];

        const startOffset = pathLength * (1 - INITIAL_VISIBLE);

        const updatePulse = (offset: number) => {
            const circle = pulseRef.current;
            if (!circle) return;
            const drawnLen = pathLength - offset;
            const clampedLen = Math.max(0, Math.min(drawnLen, pathLength));
            const pt = path.getPointAtLength(clampedLen);
            circle.setAttribute("cx", `${pt.x}`);
            circle.setAttribute("cy", `${pt.y}`);
        };

        // Initial pulse position
        updatePulse(startOffset);

        const tween = gsap.fromTo(
            targets,
            { strokeDashoffset: startOffset },
            {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: mainEl,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.2,
                    onUpdate: (self) => {
                        const offset = startOffset * (1 - self.progress);
                        updatePulse(offset);
                    },
                },
            }
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [pathLength, prefersReduced, pathD]);

    // Dash style for draw-on effect
    const dashStyle =
        pathLength != null
            ? {
                strokeDasharray: pathLength,
                strokeDashoffset: prefersReduced
                    ? 0
                    : pathLength * (1 - INITIAL_VISIBLE),
            }
            : undefined;

    // Don't render until we have real dimensions
    if (!dims || !pathD) {
        return (
            <svg
                aria-hidden
                ref={svgRef}
                className="pointer-events-none absolute inset-0 w-full h-full z-0"
                fill="none"
                strokeLinejoin="round"
            />
        );
    }

    return (
        <svg
            aria-hidden
            ref={svgRef}
            className="pointer-events-none absolute inset-0 w-full h-full z-0"
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            fill="none"
            strokeLinejoin="round"
        >
            <defs>
                {/* Soft outer halo for the main slab — uniform glow in real pixels */}
                <filter
                    id="brand-stroke-glow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                >
                    <feGaussianBlur stdDeviation={Math.max(2, Math.round(6 * scale))} result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Shadow pass — soft offset darker ridge */}
            <path
                ref={shadowRef}
                d={pathD}
                transform={`translate(0,${Math.round(3 * scale)})`}
                stroke="var(--color-green-deep)"
                strokeLinecap="round"
                strokeWidth={Math.round(DESKTO_SHADOW * scale)}
                opacity="0.4"
                style={dashStyle}
            />

            {/* Main slab — wide, opaque, brand lime, with halo */}
            <path
                ref={mainRef}
                d={pathD}
                stroke="var(--color-green)"
                strokeLinecap="round"
                strokeWidth={Math.round(DESKTO_MAIN * scale)}
                filter="url(#brand-stroke-glow)"
                style={dashStyle}
            />

            {/* Top bevel — lighter shade, slim, offset up */}
            <path
                ref={bevelRef}
                d={pathD}
                transform={`translate(0,${-Math.round(5 * scale)})`}
                stroke="var(--color-green-soft)"
                strokeLinecap="round"
                strokeWidth={Math.round(DESKTO_BEVEL * scale)}
                opacity="0.75"
                style={dashStyle}
            />

            {/* Pulsing leading edge dot — rides the head of the draw */}
            {!prefersReduced && (
                <circle
                    ref={pulseRef}
                    cx={dims.w * 0.85}
                    cy={0}
                    r={Math.round(14 * scale)}
                    fill="var(--color-green-soft)"
                    opacity="0.75"
                    className="[animation:brand-stroke-pulse_1.8s_ease-in-out_infinite]"
                />
            )}
        </svg>
    );
}
