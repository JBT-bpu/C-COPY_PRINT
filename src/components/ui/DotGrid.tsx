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
            <div className="dot-grid-base absolute inset-0" />
            {/* Active green dots — masked to a soft circle around the stroke head */}
            <div className="dot-grid-active absolute inset-0" />
        </div>
    );
}
