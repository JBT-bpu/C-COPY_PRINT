# C-Copy Website — Full Session Summary

## Project Overview
Premium website redesign for **C-Copy (שיא קופי)** — Israel's leading digital print house (est. 1986, Tel Aviv).
Built with **Next.js 15** (App Router, React 19), **Tailwind CSS 4**, **GSAP**, **Lenis**, and **motion** (framer-motion successor).

---

## Phase 1: Content & Real Business Data
All content scraped from the real ccopy.co.il website:
- **Process.tsx** — 4 real steps: שליחת קובץ → בדיקת קובץ → הדפסה → איסופ/משלוח
- **Marquee.tsx** — 18 real service names from the site
- **WhyUs.tsx** — Real company history text (1986, 38+ years, 3 branches, 500+ clients)
- **Footer.tsx** — 5-column layout with real menus, Facebook URL, branch addresses, phone numbers
- **About.tsx** — Real about text, stats grid, contact CTA
- **CopyCenter.tsx** — Real copy center text, 6 service cards, link to c-copy.copier.co.il

## Phase 2: Blog System
- **20 articles** in `blog-data.ts`
- **6 local SSG articles** scraped from ccopy.co.il with full Hebrew content
- **14 external articles** linking to ccopy.co.il
- Blog listing page at `/blog` with category filter
- Dynamic article pages at `/blog/[slug]` with SSG via `generateStaticParams`
- Blog link added to Nav and Footer

## Phase 3: Navigation Fix
- Nav was overlapping TopContactStrip (both fixed at top)
- Fixed by changing Nav to `top-14` initially, transitioning to `top-4` when scrolled

## Phase 4: Green Structural Band System
Designed per the sittmap.txt art direction brief — inspired by the physical C-Copy store's lime-green structural forms.

**Design Language:**
- Thick (40-80px), rounded (24-36px radius), architectural
- Low opacity (0.06-0.15) — subtle but visible
- CSS-based divs — no SVG paths (more reliable)
- Feels like manufactured panel edges, not graphic doodles

**Elements in GreenStrokeFlow.tsx:**
- Vertical structural ribbon (48px wide, right side, animates on scroll)
- Secondary vertical ribbon (40px, left side)
- Section frames (partial rounded outlines around Services, About, CTA)
- 5 horizontal structural bands at section transitions

**Section transitions in page.tsx:**
- Thick rounded horizontal panels between every section
- L-shaped corner wraps at key transitions
- Progressive prominence — wider/thicker toward CTA

## Phase 5: Print-Inspired Motion Effects
- **ScanLine** — 40%-width gradient bar sweeps across headings on scroll
  - Applied to 5 section headings: Services, About, Process, CopyCenter, Showcase
- **PrintHeadReveal** — reveals content with a green scanning line (inkjet print head effect)
- **CropMarks** — L-shaped registration marks appear on card hover
- **PrinterTrayReveal / PrinterSheet** — cards slide in like printed sheets from a tray

## Phase 6: Performance Optimization Pass
Completed by user. Key changes:

| Change | Saving / Effect |
|--------|----------------|
| Uninstalled `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three` | ~500KB+ of unused JS deps removed (3D PaperStack was never built) |
| Deleted 5 dead component files (SplitText, GreenStroke, RegistrationMarks, ServiceCard, Pill) | Source-tree cleanup |
| PrintHeadReveal stops hiding the LCP candidate | Was clipping hero `<h1>` to invisible for ~1.9s. Biggest single LCP win. |
| Hero PrintHeadReveal delay 0.5s → 0.2s, duration 1.8s → 1.4s | Faster reveal, snappier feel |
| Hero `<video preload="auto">` → `preload="metadata"` | Saves ~10-30MB mobile bandwidth on first paint |
| Added `disablePictureInPicture` to hero video | Removes iOS PiP button overlay |
| Fraunces: dropped roman + weights 400/900 | Only loads italic 600 + 700. ~40KB+ font payload saved |

**Build result:** Clean, 15 routes static, ~1MB JS / 66KB CSS uncompressed.

## Phase 7: SEO & Infrastructure
- `sitemap.ts` — homepage + /blog + 6 article routes
- `robots.ts` — allow all, sitemap reference
- `opengraph-image.tsx` — dynamic OG image
- JSON-LD LocalBusiness schema in layout
- API route at `/api/quote` for quote form submissions

---

## Current Known Issues

### ⚠️ Footer Undefined Variables (BLOCKING)
The terminal shows errors:
- `WIDE_FORMAT_LINKS is not defined` (Footer.tsx:78)
- `SELECTED_PRODUCTS is not defined` (Footer.tsx:97)
- `USEFUL_LINKS is not defined` (Footer.tsx:116)

These data arrays may have been accidentally deleted during the performance cleanup pass. The Footer component references them but they're missing. **This needs to be fixed.**

### ⚠️ .next Cache Corruption
The `.next` directory is corrupted (ENOENT errors for build-manifest.json, routes-manifest.json). Fix by deleting `.next` and restarting the dev server:
```
cd ccopy-site
rmdir /s /q .next
npm run dev
```

### Hero Poster 404
`/images/hero-poster.jpg` returns 404 — the file doesn't exist yet. Need to add a 1920×1080 JPG poster image at `public/images/hero-poster.jpg`.

### Non-Blocking
- CTA form hydration mismatch — browser autofill adds autocomplete styles. Cosmetic only.
- ScrollTrigger container warning — "ensure container has non-static position". Non-blocking.

---

## File Structure (Key Files)

```
ccopy-site/src/
├── app/
│   ├── page.tsx              # Homepage with structural band transitions
│   ├── layout.tsx            # Root layout (RTL, fonts, Lenis, metadata)
│   ├── globals.css           # Tailwind 4 theme tokens
│   ├── sitemap.ts            # Dynamic sitemap with blog routes
│   ├── robots.ts             # SEO robots
│   ├── opengraph-image.tsx   # Dynamic OG image
│   ├── not-found.tsx         # Branded 404
│   ├── blog/
│   │   ├── page.tsx          # Blog listing with category filter
│   │   └── [slug]/page.tsx   # Dynamic article pages (SSG)
│   └── api/quote/route.ts    # Quote form API
├── components/
│   ├── animations/
│   │   ├── ScanLine.tsx      # Scan-line heading effect
│   │   ├── PrintHeadReveal.tsx
│   │   ├── PrinterTrayReveal.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── MagneticWrapper.tsx
│   │   └── MorphBlob.tsx
│   ├── layout/
│   │   ├── Nav.tsx           # Floating pill nav
│   │   ├── TopContactStrip.tsx
│   │   ├── Footer.tsx        # 5-column footer ⚠️ needs data arrays fix
│   │   ├── ScrollProgressBar.tsx
│   │   └── WhatsAppFAB.tsx
│   ├── sections/
│   │   ├── Hero.tsx          # Video hero with print-head reveal
│   │   ├── Marquee.tsx       # 18 scrolling service names
│   │   ├── Services.tsx      # 4 categories, bento grid
│   │   ├── About.tsx         # Company story + stats
│   │   ├── Process.tsx       # 4-step pin-and-scroll
│   │   ├── CopyCenter.tsx    # 6 copy service cards
│   │   ├── Materials.tsx     # Paper/material cards
│   │   ├── Showcase.tsx      # Horizontal scroll gallery
│   │   ├── Upload.tsx        # File upload zone
│   │   ├── CTA.tsx           # Dark card with quote form
│   │   ├── Stats.tsx         # Hover-flip count-up cards
│   │   ├── Clients.tsx       # Client logo marquee
│   │   └── WhyUs.tsx         # Green section with reasons
│   ├── ui/
│   │   ├── GreenStrokeFlow.tsx  # Structural band overlay system
│   │   ├── CropMarks.tsx        # Hover crop marks + PaperLift
│   │   ├── Button.tsx, SectionTag.tsx, ServiceCard.tsx
│   └── providers/
│       └── LenisProvider.tsx
├── lib/
│   ├── blog-data.ts          # 20 articles (6 local, 14 external)
│   ├── gsap.ts               # GSAP + ScrollTrigger registration
│   ├── motion.ts             # usePrefersReducedMotion, useIsTouchDevice
│   └── utils.ts              # cn() utility
└── styles/
    └── animations.css        # Keyframes (marquee, float, scan-line-sweep)
```

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Styling | Tailwind CSS 4 (CSS-first @theme) |
| Animation | GSAP 3 + ScrollTrigger, motion (framer-motion) |
| Smooth Scroll | Lenis (desktop only) |
| Language | TypeScript strict, Hebrew RTL |
| Deployment | Static export ready |

---

## Pending Tasks
1. **Fix Footer data arrays** — WIDE_FORMAT_LINKS, SELECTED_PRODUCTS, USEFUL_LINKS are undefined
2. **Add hero poster image** — `public/images/hero-poster.jpg` (1920×1080 JPG, ~150KB)
3. **Host hero video locally** — `public/videos/hero.mp4` for best LCP (currently external ccopy.co.il URL)
4. **Run Lighthouse audit** — `npx lighthouse http://localhost:3000 --view`
5. **Build 3D PaperStack scene** — desktop-only, lazy-loaded (deps were uninstalled, would need re-adding)
