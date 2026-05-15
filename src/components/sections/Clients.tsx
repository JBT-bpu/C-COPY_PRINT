"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CLIENTS = [
    "Mercedes",
    "Honda",
    "Amdocs",
    "Isracard",
    "Cellcom",
    "Partner",
    "Leumi",
    "Hapoalim",
];

export function Clients() {
    const prefersReduced = usePrefersReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? -100 : -400]);

    const doubled = [...CLIENTS, ...CLIENTS, ...CLIENTS];

    return (
        <section
            ref={ref}
            className="relative py-10 md:py-16 overflow-hidden"
            aria-label="לקוחות"
        >
            <div className="max-w-7xl mx-auto px-6 mb-5 md:mb-8">
                <p className="text-center text-sm uppercase tracking-widest text-ink-soft/60">
                    לקוחות שבוטחים בנו
                </p>
            </div>

            <motion.div className="flex gap-8 whitespace-nowrap" style={{ x }}>
                {doubled.map((client, i) => (
                    <span
                        key={i}
                        className={cn(
                            "inline-flex items-center gap-4 text-2xl md:text-3xl font-display font-light tracking-tight",
                            "text-ink-soft/40"
                        )}
                    >
                        {client}
                        <span className="w-4 h-1 rounded-full bg-green shrink-0" aria-hidden />
                    </span>
                ))}
            </motion.div>

            {/* Fade masks — RTL: start = right, end = left */}
            <div className="absolute inset-y-0 start-0 w-24 bg-linear-to-l from-cream to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 end-0 w-24 bg-linear-to-r from-cream to-transparent pointer-events-none" />
        </section>
    );
}
