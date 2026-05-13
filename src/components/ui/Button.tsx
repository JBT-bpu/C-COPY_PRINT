"use client";

import { forwardRef } from "react";
import { MagneticWrapper } from "@/components/animations/MagneticWrapper";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Whether to wrap in MagneticWrapper (desktop only) */
    magnetic?: boolean;
    /** Show arrow icon */
    arrow?: boolean;
    /** Render as link (<a>) or button */
    as?: "button" | "a";
    href?: string;
    children: React.ReactNode;
    className?: string;
} & React.ComponentPropsWithoutRef<"button"> &
    React.ComponentPropsWithoutRef<"a">;

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-ink text-cream hover:bg-ink-soft",
    secondary:
        "bg-green text-ink hover:bg-green-deep",
    ghost:
        "bg-transparent text-ink hover:bg-green-pale",
    outline:
        "border border-line bg-cream text-ink hover:border-green hover:text-green-deep",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
    function Button(
        {
            variant = "primary",
            size = "md",
            magnetic = false,
            arrow = false,
            as: Component = "button",
            href,
            children,
            className,
            ...props
        },
        ref
    ) {
        const button = (
            <Component
                ref={ref as never}
                href={Component === "a" ? href : undefined}
                className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "rounded-pill font-semibold",
                    "transition-all duration-300 ease-[var(--ease-premium)]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
                    "active:scale-[0.97]",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
                {arrow && (
                    <span className="inline-block transition-transform duration-300 group-hover:-rotate-45" aria-hidden>
                        ←
                    </span>
                )}
            </Component>
        );

        if (magnetic) {
            return <MagneticWrapper strength={0.3}>{button}</MagneticWrapper>;
        }

        return button;
    }
);
