"use client";

import { BrandIcon } from "@/components/ui/BrandIcon";
import { MagneticWrapper } from "@/components/animations/MagneticWrapper";
import { useIsTouchDevice } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Hero — green-bordered tray frame matching the rhythm of the other
 * trays (Technology, About, Products). Inside the frame, the video
 * fills the card and the headline + CTAs are centered on top of it.
 *
 * On touch devices the <video> element is omitted (it's a 13.5 MB asset)
 * and the dark backdrop stands in until /images/hero-poster.jpg is
 * provided.
 */
export function Hero() {
    const isTouch = useIsTouchDevice();

    return (
        <section
            id="hero"
            aria-label="Hero"
            className="relative pt-24 md:pt-28 pb-12 md:pb-20 px-5 md:px-10"
        >
            <div
                className={cn(
                    "relative max-w-7xl mx-auto",
                    "rounded-[36px] md:rounded-[44px] overflow-hidden",
                    "bg-ink border-[22px] border-green",
                    "shadow-[0_10px_0_0_var(--color-green-deep),0_30px_80px_rgba(141,198,65,0.30)]",
                    "min-h-[72vh] md:min-h-[78vh]"
                )}
            >
                {!isTouch && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/images/hero-poster.jpg"
                        disablePictureInPicture
                        className="absolute inset-0 w-full h-full object-cover"
                        aria-hidden
                    >
                        <source src="/videos/hero.mp4" type="video/mp4" />
                    </video>
                )}

                {/* Dark scrim — keeps centered text readable */}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-ink/45 pointer-events-none"
                />

                {/* Print-scan sweep — continuous vertical bar passes over the video,
                    invoking a plotter/flatbed scanner reading the hero. */}
                <div className="scan-line" aria-hidden />

                {/* Centered overlay — kicker, headline, paragraph, CTAs */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[inherit] px-6 py-16 md:py-24">
                    <span className="inline-flex items-center gap-2.5 rounded-pill bg-cream/95 backdrop-blur-sm border border-cream/40 px-4 py-2 text-xs md:text-sm font-semibold text-ink shadow-sm mb-6">
                        <span className="flex gap-1" aria-hidden>
                            <span className="w-4 h-1.5 rounded-full bg-green" />
                            <span className="w-2 h-1.5 rounded-full bg-green-deep" />
                        </span>
                        C-COPY · בית דפוס דיגיטלי מאז 1986
                    </span>

                    <h1 className="font-extrabold tracking-tight leading-[0.98] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream mb-6 max-w-3xl [text-shadow:0_2px_24px_rgba(15,26,5,0.55)]">
                        דפוס שמתקדם
                        <br />
                        <span className="font-display italic text-green-soft">
                            עסק שנראה טוב
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-cream/90 leading-relaxed max-w-xl mb-8 [text-shadow:0_2px_18px_rgba(15,26,5,0.55)]">
                        פתרונות דפוס, שילוט, פורמט רחב, מכון העתקות והדפסה על חומרים —
                        הכל במקום אחד, עם תוצאה חדה ומקצועית.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <MagneticWrapper strength={0.3}>
                            <a
                                href="#quote"
                                className={cn(
                                    "group inline-flex items-center gap-3 rounded-pill",
                                    "bg-green text-ink px-7 py-3.5 md:px-8 md:py-4 text-base md:text-lg font-extrabold",
                                    "shadow-lg shadow-green/40",
                                    "hover:bg-green-soft hover:shadow-xl hover:shadow-green/55",
                                    "transition-all duration-300",
                                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                                )}
                            >
                                קבלו הצעת מחיר
                                <span
                                    className="inline-block transition-transform duration-300 group-hover:-rotate-45"
                                    aria-hidden
                                >
                                    ←
                                </span>
                            </a>
                        </MagneticWrapper>

                        <a
                            href="#services"
                            className={cn(
                                "inline-flex items-center gap-2 rounded-pill",
                                "bg-cream/10 backdrop-blur-sm border border-cream/40 text-cream",
                                "px-7 py-3.5 md:px-8 md:py-4 text-base md:text-lg font-extrabold",
                                "hover:bg-cream/20 hover:border-cream/70",
                                "transition-all duration-300",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                            )}
                        >
                            השירותים שלנו
                        </a>
                    </div>

                    <a
                        href="https://wa.me/972723316655"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cream/85 hover:text-green-soft transition-colors mt-5 [text-shadow:0_2px_12px_rgba(15,26,5,0.55)]"
                    >
                        או דברו איתנו בוואטסאפ ←
                    </a>
                </div>

                {/* Floating green play control — bottom-end corner */}
                <button
                    type="button"
                    aria-label="נגן סרטון תדמית"
                    className={cn(
                        "absolute bottom-6 end-6 md:bottom-8 md:end-8 z-20",
                        "flex size-14 md:size-16 items-center justify-center rounded-full",
                        "bg-green text-ink shadow-xl shadow-green/50",
                        "hover:scale-110 hover:bg-green-soft transition-transform duration-300",
                        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
                    )}
                >
                    <BrandIcon name="play-video" className="size-6 md:size-7 ms-1" />
                </button>
            </div>
        </section>
    );
}
