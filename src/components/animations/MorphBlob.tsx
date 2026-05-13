"use client";

import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MorphBlobProps = {
    className?: string;
    /** Blob color — defaults to brand green */
    color?: string;
    /** Size in pixels */
    size?: number;
    /** Animation duration in seconds */
    duration?: number;
    /** Opacity of the blob */
    opacity?: number;
};

/**
 * An organic morphing SVG blob — inspired by the C-Copy reception desk shape.
 * Uses CSS animations with multiple keyframes for smooth morphing.
 * Cheap to render, works everywhere (desktop + mobile).
 */
export function MorphBlob({
    className,
    color = "var(--color-green)",
    size = 600,
    duration = 8,
    opacity = 0.25,
}: MorphBlobProps) {
    const prefersReduced = usePrefersReducedMotion();

    if (prefersReduced) {
        // Static blob — no animation
        return (
            <svg
                className={cn("absolute pointer-events-none", className)}
                width={size}
                height={size}
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M300 50C420 50 500 120 530 220C560 320 540 420 460 490C380 560 280 570 200 510C120 450 60 370 70 270C80 170 180 50 300 50Z"
                    fill={color}
                    opacity={opacity}
                />
            </svg>
        );
    }

    return (
        <svg
            className={cn("absolute pointer-events-none", className)}
            width={size}
            height={size}
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden="true"
        >
            <path className="morph-blob-path" fill={color} opacity={opacity}>
                <animate
                    attributeName="d"
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                    values="
            M300 50C420 50 500 120 530 220C560 320 540 420 460 490C380 560 280 570 200 510C120 450 60 370 70 270C80 170 180 50 300 50Z;
            M350 80C450 60 530 150 540 260C550 370 490 460 400 510C310 560 220 550 150 480C80 410 50 310 90 210C130 110 250 100 350 80Z;
            M280 60C400 40 520 130 550 240C580 350 530 470 430 530C330 590 200 570 130 490C60 410 40 300 80 200C120 100 160 80 280 60Z;
            M320 70C440 50 510 140 540 250C570 360 520 450 430 510C340 570 230 560 160 490C90 420 50 320 80 220C110 120 200 90 320 70Z;
            M300 50C420 50 500 120 530 220C560 320 540 420 460 490C380 560 280 570 200 510C120 450 60 370 70 270C80 170 180 50 300 50Z"
                />
            </path>
        </svg>
    );
}
