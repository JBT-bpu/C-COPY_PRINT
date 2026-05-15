"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ScanLine } from "@/components/animations/ScanLine";
import { SplitText } from "@/components/animations/SplitText";
import { CountUp } from "@/components/ui/CountUp";
import { CropMarks } from "@/components/ui/CropMarks";
import { SectionTag } from "@/components/ui/SectionTag";

/**
 * About / Introduction section with real text scraped from ccopy.co.il.
 * Sittmap position: between Services and Process.
 */
export function About() {
    return (
        <section
            id="about"
            className="relative py-10 md:py-20 overflow-hidden"
            aria-label="אודות"
        >
            <div className="relative max-w-7xl mx-auto px-4 md:px-10">
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center p-5 md:p-14 rounded-[28px] md:rounded-[44px] bg-white border-[10px] md:border-[22px] border-green shadow-[0_10px_0_0_var(--color-green-deep),0_30px_80px_rgba(141,198,65,0.30)]">
                    <CropMarks />
                    {/* Text column */}
                    <div>
                        <SectionTag>אודותינו</SectionTag>

                        <ScrollReveal>
                            <ScanLine>
                                <SplitText stagger={0.04} duration={0.7} offsetY={30}>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-6">
                                        בית דפוס
                                        <span className="font-display font-light text-green-deep"> שיא קופי </span>
                                        תל אביב
                                    </h2>
                                </SplitText>
                            </ScanLine>
                        </ScrollReveal>

                        <ScrollReveal delay={0.1}>
                            <p className="text-lg text-ink-soft leading-relaxed mb-6">
                                שיא קופי בית דפוס תל אביב מוביל את תחום הדפוס והעתקות האור בישראל
                                משנת 1986. לאורך השנים צברה החברה מוניטין, כאחת החברות האיכותיות
                                והידועות בזכות רמת החדשנות הטכנולוגית, רמת השירות ללקוחות, רמת
                                האמינות והמחירים ההוגנים.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.15}>
                            <p className="text-lg text-ink-soft leading-relaxed mb-6">
                                אנו שיא קופי בתי דפוס בתל אביב משקיעים רבות בטכנולוגיות ומתודולוגיות
                                עבודה על מנת להמשיך ולהוביל את תחום הדפוס בישראל.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <p className="text-base text-ink-soft/80 leading-relaxed">
                                חזוננו הינו למנף את החידושים בתחום הדפוס העולמי על מנת להוות את
                                השחקן המרכזי בשוק המקומי ולהמשיך ולספק פתרונות דפוס ושיווק הטובים
                                ביותר בישראל. הצלחתנו לאורך השנים תמונה בקהילת הלקוחות החזקה שלנו
                                המעידה על אמינות השרות והדיסקרטיות ללא דופי.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Stats / highlights column */}
                    <div>
                        <ScrollReveal delay={0.1}>
                            <div className="grid grid-cols-2 gap-3 sm:gap-6">
                                {[
                                    { to: 1986, suffix: "", label: "שנת הקמה", accent: true, duration: 1.4 },
                                    { to: 38, suffix: "+", label: "שנות ניסיון", duration: 0.9 },
                                    { to: 3, suffix: "", label: "סניפים במרכז", duration: 0.8 },
                                    { to: 500, suffix: "+", label: "לקוחות מרוצים", duration: 1.1 },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="relative bg-white rounded-2xl sm:rounded-[var(--radius-card)] p-4 sm:p-8 text-center shadow-sm border border-line/50"
                                    >
                                        <p
                                            className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 ${"accent" in stat && stat.accent
                                                ? "text-green-deep"
                                                : "text-ink"
                                                }`}
                                        >
                                            <CountUp to={stat.to} suffix={stat.suffix} duration={stat.duration} />
                                        </p>
                                        <p className="text-sm text-ink-soft font-medium">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-[var(--radius-card)] p-5 sm:p-8 border border-line/50">
                                <p className="text-ink text-lg font-bold mb-2">צרו קשר</p>
                                <p className="text-ink-soft text-sm mb-4">
                                    שירות אישי ומקצועי בכל סניף — או הזמינו מרחוק ונשלח עד אליכם.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="tel:+97236911155"
                                        className="inline-flex items-center gap-2 rounded-pill bg-green text-ink px-5 py-2.5 text-sm font-semibold hover:bg-green-soft transition-colors"
                                    >
                                        03-6911155
                                    </a>
                                    <a
                                        href="#quote"
                                        className="inline-flex items-center gap-2 rounded-pill border border-green text-green-deep px-5 py-2.5 text-sm font-semibold hover:bg-green/10 transition-colors"
                                    >
                                        קבלו הצעת מחיר
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
