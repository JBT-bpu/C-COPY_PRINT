"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * PrintType — print-press reveal for headings.
 *
 * Splits the wrapped heading into per-character spans inside per-word
 * `white-space: nowrap` containers (so words never break mid-character),
 * then on scroll-in snaps every character from a thin ghost to its
 * final computed weight in one quick punch — like a press dropping ink
 * onto paper.
 *
 * Works with nested elements like accent <span>s; each character tweens
 * to its OWN inherited font-weight so mixed-weight headlines
 * (extrabold body + light accent) stay coherent.
 */
interface PrintTypeProps {
    children: ReactNode;
    /** Seconds between each character (default 0 — all snap at once) */
    stagger?: number;
    /** Per-character duration (default 0.18 — fast snap) */
    duration?: number;
    /** ScrollTrigger position (default "top 85%") */
    triggerStart?: string;
    className?: string;
}

export function PrintType({
    children,
    stagger = 0,
    duration = 0.18,
    triggerStart = "top 85%",
    className = "",
}: PrintTypeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        registerGsap();

        const el = containerRef.current;
        if (!el) return;

        const target = el.children[0] as HTMLElement | undefined;
        if (!target) return;

        // Guard against double-init (React Strict Mode double-invokes effects).
        if (target.dataset.printTypeDone === "true") return;
        target.dataset.printTypeDone = "true";

        const charSpans: HTMLSpanElement[] = [];

        function splitTextNodes(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent ?? "";
                if (!text.trim()) return;
                const parent = node.parentNode;
                if (!parent) return;

                const fragment = document.createDocumentFragment();
                // Tokenize into words + whitespace runs. Whitespace stays
                // as plain text so the browser can wrap at spaces; each
                // word becomes a `white-space: nowrap` block so chars
                // inside never split across lines.
                const tokens = text.split(/(\s+)/);
                for (const token of tokens) {
                    if (!token) continue;
                    if (/^\s+$/.test(token)) {
                        fragment.appendChild(document.createTextNode(token));
                        continue;
                    }
                    const wordSpan = document.createElement("span");
                    wordSpan.style.display = "inline-block";
                    wordSpan.style.whiteSpace = "nowrap";
                    for (let i = 0; i < token.length; i++) {
                        const span = document.createElement("span");
                        span.className = "print-char";
                        span.style.display = "inline-block";
                        span.style.willChange = "opacity, font-weight";
                        span.textContent = token[i];
                        charSpans.push(span);
                        wordSpan.appendChild(span);
                    }
                    fragment.appendChild(wordSpan);
                }
                parent.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                if (element.classList.contains("print-char")) return;
                const childNodes = Array.from(node.childNodes);
                for (const child of childNodes) splitTextNodes(child);
            }
        }

        splitTextNodes(target);
        if (!charSpans.length) return;

        // Hide pre-fonts so we don't flash a fallback-weight final state.
        gsap.set(charSpans, { opacity: 0, fontWeight: 100 });

        let trigger: ScrollTrigger | null = null;

        // Wait for the variable font to fully load before reading
        // computed weights — otherwise the fallback font's weight (often
        // 400) is captured and the tween settles at the wrong endpoint,
        // which reads as "stuck mid animation."
        const fontsReady: Promise<unknown> =
            typeof document !== "undefined" && "fonts" in document
                ? document.fonts.ready
                : Promise.resolve();

        let cancelled = false;
        fontsReady.then(() => {
            if (cancelled) return;

            const finalWeights = charSpans.map((s) => {
                // Temporarily clear inline override so getComputedStyle
                // reads the CSS-cascade weight, not our gsap.set(100).
                const prev = s.style.fontWeight;
                s.style.fontWeight = "";
                const w = parseInt(getComputedStyle(s).fontWeight, 10);
                s.style.fontWeight = prev;
                return Number.isFinite(w) ? w : 800;
            });

            // Re-pin to thin before tweening (in case clearing above bled through).
            gsap.set(charSpans, { opacity: 0, fontWeight: 100 });

            trigger = ScrollTrigger.create({
                trigger: el,
                start: triggerStart,
                once: true,
                onEnter: () => {
                    charSpans.forEach((span, i) => {
                        gsap.to(span, {
                            opacity: 1,
                            fontWeight: finalWeights[i],
                            duration,
                            delay: i * stagger,
                            ease: "power3.inOut",
                        });
                    });
                },
            });
        });

        return () => {
            cancelled = true;
            trigger?.kill();
        };
    }, [prefersReduced, stagger, duration, triggerStart]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
