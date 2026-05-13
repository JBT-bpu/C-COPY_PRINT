import { Nav } from "@/components/layout/Nav";
import { BrandStroke } from "@/components/ui/BrandStroke";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Clients } from "@/components/sections/Clients";
import { Technology } from "@/components/sections/Technology";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Quote } from "@/components/sections/Quote";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";

/**
 * Homepage — matches designes/11.png (per GLM5FROMC/PLAN.md)
 * with additional content sections per FULL-IMPLEMENTATION-PLAN.md.
 *
 * Section flow:
 *   1. Hero — cream split layout, headline right, dark video card left
 *   2. Services — 6 cards on a lime-green inset tray
 *   3. Clients — trust strip marquee (typeset names)
 *   4. Technology — wide white card, split text + simulated press image
 *   5. About — 1986 founding story + stats
 *   6. Process — 5-step how-it-works grid
 *   7. Products — 4 cards with CSS sample visuals
 *   8. Quote — form card framed by a green inset border
 *   9. Footer — compact 3-column
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative">
        <BrandStroke />
        <Hero />
        <Services />
        <Clients />
        <Technology />
        <About />
        <Process />
        <Products />
        <Quote />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
