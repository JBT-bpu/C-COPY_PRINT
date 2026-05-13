import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { CATEGORIES, type CategoryId } from "@/content/services";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = CATEGORIES.find((c) => c.id === slug);
    if (!category) return {};

    return {
        title: `${category.title} | C-COPY שיא קופי`,
        description: category.description,
    };
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params;
    const category = CATEGORIES.find((c) => c.id === (slug as CategoryId));
    if (!category) notFound();

    const otherCategories = CATEGORIES.filter((c) => c.id !== category.id);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-28 md:pt-36 pb-12 md:pb-20 px-5 md:px-10">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm text-ink-soft/70" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-green-deep transition-colors">
                            ראשי
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-ink">{category.title}</span>
                    </nav>

                    <div className="flex items-center gap-5 mb-6">
                        <div className="flex size-14 items-center justify-center rounded-[20px] bg-linear-to-br from-green/20 to-green/5 shadow-[inset_0_0_0_1px_rgba(141,198,65,0.24)]">
                            <BrandIcon name={category.icon} className="size-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink">
                            {category.title}
                        </h1>
                    </div>

                    <p className="text-lg md:text-xl text-ink-soft leading-relaxed max-w-2xl">
                        {category.description}
                    </p>
                </div>
            </section>

            {/* Sub-services grid */}
            <section className="pb-16 md:pb-24 px-5 md:px-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {category.services.map((service) => (
                            <article
                                key={service.title}
                                className={[
                                    "relative p-7 rounded-[28px] overflow-hidden",
                                    "bg-white/85 border border-ink/[0.06]",
                                    "shadow-[0_16px_40px_rgba(15,23,42,0.10)]",
                                ].join(" ")}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex size-10 items-center justify-center rounded-[14px] bg-linear-to-br from-green/20 to-green/5 shadow-[inset_0_0_0_1px_rgba(141,198,65,0.24)]">
                                        <BrandIcon name={service.icon} className="size-5" />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight text-ink">
                                        {service.title}
                                    </h2>
                                </div>

                                <p className="text-sm leading-relaxed text-ink-soft mb-4">
                                    {service.description}
                                </p>

                                {service.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {service.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green/10 text-green-deep"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pb-16 md:pb-24 px-5 md:px-10">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-green rounded-[32px] p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-3">
                            רוצים לקבל הצעת מחיר?
                        </h2>
                        <p className="text-ink/70 mb-6 max-w-md mx-auto">
                            ספרו לנו על הפרויקט ונחזור תוך שעה עם הצעה מותאמת.
                        </p>
                        <Link
                            href="/#quote"
                            className={[
                                "inline-flex items-center gap-2 rounded-pill",
                                "bg-ink text-cream px-7 py-3.5 text-base font-extrabold",
                                "shadow-lg shadow-ink/15",
                                "hover:bg-ink-soft transition-colors duration-300",
                            ].join(" ")}
                        >
                            קבלו הצעת מחיר
                            <span aria-hidden>←</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related services */}
            <section className="pb-16 md:pb-24 px-5 md:px-10">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-ink-soft/70 mb-6">
                        שירותים נוספים
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {otherCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/services/${cat.id}`}
                                className={[
                                    "inline-flex items-center gap-2.5 rounded-pill",
                                    "bg-white border border-line px-5 py-2.5 text-sm font-semibold text-ink",
                                    "hover:bg-green hover:border-green hover:text-ink transition-colors duration-200",
                                ].join(" ")}
                            >
                                <BrandIcon name={cat.icon} className="size-4" />
                                {cat.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
