/**
 * DotGrid — a faint halftone dot field behind the page (print-shop
 * texture). Two stacked layers:
 *
 *   1. base   — barely-visible ink dots, always on (paper grain).
 *   2. active — brighter green dots, revealed only inside a soft
 *               circle that follows the BrandStroke leading edge.
 *
 * The active layer's mask is centred on the CSS vars `--sx` / `--sy`,
 * which BrandStroke writes (in main-px) on every scroll tick. So as
 * the green slab snakes down the page, the dots around its head
 * "ink up" and fade back out — the area around the stroke changes.
 *
 * Pure CSS gradients + a mask; no JS here, no per-frame React work.
 * Sits inside <main> as an absolute, pointer-events-none layer.
 */
export function DotGrid() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
        >
            {/* Base paper-grain dots — always faintly visible */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, var(--color-ink) 1px, transparent 1.6px)",
                    backgroundSize: "26px 26px",
                    opacity: 0.05,
                }}
            />
            {/* Active green dots — masked to a soft circle around the stroke head */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, var(--color-green) 1.5px, transparent 2px)",
                    backgroundSize: "26px 26px",
                    opacity: 0.5,
                    WebkitMaskImage:
                        "radial-gradient(circle 620px at var(--sx, 50%) var(--sy, 38%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,0.7) 42%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.15) 78%, transparent 100%)",
                    maskImage:
                        "radial-gradient(circle 620px at var(--sx, 50%) var(--sy, 38%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,0.7) 42%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.15) 78%, transparent 100%)",
                }}
            />
        </div>
    );
}
