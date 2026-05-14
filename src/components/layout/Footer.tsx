import Image from "next/image";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { BRANCHES, PRIMARY_BRANCH, phoneHref } from "@/content/branches";

/**
 * Footer — compact version matching designes/11.png.
 *
 * Drops the wide/products/useful link columns from the older 5-column
 * sprawl (those belong on dedicated service/product pages). Keeps the
 * three essentials: brand, branches, primary contact.
 *
 * Background is transparent so the cream "page card" from layout.tsx
 * shows through — the footer reads as the closing chord of the cream
 * content area, with the body's lime green still framing the edges.
 */
export function Footer() {
    return (
        <footer className="relative pt-10 md:pt-14 pb-8 md:pb-10 px-5 md:px-10 border-t border-line/60" role="contentinfo">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                    {/* Brand */}
                    <div>
                        <div className="mb-4">
                            <Image
                                src="/images/logo.png"
                                alt="C-Copy — שיא קופי"
                                width={180}
                                height={56}
                                className="h-12 w-auto"
                            />
                        </div>
                        <p className="text-ink-soft leading-relaxed text-sm mb-5 max-w-xs">
                            בית הדפוס המוביל בישראל. דפוס דיגיטלי, פורמט רחב, אריזות,
                            מכון העתקות והדפסה על חומרים — הכל במקום אחד.
                        </p>

                        <div className="flex gap-2.5">
                            <a
                                href="https://www.facebook.com/c.copy.IbnGabirol/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-9 rounded-full bg-white border border-line flex items-center justify-center text-ink-soft text-sm font-bold hover:bg-green hover:border-green hover:text-ink transition-colors"
                                aria-label="Facebook"
                            >
                                <span aria-hidden>f</span>
                            </a>
                            <a
                                href="https://www.instagram.com/ccopy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-9 rounded-full bg-white border border-line flex items-center justify-center text-ink-soft text-sm font-bold hover:bg-green hover:border-green hover:text-ink transition-colors"
                                aria-label="Instagram"
                            >
                                <span aria-hidden>in</span>
                            </a>
                        </div>
                    </div>

                    {/* Branches */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-soft/70 mb-4">
                            סניפים
                        </h3>
                        <ul className="space-y-4">
                            {BRANCHES.map((branch) => (
                                <li key={branch.id}>
                                    <p className="text-ink text-sm font-semibold">{branch.name}</p>
                                    <p className="text-ink-soft text-xs">{branch.address}</p>
                                    <a
                                        href={phoneHref(branch.phone)}
                                        className="text-ink-soft text-xs hover:text-green-deep transition-colors"
                                        dir="ltr"
                                    >
                                        {branch.phone}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Primary contact + tagline */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-soft/70 mb-4">
                            צרו קשר
                        </h3>
                        <ul className="space-y-3 mb-6">
                            <li>
                                <a
                                    href={`mailto:${PRIMARY_BRANCH.email}`}
                                    className="inline-flex items-center gap-2 text-ink-soft hover:text-green-deep transition-colors text-sm"
                                    dir="ltr"
                                >
                                    <BrandIcon name="email-envelope" className="size-4" />
                                    {PRIMARY_BRANCH.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={phoneHref(PRIMARY_BRANCH.phone)}
                                    className="inline-flex items-center gap-2 text-ink-soft hover:text-green-deep transition-colors text-sm"
                                    dir="ltr"
                                >
                                    <BrandIcon name="phone-contact" className="size-4" />
                                    {PRIMARY_BRANCH.phone}
                                </a>
                            </li>
                            {PRIMARY_BRANCH.sales && (
                                <li>
                                    <a
                                        href={phoneHref(PRIMARY_BRANCH.sales)}
                                        className="inline-flex items-center gap-2 text-ink-soft hover:text-green-deep transition-colors text-sm"
                                        dir="ltr"
                                    >
                                        <BrandIcon name="phone-contact" className="size-4" />
                                        {PRIMARY_BRANCH.sales}
                                        <span className="text-ink-soft/50 text-xs">· מכירות</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                        <a
                            href="#quote"
                            className="inline-flex items-center gap-2 rounded-pill bg-ink text-cream px-5 py-2.5 text-sm font-semibold hover:bg-ink-soft transition-colors"
                        >
                            קבלו הצעת מחיר
                            <span aria-hidden>←</span>
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-5 border-t border-line/60 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-ink-soft/70 text-xs">
                        © {new Date().getFullYear()} C-Copy / שיא קופי. כל הזכויות שמורות.
                    </p>
                    <p className="text-ink-soft/50 text-[11px]">
                        <span dir="ltr">C-COPY</span> · מאז 1986
                    </p>
                </div>
            </div>
        </footer>
    );
}
