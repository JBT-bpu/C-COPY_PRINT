"use client";

import { useCallback, useRef } from "react";
import { usePrefersReducedMotion, useIsTouchDevice } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MagneticWrapperProps = {
    children: React.ReactNode;
    className?: string;
    /** Magnetic pull strength (0–1). Higher = stronger pull */
    strength?: number;
    /** Radius in px within which the magnetic effect activates */
    radius?: number;
    /** Whether to also apply a subtle rotation */
    rotate?: boolean;
};

export function MagneticWrapper({
    children,
    className,
    strength = 0.35,
    radius = 60,
    rotate = false,
}: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();
    const isTouch = useIsTouchDevice();

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (prefersReduced || isTouch) return;
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance > radius) {
                el.style.transform = "translate(0px, 0px) rotate(0deg)";
                return;
            }

            const moveX = distX * strength;
            const moveY = distY * strength;
            const rotateZ = rotate ? (distX / radius) * 5 : 0;

            el.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotateZ}deg)`;
        },
        [prefersReduced, isTouch, strength, radius, rotate]
    );

    const handleMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = "translate(0px, 0px) rotate(0deg)";
    }, []);

    if (prefersReduced || isTouch) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            className={cn("transition-transform duration-300 ease-out will-change-transform", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
}
