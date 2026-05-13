import Link from "next/link";
import { getLocalArticle, getLocalSlugs, ARTICLES } from "@/lib/blog-data";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getLocalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = getLocalArticle(slug);
    if (!article) return { title: "מאמר לא נמצא | C-Copy" };
    return {
        title: `${article.title} | C-Copy שיא קופי`,
        description: article.description,
    };
}

export default async function BlogArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = getLocalArticle(slug);

    if (!article) {
        return (
            <div className="bg-cream min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-ink mb-4">מאמר לא נמצא</h1>
                    <p className="text-ink-soft mb-8">המאמר המבוקש אינו קיים.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 rounded-pill bg-green text-ink px-6 py-3 font-semibold hover:bg-green-soft transition-colors"
                    >
                        חזרה למאמרים
                    </Link>
                </div>
            </div>
        );
    }

    // Get related articles (same category, excluding current)
    const related = ARTICLES.filter(
        (a) => a.category === article.category && a.slug !== article.slug
    ).slice(0, 3);

    return (
        <div className="bg-cream min-h-screen">
            {/* Article header */}
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
                <div className="relative max-w-4xl mx-auto px-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-green-soft transition-colors mb-8"
                    >
                        ← חזרה למאמרים
                    </Link>

                    <span className="inline-block rounded-pill bg-green/20 border border-green/30 px-4 py-1.5 text-sm font-medium text-green-soft mb-6">
                        {article.category}
                    </span>

                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        {article.title}
                    </h1>
                </div>
            </section>

            {/* Article body */}
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <article
                        className="prose prose-lg max-w-none
                            prose-headings:text-ink prose-headings:font-bold
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                            prose-p:text-ink-soft prose-p:leading-relaxed
                            prose-a:text-green-deep prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-ink
                            prose-ul:space-y-2 prose-li:text-ink-soft"
                        dir="rtl"
                    >
                        {article.content && (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        )}
                    </article>

                    {/* CTA */}
                    <div className="mt-16 p-8 bg-green/5 rounded-[var(--radius-card)] border border-green/20 text-center">
                        <p className="text-lg font-bold text-ink mb-2">
                            רוצים לדעת עוד? צרו איתנו קשר
                        </p>
                        <p className="text-ink-soft text-sm mb-6">
                            שירות מקצועי, מחירים הוגנים, משלוח מהיר
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/#quote"
                                className="inline-flex items-center gap-2 rounded-pill bg-green text-ink px-6 py-3 font-semibold hover:bg-green-soft transition-colors"
                            >
                                קבלו הצעת מחיר
                            </Link>
                            <a
                                href="tel:+97236911155"
                                className="inline-flex items-center gap-2 rounded-pill border border-green text-green-deep px-6 py-3 font-semibold hover:bg-green/10 transition-colors"
                                dir="ltr"
                            >
                                03-6911155
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related articles */}
            {related.length > 0 && (
                <section className="py-16 bg-white border-t border-line">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl font-extrabold text-ink mb-8">מאמרים נוספים</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((rel) => {
                                const isLocal = rel.local;
                                const Wrapper = isLocal ? Link : "a";
                                const wrapperProps = isLocal
                                    ? { href: `/blog/${rel.slug}` }
                                    : {
                                        href: rel.externalUrl!,
                                        target: "_blank" as const,
                                        rel: "noopener noreferrer",
                                    };

                                return (
                                    <Wrapper
                                        key={rel.slug}
                                        {...wrapperProps}
                                        className="group block"
                                    >
                                        <div className="bg-cream rounded-[var(--radius-card)] p-6 border border-line/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                            <span className="inline-block rounded-pill bg-green/10 text-green-deep text-xs font-semibold px-3 py-1 mb-3">
                                                {rel.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-green-deep transition-colors">
                                                {rel.title}
                                            </h3>
                                            <p className="text-sm text-ink-soft line-clamp-2">
                                                {rel.description}
                                            </p>
                                        </div>
                                    </Wrapper>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
