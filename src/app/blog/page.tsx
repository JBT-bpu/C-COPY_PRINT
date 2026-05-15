import Link from "next/link";
import { ARTICLES, BLOG_CATEGORIES } from "@/lib/blog-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "מאמרים ומדריכים | C-Copy שיא קופי",
    description:
        "מאמרים מקצועיים על דפוס דיגיטלי, עיצוב גרפי, הדפסת חוברות, פוסטרים, כרטיסי ביקור ועוד — מבית שיא קופי בית דפוס בתל אביב.",
};

export default function BlogPage() {
    return (
        <div className="bg-cream min-h-screen">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-ink text-white overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, var(--color-green) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                    aria-hidden
                />
                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <span className="inline-flex items-center gap-2 rounded-pill bg-green/20 border border-green/30 px-5 py-2 text-sm font-medium text-green-soft mb-6">
                        מרכז ידע
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                        מאמרים ו<span className="font-display font-light text-green">מדריכים</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        מידע מקצועי על דפוס דיגיטלי, עיצוב, מוצרי דפוס ועוד — מהצוות של שיא קופי
                    </p>
                </div>
            </section>

            {/* Category filters (visual only — static page) */}
            <section className="py-8 border-b border-line">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-3">
                        {BLOG_CATEGORIES.map((cat) => (
                            <span
                                key={cat}
                                className="rounded-pill bg-white border border-line px-5 py-2 text-sm font-medium text-ink-soft"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Article grid */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ARTICLES.map((article) => {
                            const isLocal = article.local;
                            const Wrapper = isLocal ? Link : "a";
                            const wrapperProps = isLocal
                                ? { href: `/blog/${article.slug}` }
                                : {
                                    href: article.externalUrl!,
                                    target: "_blank" as const,
                                    rel: "noopener noreferrer",
                                };

                            return (
                                <Wrapper
                                    key={article.slug}
                                    {...wrapperProps}
                                    className="group block"
                                >
                                    <div className="relative bg-white rounded-[var(--radius-card)] p-8 h-full border border-line/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        {/* Category badge */}
                                        <span className="inline-block rounded-pill bg-green/10 text-green-deep text-xs font-semibold px-3 py-1 mb-4">
                                            {article.category}
                                        </span>

                                        <h2 className="text-xl font-bold text-ink mb-3 group-hover:text-green-deep transition-colors">
                                            {article.title}
                                        </h2>

                                        <p className="text-sm text-ink-soft leading-relaxed mb-4">
                                            {article.description}
                                        </p>

                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-deep">
                                            {isLocal ? "קראו עוד" : "קראו באתר המקורי"}
                                            <span
                                                className="inline-block transition-transform duration-300 group-hover:-rotate-45"
                                                aria-hidden
                                            >
                                                ←
                                            </span>
                                        </span>

                                        {/* External indicator */}
                                        {!isLocal && (
                                            <span className="absolute top-6 end-6 text-ink-soft/40 text-xs">
                                                חיצוני
                                            </span>
                                        )}
                                    </div>
                                </Wrapper>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-green/5 border-t border-line">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-ink mb-4">
                        צריכים שירותי דפוס מקצועיים?
                    </h2>
                    <p className="text-ink-soft mb-8">
                        פנו אלינו עוד היום וקבלו הצעת מחיר מהירה וללא התחייבות.
                    </p>
                    <Link
                        href="/#quote"
                        className="inline-flex items-center gap-3 rounded-pill bg-green text-ink px-8 py-4 text-lg font-semibold shadow-lg shadow-green/20 hover:bg-green-soft transition-all duration-300"
                    >
                        קבלו הצעת מחיר
                        <span aria-hidden>←</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
