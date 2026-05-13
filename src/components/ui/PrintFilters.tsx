"use client";

/**
 * SVG filter definitions for print-house visual effects.
 *
 * Includes:
 * - `print-halftone` — CMYK halftone dot pattern on hover
 * - `print-ink-bleed` — Subtle ink spread / displacement
 * - `print-paper-grain` — Paper texture noise overlay
 *
 * Usage:
 * ```jsx
 * <PrintFilterDefs />
 *
 * <img
 *   style={{ filter: "url(#print-halftone)" }}
 *   className="hover:filter-none transition-filter duration-500"
 * />
 * ```
 *
 * Place <PrintFilterDefs /> once in the layout (it renders hidden SVG).
 * Filters are GPU-accelerated and cost zero JS at runtime.
 */
export function PrintFilterDefs() {
    return (
        <svg
            className="absolute w-0 h-0 overflow-hidden"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* ── CMYK Halftone dot pattern ── */}
                <filter id="print-halftone" x="-5%" y="-5%" width="110%" height="110%">
                    {/* Convert to grayscale first */}
                    <feColorMatrix
                        type="saturate"
                        values="0.3"
                        result="desaturated"
                    />
                    {/* Create dot pattern via threshold */}
                    <feComponentTransfer in="desaturated" result="threshold">
                        <feFuncR
                            type="discrete"
                            tableValues="0 0 0 0.2 0.4 0.6 0.8 1 1 1"
                        />
                        <feFuncG
                            type="discrete"
                            tableValues="0 0 0 0.2 0.4 0.6 0.8 1 1 1"
                        />
                        <feFuncB
                            type="discrete"
                            tableValues="0 0 0 0.2 0.4 0.6 0.8 1 1 1"
                        />
                    </feComponentTransfer>
                    {/* Subtle paper tone overlay */}
                    <feComponentTransfer in="threshold" result="warm">
                        <feFuncR type="linear" slope="0.95" intercept="0.05" />
                        <feFuncG type="linear" slope="0.93" intercept="0.04" />
                        <feFuncB type="linear" slope="0.88" intercept="0.03" />
                    </feComponentTransfer>
                    {/* Slight contrast boost for print look */}
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="1.1" intercept="-0.05" />
                        <feFuncG type="linear" slope="1.1" intercept="-0.05" />
                        <feFuncB type="linear" slope="1.1" intercept="-0.05" />
                    </feComponentTransfer>
                </filter>

                {/* ── Ink bleed / displacement effect ── */}
                <filter id="print-ink-bleed" x="-2%" y="-2%" width="104%" height="104%">
                    {/* Turbulent displacement simulates ink spreading on paper */}
                    <feTurbulence
                        type="turbulence"
                        baseFrequency="0.03 0.04"
                        numOctaves="3"
                        seed="2"
                        result="turbulence"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="turbulence"
                        scale="3"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                    {/* Slight blur to simulate ink absorption */}
                    <feGaussianBlur stdDeviation="0.4" />
                    {/* Warm paper tone */}
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="0.97" intercept="0.03" />
                        <feFuncG type="linear" slope="0.95" intercept="0.02" />
                        <feFuncB type="linear" slope="0.90" intercept="0.01" />
                    </feComponentTransfer>
                </filter>

                {/* ── Paper grain texture overlay ── */}
                <filter id="print-paper-grain" x="0%" y="0%" width="100%" height="100%">
                    {/* Generate noise pattern */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="4"
                        stitchTiles="stitch"
                        result="noise"
                    />
                    {/* Make noise very subtle */}
                    <feColorMatrix
                        in="noise"
                        type="saturate"
                        values="0"
                        result="grayNoise"
                    />
                    <feComponentTransfer in="grayNoise" result="subtleNoise">
                        <feFuncA type="linear" slope="0.08" />
                    </feComponentTransfer>
                    {/* Composite noise over original */}
                    <feComposite
                        in="subtleNoise"
                        in2="SourceGraphic"
                        operator="over"
                    />
                    <feBlend
                        in="SourceGraphic"
                        in2="subtleNoise"
                        mode="multiply"
                    />
                </filter>

                {/* ── CMYK registration misalignment ── */}
                <filter id="print-misreg" x="-2%" y="-2%" width="104%" height="104%">
                    {/* Slight color channel offset simulates CMYK plate misregistration */}
                    <feOffset in="SourceGraphic" dx="1" dy="0" result="shifted-r" />
                    <feBlend in="SourceGraphic" in2="shifted-r" mode="multiply" />
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="1.05" intercept="-0.02" />
                        <feFuncG type="linear" slope="0.98" intercept="0" />
                        <feFuncB type="linear" slope="0.95" intercept="0.02" />
                    </feComponentTransfer>
                </filter>
            </defs>
        </svg>
    );
}

/**
 * HOC that wraps children with a print-house filter on hover.
 *
 * Usage:
 * ```jsx
 * <PrintHoverFilter effect="halftone">
 *   <img src="..." />
 * </PrintHoverFilter>
 * ```
 */
import { useState, type ReactNode } from "react";

type PrintEffect = "halftone" | "ink-bleed" | "paper-grain" | "misreg";

const effectMap: Record<PrintEffect, string> = {
    halftone: "url(#print-halftone)",
    "ink-bleed": "url(#print-ink-bleed)",
    "paper-grain": "url(#print-paper-grain)",
    misreg: "url(#print-misreg)",
};

export function PrintHoverFilter({
    children,
    effect = "halftone",
    className = "",
}: {
    children: ReactNode;
    effect?: PrintEffect;
    className?: string;
}) {
    const [active, setActive] = useState(false);

    return (
        <div
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            className={className}
            style={{
                filter: active ? effectMap[effect] : "none",
                transition: "filter 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
        >
            {children}
        </div>
    );
}
