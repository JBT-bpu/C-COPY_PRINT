"use client";

import Image from "next/image";
import { MagneticWrapper } from "@/components/animations/MagneticWrapper";
import { CropMarks } from "@/components/ui/CropMarks";
import { cn } from "@/lib/utils";

/**
 * Hero — green-bordered tray frame matching the rhythm of the other
 * trays (Technology, About, Products). Inside the frame, the video
 * fills the card and the headline + CTAs are centered on top of it.
 *
 * Video renders on all devices (playsInline + preload="metadata" for
 * progressive mobile streaming). A dark scrim keeps text readable.
 */
export function Hero() {
    return (
        <section
            id="hero"
            aria-label="Hero"
            className="relative pt-20 md:pt-28 pb-8 md:pb-20 px-4 md:px-10"
        >
            <div
                className={cn(
                    "relative max-w-7xl mx-auto",
                    "rounded-[36px] md:rounded-[44px] overflow-hidden",
                    "bg-ink border-[12px] md:border-[22px] border-green",
                    "shadow-[0_10px_0_0_var(--color-green-deep),0_30px_80px_rgba(141,198,65,0.30)]",
                    "aspect-video"
                )}
            >
                <CropMarks color="var(--color-cream)" inset={50} />
                <HeroRegistration />
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

                {/* Dark scrim — keeps centered text readable */}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-ink/45 pointer-events-none"
                />

                {/* Print-scan sweep — continuous vertical bar passes over the video,
                    invoking a plotter/flatbed scanner reading the hero. */}
                <div className="scan-line" aria-hidden />

                {/* Centered overlay — kicker, headline, paragraph, CTAs */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 py-8 md:py-12 overflow-y-auto">
                    <span className="inline-flex items-center gap-2.5 rounded-pill bg-cream/95 backdrop-blur-sm border border-cream/40 px-4 py-2 shadow-sm mb-6">
                        <span className="flex gap-1" aria-hidden>
                            <span className="w-4 h-1.5 rounded-full bg-green" />
                            <span className="w-2 h-1.5 rounded-full bg-green-deep" />
                        </span>
                        <Image
                            src="/images/logo.png"
                            alt="C-Copy — שיא קופי"
                            width={120}
                            height={32}
                            className="h-6 md:h-7 w-auto"
                        />
                    </span>

                    <h1 className="font-extrabold tracking-tight leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream mb-4 sm:mb-6 max-w-3xl [text-shadow:0_2px_24px_rgba(15,26,5,0.55)]">
                        דפוס שמתקדם
                        <br />
                        <span className="font-display font-light text-green-soft print-reveal">
                            עסק שנראה טוב
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-cream/90 leading-relaxed max-w-xl mb-6 sm:mb-8 [text-shadow:0_2px_18px_rgba(15,26,5,0.55)]">
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
            </div>
        </section>
    );
}

/**
 * CMYK registration intro — four colored crosshair marks at the corners
 * of the hero card. Each starts offset outward and converges into
 * registration over ~700ms, then fades out. Pure CSS animation
 * (.register-mark + @keyframes register-converge in globals.css);
 * fires once on mount.
 */
function HeroRegistration() {
    const inkSize = 22; // arm length
    const inkThick = 2;
    const drift = 14; // initial offset in px
    const inset = 52; // margin from card edge (clears rounded corner)

    const corners: Array<{
        color: string;
        pos: string;
        rx: string;
        ry: string;
        delay: string;
    }> = [
        { color: "#00AEEF", pos: `top-[${inset}px] start-[${inset}px]`, rx: `${drift}px`, ry: `-${drift}px`, delay: "0s" },
        { color: "#EC008C", pos: `top-[${inset}px] end-[${inset}px]`, rx: `-${drift}px`, ry: `-${drift}px`, delay: "0.08s" },
        { color: "#FFF200", pos: `bottom-[${inset}px] start-[${inset}px]`, rx: `${drift}px`, ry: `${drift}px`, delay: "0.16s" },
        { color: "#0F1A05", pos: `bottom-[${inset}px] end-[${inset}px]`, rx: `-${drift}px`, ry: `${drift}px`, delay: "0.24s" },
    ];

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
            {corners.map((c, i) => (
                <span
                    key={i}
                    className={cn("register-mark absolute block", c.pos)}
                    style={{
                        ["--rx" as string]: c.rx,
                        ["--ry" as string]: c.ry,
                        animationDelay: c.delay,
                        width: `${inkSize}px`,
                        height: `${inkSize}px`,
                    }}
                >
                    {/* Horizontal arm */}
                    <span
                        className="absolute top-1/2 left-0 right-0"
                        style={{
                            height: `${inkThick}px`,
                            background: c.color,
                            transform: "translateY(-50%)",
                            mixBlendMode: "multiply",
                        }}
                    />
                    {/* Vertical arm */}
                    <span
                        className="absolute left-1/2 top-0 bottom-0"
                        style={{
                            width: `${inkThick}px`,
                            background: c.color,
                            transform: "translateX(-50%)",
                            mixBlendMode: "multiply",
                        }}
                    />
                </span>
            ))}
        </div>
    );
}
