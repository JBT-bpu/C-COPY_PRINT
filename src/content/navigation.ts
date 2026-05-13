/**
 * Navigation links — single source of truth for top nav and footer link groups.
 * Consumers: Nav.tsx, Footer.tsx.
 */

export type NavLink = {
    label: string;
    href: string;
};

export const NAV_LINKS: NavLink[] = [
    { label: "שירותים", href: "#services" },
    { label: "אודותינו", href: "#about" },
    { label: "תהליך", href: "#process" },
    { label: "שאלות נפוצות", href: "#faq" },
    { label: "מאמרים", href: "/blog" },
];

export const FOOTER_WIDE_FORMAT_LINKS: NavLink[] = [
    { label: "שמשוניות", href: "#services" },
    { label: "טפטים", href: "#services" },
    { label: "לוחות שנה", href: "#services" },
];

export const FOOTER_SELECTED_PRODUCTS: NavLink[] = [
    { label: "פולדרים", href: "#services" },
    { label: "כרטיסי ביקור", href: "#services" },
    { label: "מחברות", href: "#services" },
    { label: "ניירת משרדית", href: "#services" },
    { label: "חוברות", href: "#services" },
    { label: "קטלוגים", href: "#services" },
    { label: "ברושורים", href: "#services" },
    { label: "מדבקות", href: "#services" },
    { label: "מארזים וקופסאות", href: "#services" },
];

export const FOOTER_USEFUL_LINKS: NavLink[] = [
    { label: "אודותינו", href: "#about" },
    { label: "בית דפוס בפתח תקווה", href: "#services" },
    { label: "מכון העתקות", href: "#copy-center" },
    { label: "הדפסה בפורמט רחב", href: "#services" },
    { label: "שאלות נפוצות", href: "#faq" },
    { label: "מאמרים", href: "/blog" },
];
