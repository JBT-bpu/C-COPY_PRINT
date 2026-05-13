"use client";

import { cn } from "@/lib/utils";

/**
 * CropMarks — four L-shaped registration marks at card corners.
 * Hidden by default, appear on parent hover (group-hover).
 * Must be placed inside a `group` container.
 */
interface CropMarksProps {
    /** Length of each mark arm in px — default 12 */
    size?: number;
    /** Offset from corner in px — default 8 */
    offset?: number;
    /** Stroke width in px — default 1 */
    strokeWidth?: number;
    className?: string;
}

export function CropMarks({
    size = 12,
    offset = 8,
    strokeWidth = 1,
    className,
}: CropMarksProps) {
    const mark = `M0 ${size} L0 0 L${size} 0`;
    const color = "rgba(141, 198, 65, 0.5)";

    return (
        <div
            className={cn(
                "absolute inset-0 pointer-events-none overflow-hidden",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                className
            )}
            aria-hidden
        >
            {/* Top-start (RTL: top-right) */}
            <svg
                className="absolute"
                style={{ top: offset, right: offset, width: size, height: size }}
            >
                <path d={mark} stroke={color} strokeWidth={strokeWidth} fill="none" />
            </svg>

            {/* Top-end (RTL: top-left) */}
            <svg
                className="absolute"
                style={{ top: offset, left: offset, width: size, height: size }}
            >
                <path
                    d={`M0 0 L${size} 0 L${size} ${size}`}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
            </svg>

            {/* Bottom-start (RTL: bottom-right) */}
            <svg
                className="absolute"
                style={{ bottom: offset, right: offset, width: size, height: size }}
            >
                <path
                    d={`M0 0 L0 ${size} L${size} ${size}`}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
            </svg>

            {/* Bottom-end (RTL: bottom-left) */}
            <svg
                className="absolute"
                style={{ bottom: offset, left: offset, width: size, height: size }}
            >
                <path
                    d={`M0 ${size} L${size} ${size} L${size} 0`}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
            </svg>
        </div>
    );
}

/**
 * PaperLift — adds a subtle paper corner lift effect on hover.
 * Wrap around a card element. The card must have `group` class.
 */
interface PaperLiftProps {
    children: React.ReactNode;
    className?: string;
}

export function PaperLift({ children, className }: PaperLiftProps) {
    return (
        <div
            className={cn(
                "transition-transform duration-500 ease-[var(--ease-premium)]",
                "group-hover:[transform:perspective(800px)_rotateX(1.5deg)_rotateY(-1.5deg)]",
                "[transform-origin:bottom_left]",
                className
            )}
        >
            {children}
        </div>
    );
}
