# Print-House Visual Overhaul Plan

## Goal
Transform the current clean/bright C-Copy site into a **print-house digital experience** — where the website feels like the digital extension of the physical shop. Add a **green stroke system**, **print-production animations**, and **new sections** (Materials, Upload).

---

## Phase 1: Green Stroke System

### 1.1 Build `GreenStroke` SVG Component
**File:** `src/components/ui/GreenStroke.tsx`

A reusable SVG component that renders rounded green bands/curves. Props:
- `variant`: "band" | "curve" | "arc" | "frame"
- `position`: "top" | "bottom" | "left" | "right"
- `size`: number (stroke width)
- `opacity`: number
- `animated`: boolean (draw-on-scroll via GSAP)

Variants:
- **band** — Full-width horizontal rounded green bar (like the physical store counter edge)
- **curve** — Large quarter-circle arc (like the rounded wall structures)
- **arc** — Smaller decorative arc behind headings
- **frame** — Rounded rectangle frame that wraps around a card or heading

### 1.2 Inter-Section Green Stroke Connectors
Add green stroke elements between sections to create visual flow:

```
Hero → Marquee: Green curve arc overlapping both sections
Marquee → Stats: Green band fades into cream
Stats → Services: Subtle green stroke line
Services → WhyUs: Green rounded frame wraps the transition
WhyUs → Process: Green band flows from green section into cream
Process → Showcase: Green arc decorative element
Showcase → Clients → CTA: Green stroke accents
```

These will be placed as absolutely-positioned SVG elements within each section or as standalone `<GreenStroke>` components between sections in `page.tsx`.

### 1.3 Green Stroke Frames Behind Headings
Add decorative green rounded-rectangle frames behind section headings:
- Semi-transparent green stroke
- Rounded corners matching `--radius-card`
- Animated draw-on-scroll (GSAP `stroke-dashoffset`)
- Applied to: Services h2, WhyUs h2, Process h2, Showcase h2

---

## Phase 2: Print-Production Animations

### 2.1 `PrintHeadReveal` — Hero Headline Animation
**File:** `src/components/animations/PrintHeadReveal.tsx`

Replaces the current GSAP word-reveal (y:80, opacity:0) with a **print-head scanning effect**:

1. A thin green horizontal line (the "print head") starts at the top of the headline
2. It scans downward, and text appears behind it as it passes
3. The line moves at a steady pace, like a real inkjet head
4. After the pass, the line fades away with a subtle green glow

Implementation:
- GSAP timeline: mask `clipPath` animates from top to bottom
- Green line div moves with the clip path
- Text is always there, just clipped — no layout shift
- Reduced-motion fallback: instant reveal

### 2.2 `PrinterTrayReveal` — Card Entrance Animation
**File:** `src/components/animations/PrinterTrayReveal.tsx`

Service cards enter like printed sheets sliding out of a printer tray:

1. Cards start below their final position, slightly rotated
2. They slide up into place with a subtle paper-like ease
3. Staggered timing — first card arrives, then second, etc.
4. Very slight shadow grows as card "emerges"

Implementation:
- GSAP ScrollTrigger entrance
- `from: { y: 60, rotate: 0.5, opacity: 0, boxShadow: "none" }`
- `to: { y: 0, rotate: 0, opacity: 1, boxShadow: "soft" }`
- Stagger: 0.1s between cards

### 2.3 `CropMarks` + `PaperLift` Hover Effects
**File:** `src/components/ui/CropMarks.tsx`

Subtle print-production hover details on service cards:

**CropMarks:**
- Four small L-shaped marks at card corners (like registration marks)
- Hidden by default, appear on hover with fade-in
- Green color, thin strokes
- Positioned at card corners with small offset

**PaperLift:**
- On hover, the card's top-right corner lifts slightly (perspective transform)
- Subtle shadow appears under the lifted corner
- Combined with the existing `-translate-y-2` hover

### 2.4 Update Hero Section
Modify `Hero.tsx`:
- Replace GSAP word-reveal with `PrintHeadReveal` animation
- Keep the MorphBlob and architectural arc
- Add a green stroke band at the bottom of the hero that flows into the Marquee

### 2.5 Update Services Section
Modify `Services.tsx`:
- Replace `ScrollReveal` wrapper with `PrinterTrayReveal`
- Add `CropMarks` overlay to each card
- Add `PaperLift` hover effect
- Keep existing card variants (default, soft, green)

---

## Phase 3: New Sections

### 3.1 Materials Section
**File:** `src/components/sections/Materials.tsx`

Shows different print materials in a grid:
- Paper types (coated, uncoated, recycled)
- Vinyl / sticker materials
- Rigid substrates (alucobond, acrylic, wood)
- Canvas / fabric
- Specialty (metallic, transparent, magnetic)

Design:
- Each material is a card with a colored swatch/texture placeholder
- Green stroke frame around the section heading
- Cards use `PrinterTrayReveal` entrance
- Hover shows a subtle paper-lift effect

### 3.2 Upload / Order Section
**File:** `src/components/sections/Upload.tsx`

File upload area for sending print files:
- Drag-and-drop zone with dashed green border
- File type icons (PDF, AI, PSD, etc.)
- "Or browse files" button
- Progress indicator (green bar)
- Links to WhatsApp for quick orders

Design:
- Clean white card with rounded corners
- Green dashed border drag zone
- Green stroke accents
- Integrates with existing CTA section or replaces part of it

---

## Phase 4: Service List Update

### 4.1 Expand Services Data
Update `Services.tsx` SERVICES array to include:
1. כרטיסי ביקור (Business Cards)
2. סטיקרים (Stickers)
3. שלטים (Signs)
4. אלוקובונד (Alucobond)
5. פליירים (Flyers)
6. פוסטרים (Posters)
7. באנרים (Banners)
8. לוחות קאפה (Kappa Boards)
9. הדפסה מותאמת (Custom Printing)

Each with appropriate Lucide icon, Hebrew tags, and description.

### 4.2 Update CTA Form Dropdown
Update `CTA.tsx` SERVICES dropdown to match the new service list.

---

## Phase 5: Section Heading Effects

### 5.1 Print-Reveal Headings
Add a subtle print-reveal effect to section headings:
- A green line sweeps across behind the heading text
- The line acts as an underline that draws itself on scroll
- Implemented via GSAP `stroke-dashoffset` on an SVG line

### 5.2 Green Stroke Accents on Headings
- Each section heading gets a decorative green rounded stroke element
- Positioned behind or beside the heading
- Animated on scroll entry

---

## Implementation Order

```
1. GreenStroke component (reusable SVG)
2. PrintHeadReveal animation component
3. PrinterTrayReveal animation component
4. CropMarks + PaperLift hover components
5. Update Hero with print-head reveal + green stroke band
6. Update Services with new list + printer-tray + crop marks
7. Add inter-section green stroke connectors in page.tsx
8. Add green stroke frames behind headings
9. Build Materials section
10. Build Upload/Order section
11. Update CTA form dropdown
12. Production build + visual QA
```

---

## Files to Create
- `src/components/ui/GreenStroke.tsx`
- `src/components/animations/PrintHeadReveal.tsx`
- `src/components/animations/PrinterTrayReveal.tsx`
- `src/components/ui/CropMarks.tsx`
- `src/components/sections/Materials.tsx`
- `src/components/sections/Upload.tsx`

## Files to Modify
- `src/components/sections/Hero.tsx` — Print-head reveal + green stroke band
- `src/components/sections/Services.tsx` — New service list + printer-tray + crop marks
- `src/components/sections/CTA.tsx` — Updated dropdown
- `src/app/page.tsx` — Add Materials, Upload sections + green stroke connectors
- `src/app/globals.css` — Any new CSS tokens needed
