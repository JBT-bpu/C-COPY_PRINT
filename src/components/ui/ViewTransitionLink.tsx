"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * Wraps Next.js <Link> with the native View Transitions API.
 *
 * On browsers that support `document.startViewTransition()`, clicking
 * this link triggers a smooth cross-fade page transition. On older
 * browsers it falls back to normal navigation.
 *
 * Usage: Same as <Link>
 * ```jsx
 * <ViewTransitionLink href="/blog">Blog</ViewTransitionLink>
 * ```
 */
export function ViewTransitionLink({
    onClick,
    href,
    ...props
}: ComponentProps<typeof Link>) {
    const router = useRouter();

    const handleClick: ComponentProps<typeof Link>["onClick"] = (e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        // Check if View Transitions API is available
        if (
            typeof document !== "undefined" &&
            "startViewTransition" in document
        ) {
            e.preventDefault();

            const doc = document as Document & {
                startViewTransition: (cb: () => Promise<void> | void) => {
                    finished: Promise<void>;
                };
            };

            doc.startViewTransition(async () => {
                router.push(href.toString());
            });
        }
    };

    return <Link {...props} href={href} onClick={handleClick} />;
}
