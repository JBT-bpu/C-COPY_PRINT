"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (reduce || isTouch) return;

    const lenis = new Lenis({ lerp: 0.1, duration: 1.2 });

    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
