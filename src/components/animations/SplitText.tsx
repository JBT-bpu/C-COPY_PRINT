"use client";

import React, { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * SplitText — DOM-based per-character staggered reveal on scroll.
 *
 * Instead of trying to parse React children (which fails with nested
 * elements like <span>), this component uses DOM manipulation after
 * mount to split text nodes into individual character spans.
 *
 * Usage:
 * ```jsx
 * <SplitText>
 *   <h2>Heading with <span className="italic">nested</span> elements</h2>
 * </SplitText>
 * ```
 */
interface SplitTextProps {
    children: ReactNode;
    /** Stagger delay between each character in seconds (default: 0.03) */
    stagger?: number;
    /** Animation duration per character in seconds (default: 0.6) */
    duration?: number;
    /** Y offset in pixels (default: 40) */
    offsetY?: number;
    /** ScrollTrigger start position (default: "top 85%") */
    triggerStart?: string;
    /** Additional className for the wrapper */
    className?: string;
}

export function SplitText({
    children,
    stagger = 0.03,
    duration = 0.6,
    offsetY = 40,
    triggerStart = "top 85%",
    className = "",
}: SplitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        registerGsap();

        const el = containerRef.current;
        if (!el) {
            console.warn("[SplitText] Container ref is null");
            return;
        }

        // Find the first heading or block-level child
        const target = el.children[0] as HTMLElement;
        if (!target) {
            console.warn("[SplitText] No child element found");
            return;
        }

        // Walk the DOM and split all text nodes into character spans
        const charSpans: HTMLSpanElement[] = [];

        function splitTextNodes(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || "";
                if (!text.trim()) return;

                const parent = node.parentNode;
                if (!parent) return;

                const fragment = document.createDocumentFragment();
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    const span = document.createElement("span");
                    span.className = "split-char";
                    span.style.display = "inline-block";
                    span.style.perspective = "400px";
                    span.textContent = char === " " ? "\u00A0" : char;
                    charSpans.push(span);
                    fragment.appendChild(span);
                }
                parent.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Recurse into child nodes (but skip if it's the split-char we just created)
                const element = node as HTMLElement;
                if (element.className === "split-char") return;

                // Clone child nodes to a static array before modifying
                const children = Array.from(node.childNodes);
                for (const child of children) {
                    splitTextNodes(child);
                }
            }
        }

        splitTextNodes(target);

        if (!charSpans.length) return;

        const ctx = gsap.context(() => {
            gsap.set(charSpans, {
                y: offsetY,
                opacity: 0,
                scale: 0.5,
                rotateY: 90,
            });

            ScrollTrigger.create({
                trigger: el,
                start: triggerStart,
                once: true,
                onEnter: () => {
                    gsap.to(charSpans, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        duration,
                        stagger,
                        ease: "power3.out",
                    });
                },
            });
        }, el);

        return () => ctx.revert();
    }, [prefersReduced, stagger, duration, offsetY, triggerStart]);

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden ${className}`}
            style={{ perspective: "600px" }}
        >
            {children}
        </div>
    );
}
