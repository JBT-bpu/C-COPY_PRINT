import type { Metadata, Viewport } from "next";
import { rubik, fraunces } from "./fonts";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PrintFilterDefs } from "@/components/ui/PrintFilters";
import { cn } from "@/lib/utils";
import { BRANCHES, phoneToE164 } from "@/content/branches";
import { buildFaqJsonLd } from "@/content/faq";
import { CATEGORIES } from "@/content/services";
import "./globals.css";

const SITE_URL = "https://www.ccopy.co.il";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: "C-Copy / שיא קופי",
  alternateName: "שיא קופי",
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  email: "info@c-copy.co.il",
  foundingDate: "1986",
  description:
    "בית הדפוס המוביל בתל אביב מאז 1986 — דפוס דיגיטלי, פורמט רחב, אריזות ומרכז העתקות.",
  sameAs: [
    "https://www.facebook.com/ccopy",
    "https://www.instagram.com/ccopy",
  ],
  location: BRANCHES.map((b) => ({
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#${b.id}`,
    name: `C-Copy ${b.name}`,
    telephone: phoneToE164(b.phone),
    email: b.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.streetAddress,
      addressLocality: b.addressLocality,
      addressCountry: "IL",
    },
  })),
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ccopy.co.il"),
  title: {
    default: "בית דפוס שיא קופי — בית דפוס מוביל בתל אביב מ-1986",
    template: "%s · שיא קופי",
  },
  description:
    "מדפיסים את הרעיונות שלכם בלי להתפשר. דפוס דיגיטלי, מרכז העתקות, פורמט רחב, אריזות ופתרונות מותאמים אישית — מתל אביב לכל הארץ.",
  applicationName: "C-Copy / שיא קופי",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "C-Copy / שיא קופי",
    title: "שיא קופי — בית דפוס מוביל בתל אביב מ-1986",
    description: "מדפיסים את הרעיונות שלכם בלי להתפשר.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAFBF6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={cn(rubik.variable, fraunces.variable, "antialiased")}
    >
      <body className="bg-green text-ink min-h-dvh font-sans">
        {/* SVG filter definitions for print-house effects (hidden) */}
        <PrintFilterDefs />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              CATEGORIES.map((c) => ({
                "@type": "Service",
                name: c.title,
                description: c.description,
                provider: {
                  "@type": "Organization",
                  name: "C-Copy / שיא קופי",
                  url: SITE_URL,
                },
                url: `${SITE_URL}/services/${c.id}`,
              }))
            ),
          }}
        />
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-pill focus:bg-green focus:text-ink focus:px-6 focus:py-3 focus:font-semibold focus:shadow-lg"
        >
          דלגו לתוכן הראשי
        </a>
        {/*
          Architectural green frame:
          The body bleeds lime green to all four edges.
          The cream "page card" floats inside with massive rounded corners,
          revealing the green as a structural frame around all content
          (matches designes/11.png).
        */}
        <div className="relative bg-cream rounded-[32px] md:rounded-[48px] m-2 md:m-4 overflow-hidden">
          <LenisProvider>{children}</LenisProvider>
        </div>
      </body>
    </html>
  );
}
