"use client";

import { TitleLine } from "@/components/animations/TitleLine";
import { CropMarks } from "@/components/ui/CropMarks";
import { cn } from "@/lib/utils";

/**
 * Split section — title + paragraph + CTA on one side, simulated
 * print-press "image" on the other. Matches ccopy_maximum_wow_html_demo.html
 * §technology / split-section. The .print-image div is a pure CSS
 * stand-in for real print-press photography until real photos arrive.
 */
export function Technology() {
    return (
        <section
            id="technology"
            aria-label="טכנולוגיה"
            className="relative py-10 md:py-24 px-4 md:px-10"
        >
            <div className="max-w-7xl mx-auto">
                <div
                    className={cn(
                        "relative grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-center gap-8 md:gap-12",
                        "p-5 md:p-14 rounded-[28px] md:rounded-[44px]",
                        "bg-white border-[10px] md:border-[22px] border-green",
                        "shadow-[0_10px_0_0_var(--color-green-deep),0_30px_80px_rgba(141,198,65,0.30)]"
                    )}
                >
                    <CropMarks />
                    {/* Copy */}
                    <div>
                        <p className="text-green-deep font-extrabold text-sm md:text-base tracking-wide mb-2">
                            טכנולוגיה. אנשים. תוצאה.
                        </p>
                        <TitleLine>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-ink max-w-2xl text-balance mb-5">
                                הדפסה שמרגישה מדויקת כבר מהקובץ הראשון
                            </h2>
                        </TitleLine>
                        <p className="text-ink-soft text-base md:text-lg leading-relaxed mb-7 max-w-lg">
                            מכונות HP Indigo, מדפסות UV, ציוד פורמט רחב מהדור האחרון —
                            וצוות שמלווה אתכם מבדיקת קובץ ועד גימור מקצועי. נקי, ירוק,
                            מדויק, עם תנועה של מכונה וחוויה שמובילה מהר להצעת מחיר.
                        </p>
                        <a
                            href="#process"
                            className={cn(
                                "inline-flex items-center gap-2 rounded-pill",
                                "bg-linear-to-br from-green to-green-soft text-ink",
                                "px-6 py-3 text-base font-extrabold",
                                "shadow-[0_14px_30px_rgba(141,198,65,0.35)]",
                                "hover:-translate-y-0.5 transition-transform duration-300",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                            )}
                        >
                            איך אנחנו עובדים
                            <span aria-hidden>←</span>
                        </a>
                    </div>

                    {/* Print-press "image" — CSS-only simulation. Swap with a real
                        photo at /public/images/press.jpg by replacing this <div>. */}
                    <div className="print-image" aria-hidden />
                </div>
            </div>
        </section>
    );
}
