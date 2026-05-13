/**
 * Showcase / popular products — single source of truth.
 * Consumers: Showcase.tsx (horizontal-scroll gallery).
 *
 * Each item maps to a placeholder card today; once real photography arrives,
 * add an `image` field and update the consumer to render <Image>.
 */

export type ShowcaseItem = {
    title: string;
    category: string;
    /** Tailwind background class for the placeholder tile. */
    color: string;
};

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
    {
        title: "קטלוג אופנה",
        category: "דפוס דיגיטלי",
        color: "bg-green-pale",
    },
    {
        title: "שלט חוצות",
        category: "פורמט רחב",
        color: "bg-green-soft/30",
    },
    {
        title: "אריזת מותג",
        category: "אריזות",
        color: "bg-green-pale",
    },
    {
        title: "כרטיסי ביקור Premium",
        category: "דפוס דיגיטלי",
        color: "bg-green-soft/30",
    },
    {
        title: "ברושור תיירות",
        category: "דפוס דיגיטלי",
        color: "bg-green-pale",
    },
    {
        title: "תוויות יין",
        category: "מדבקות",
        color: "bg-green-soft/30",
    },
];
