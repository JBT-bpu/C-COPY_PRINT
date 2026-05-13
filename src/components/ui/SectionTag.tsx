import { cn } from "@/lib/utils";

type SectionTagProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "green";
};

const variantStyles = {
    default: "bg-green-pale text-green-deep",
    green: "bg-ink/10 text-ink",
};

export function SectionTag({ children, className, variant = "default" }: SectionTagProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium mb-6",
                variantStyles[variant],
                className
            )}
        >
            {/* Rounded line accent — not a circle */}
            <span className="flex gap-1" aria-hidden>
                <span className="w-4 h-1 rounded-full bg-green" />
                <span className="w-2 h-1 rounded-full bg-green-deep" />
            </span>
            {children}
        </div>
    );
}
