"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { NAV_LINKS } from "@/content/navigation";
import { ViewTransitionLink } from "@/components/ui/ViewTransitionLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Nav() {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();

    const overlayRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const wasOpenRef = useRef(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > 100 && latest > previous) {
            setHidden(true);
            setMobileOpen(false);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    // Close mobile menu on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    // Focus trap: trap Tab within overlay, return focus on close
    useEffect(() => {
        if (mobileOpen) {
            wasOpenRef.current = true;

            // Focus first link after AnimatePresence renders
            const timer = setTimeout(() => {
                const overlay = overlayRef.current;
                if (!overlay) return;
                const first = overlay.querySelector<HTMLElement>('a[href]');
                first?.focus();
            }, 120);

            const handleTab = (e: KeyboardEvent) => {
                if (e.key !== "Tab") return;
                const overlay = overlayRef.current;
                if (!overlay) return;

                const focusable = overlay.querySelectorAll<HTMLElement>(
                    'a[href], button, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            };

            window.addEventListener("keydown", handleTab);
            return () => {
                window.removeEventListener("keydown", handleTab);
                clearTimeout(timer);
            };
        } else if (wasOpenRef.current) {
            triggerRef.current?.focus();
            wasOpenRef.current = false;
        }
    }, [mobileOpen]);

    const handleLinkClick = useCallback(() => {
        setMobileOpen(false);
    }, []);

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-14 inset-x-4 z-50 rounded-pill",
                    "transition-all duration-500 ease-[var(--ease-premium)]",
                    scrolled
                        ? "top-4 bg-cream/80 backdrop-blur-xl shadow-lg shadow-ink/5 border border-line/50"
                        : "bg-cream/40 backdrop-blur-md border border-transparent"
                )}
                initial={{ y: -100 }}
                animate={{ y: hidden ? -100 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <nav
                    className="flex items-center justify-between px-4 md:px-6 py-3"
                    role="navigation"
                    aria-label="ניווט ראשי"
                >
                    {/* Logo — RTL: on the right */}
                    <a
                        href="#"
                        className="flex items-center shrink-0"
                        aria-label="C-Copy — חזרה לדף הבית"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="C-Copy — שיא קופי"
                            width={140}
                            height={44}
                            priority
                            className="h-9 md:h-10 w-auto"
                        />
                    </a>

                    {/* Desktop links — center */}
                    <ul className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                {link.href.startsWith("/") ? (
                                    <ViewTransitionLink
                                        href={link.href}
                                        className={cn(
                                            "relative px-4 py-2 rounded-pill text-sm font-medium",
                                            "text-ink-soft hover:text-ink transition-colors duration-300",
                                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                                        )}
                                    >
                                        {link.label}
                                    </ViewTransitionLink>
                                ) : (
                                    <a
                                        href={link.href}
                                        className={cn(
                                            "relative px-4 py-2 rounded-pill text-sm font-medium",
                                            "text-ink-soft hover:text-ink transition-colors duration-300",
                                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                                        )}
                                    >
                                        {link.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* CTA — desktop */}
                    <div className="hidden md:block">
                        <Button variant="primary" size="sm" arrow as="a" href="#quote">
                            הצעת מחיר
                        </Button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        ref={triggerRef}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
                        aria-expanded={mobileOpen}
                    >
                        <span
                            className={cn(
                                "block w-6 h-0.5 bg-ink transition-all duration-300",
                                mobileOpen && "rotate-45 translate-y-2"
                            )}
                        />
                        <span
                            className={cn(
                                "block w-6 h-0.5 bg-ink transition-all duration-300",
                                mobileOpen && "opacity-0"
                            )}
                        />
                        <span
                            className={cn(
                                "block w-6 h-0.5 bg-ink transition-all duration-300",
                                mobileOpen && "-rotate-45 -translate-y-2"
                            )}
                        />
                    </button>
                </nav>
            </motion.header>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        ref={overlayRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="תפריט ניווט"
                        className="fixed inset-0 z-40 bg-cream/95 backdrop-blur-xl pt-24 px-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <nav className="flex flex-col gap-2">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={handleLinkClick}
                                    className="text-3xl font-bold text-ink py-3 border-b border-line"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <div className="mt-8">
                                <Button variant="primary" size="lg" arrow as="a" href="#quote" onClick={handleLinkClick}>
                                    הצעת מחיר
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
