# C-COPY Implementation Plan

> **Created:** 2026-05-05
> **Status:** Foundation complete, sections phase starting

---

## ✅ Foundation Phase — COMPLETE

| # | Task | Status |
|---|------|--------|
| 1 | Install runtime + animation dependencies | ✅ |
| 2 | Configure Tailwind 4 @theme tokens in globals.css | ✅ |
| 3 | Set up Rubik + Fraunces fonts via next/font | ✅ |
| 4 | Build RTL root layout with metadata | ✅ |
| 5 | Build LenisProvider with reduced-motion + touch guards | ✅ |
| 6 | Add cn() helper + usePrefersReducedMotion hook | ✅ |
| 7 | Replace boilerplate page with placeholder Hero shell | ✅ |
| 8 | Smoke test — production build passes | ✅ |

---

## 🏗️ Sections Phase — IN PROGRESS

### Phase 1: Shared Components (Dependencies for everything)

| # | Component | File | Status |
|---|-----------|------|--------|
| 9a | ScrollReveal | `src/components/animations/ScrollReveal.tsx` | ⬜ |
| 9b | SplitText | `src/components/animations/SplitText.tsx` | ⬜ |
| 9c | MagneticWrapper | `src/components/animations/MagneticWrapper.tsx` | ⬜ |
| 9d | MorphBlob | `src/components/animations/MorphBlob.tsx` | ⬜ |
| 10a | Button (magnetic) | `src/components/ui/Button.tsx` | ⬜ |
| 10b | Pill | `src/components/ui/Pill.tsx` | ⬜ |
| 10c | SectionTag | `src/components/ui/SectionTag.tsx` | ⬜ |
| 10d | ServiceCard | `src/components/ui/ServiceCard.tsx` | ⬜ |

### Phase 2: Nav + Hero (The WOW moment)

| # | Section | File | Status |
|---|---------|------|--------|
| 11 | Nav — floating pill bar | `src/components/layout/Nav.tsx` | ⬜ |
| 12 | Hero — blob + word reveal + magnetic CTA | `src/components/sections/Hero.tsx` | ⬜ |
| 13 | 3D PaperStack (desktop-only) | `src/components/3d/PaperStack.tsx` + `Scene.tsx` | ⬜ |

### Phase 3: Page Sections (top to bottom)

| # | Section | File | Status |
|---|---------|------|--------|
| 14 | Marquee — scroll-velocity responsive | `src/components/sections/Marquee.tsx` | ⬜ |
| 15 | Stats — count-up + hover-flip + 3D tilt | `src/components/sections/Stats.tsx` | ⬜ |
| 16 | Services — asymmetric bento grid | `src/components/sections/Services.tsx` | ⬜ |
| 17 | WhyUs — green bg, rounded-t, numbered cards | `src/components/sections/WhyUs.tsx` | ⬜ |
| 18 | Process — GSAP pin-and-scroll | `src/components/sections/Process.tsx` | ⬜ |
| 19 | Showcase — horizontal scroll gallery | `src/components/sections/Showcase.tsx` | ⬜ |
| 20 | Clients Marquee — logo strip | `src/components/sections/Clients.tsx` | ⬜ |
| 21 | CTA + Quote Form — dark card + Resend API | `src/components/sections/CTA.tsx` + `src/app/api/quote/route.ts` | ⬜ |

### Phase 4: Layout Shell + Extras

| # | Section | File | Status |
|---|---------|------|--------|
| 22 | Footer — 4-column layout | `src/components/layout/Footer.tsx` | ⬜ |
| 23 | WhatsApp FAB — floating button | `src/components/layout/WhatsAppFAB.tsx` | ⬜ |
| 24 | Branded 404 page | `src/app/not-found.tsx` | ⬜ |

### Phase 5: SEO + Polish

| # | Task | Status |
|---|------|--------|
| 25a | opengraph-image.tsx | ⬜ |
| 25b | robots.ts | ⬜ |
| 25c | sitemap.ts | ⬜ |
| 25d | JSON-LD LocalBusiness schema | ⬜ |
| 26 | Skip-to-content link + a11y audit | ⬜ |
| 27 | Final polish: 375px testing, RTL, reduced-motion, Lighthouse 90+ | ⬜ |

---

## 🎯 Key Architecture Decisions

### Mobile Degradation Strategy

| Feature | Desktop | Mobile |
|---|---|---|
| Lenis smooth scroll | On | **Off** (native scroll) |
| 3D Paper Stack | On | **Static image** |
| Hero blob morph | On | On (cheap SVG) |
| Stats card 3D tilt | On | **Off** |
| Showcase horizontal pin | GSAP pin | **scroll-snap-x** |
| Process pin sequence | GSAP pin | **Static numbered list** |

### `prefers-reduced-motion` Overrides
- No SplitText (text appears instantly)
- No magnetic buttons
- No tilt
- No marquee scroll-velocity coupling (constant speed)
- Process steps: static
- Lenis: off

### Critical Technical Notes
1. **Lenis + GSAP ScrollTrigger sync** — must call `ScrollTrigger.refresh()` after init and on resize
2. **Process pin + Lenis + RTL** — the #1 thing that breaks. Test on Safari iOS specifically
3. **3D PaperStack** — `dynamic(() => import(...), { ssr: false })`, only render ≥1024px, only when hero in viewport, not under reduced-motion
4. **RTL awareness** — WhatsApp FAB goes LEFT in RTL, arrows `←` read as "forward", numbers/phones stay LTR
5. **Use logical properties** — `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*` instead of `ml-*`/`mr-*`

### Performance Targets
- Lighthouse Performance: **90+ mobile**, 95+ desktop
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- Hero image: `next/image`, AVIF, `priority`, dimensions set
- Fonts: `display: 'swap'`, preload only Rubik 400/700 + Fraunces 600 italic
- GSAP: import only ScrollTrigger + SplitText, not full bundle
- 3D scene: own chunk via `dynamic()`

---

## 📁 Target File Structure

```
src/
├── app/
│   ├── layout.tsx              ✅ Root layout, RTL setup, Lenis provider
│   ├── page.tsx                🔄 Homepage — currently placeholder, will assemble sections
│   ├── globals.css             ✅ Tailwind v4 import + @theme tokens
│   ├── fonts.ts                ✅ next/font config
│   ├── not-found.tsx           ⬜ Branded 404
│   ├── opengraph-image.tsx     ⬜ Auto-generated OG image
│   ├── robots.ts               ⬜ SEO
│   ├── sitemap.ts              ⬜ SEO
│   └── api/
│       └── quote/route.ts      ⬜ Quote form handler (Resend)
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             ⬜
│   │   ├── Footer.tsx          ⬜
│   │   └── WhatsAppFAB.tsx     ⬜
│   ├── sections/
│   │   ├── Hero.tsx            ⬜
│   │   ├── Marquee.tsx         ⬜
│   │   ├── Stats.tsx           ⬜
│   │   ├── Services.tsx        ⬜
│   │   ├── WhyUs.tsx           ⬜
│   │   ├── Process.tsx         ⬜
│   │   ├── Clients.tsx         ⬜
│   │   ├── Showcase.tsx        ⬜
│   │   └── CTA.tsx             ⬜
│   ├── ui/
│   │   ├── Button.tsx          ⬜
│   │   ├── Pill.tsx            ⬜
│   │   ├── ServiceCard.tsx     ⬜
│   │   └── SectionTag.tsx      ⬜
│   ├── animations/
│   │   ├── ScrollReveal.tsx    ⬜
│   │   ├── SplitText.tsx       ⬜
│   │   ├── MagneticWrapper.tsx ⬜
│   │   └── MorphBlob.tsx       ⬜
│   ├── 3d/
│   │   ├── PaperStack.tsx      ⬜ Desktop-only — gated
│   │   └── Scene.tsx           ⬜
│   └── providers/
│       └── LenisProvider.tsx   ✅
├── lib/
│   ├── gsap.ts                 ✅ GSAP registration helper
│   ├── motion.ts               ✅ Reduced-motion hook + isTouchDevice
│   └── utils.ts                ✅ cn() helper
└── styles/
    └── animations.css          ⬜ Shared animation keyframes
```

---

**Ready to build. Let's make their competitors jealous. 🚀**
