/**
 * Branch data — single source of truth.
 * Consumers: Footer, layout.tsx (JSON-LD LocalBusiness schema), CTA contact methods.
 *
 * Phone numbers are stored in the local Hebrew display format (e.g., "03-6911155")
 * — convert to E.164 with `phoneToE164()` for `tel:` links and JSON-LD `telephone`.
 */

export type Branch = {
    id: string;
    name: string;
    address: string;
    addressLocality: string;
    streetAddress: string;
    phone: string;
    sales?: string;
    fax?: string;
    email: string;
};

export const BRANCHES: Branch[] = [
    {
        id: "tel-aviv-main",
        name: "סניף ראשי — מסגר",
        address: "מסגר 62, תל אביב",
        addressLocality: "תל אביב",
        streetAddress: "מסגר 62",
        phone: "03-6911155",
        sales: "072-3316655",
        fax: "03-6911156",
        email: "info@c-copy.co.il",
    },
    {
        id: "tel-aviv-rabin",
        name: "סניף כיכר רבין",
        address: "אבן גבירול 65, תל אביב",
        addressLocality: "תל אביב",
        streetAddress: "אבן גבירול 65",
        phone: "03-6093933",
        fax: "03-6961773",
        email: "tlv@c-copy.co.il",
    },
    {
        id: "petah-tikva",
        name: "סניף פ״ת",
        address: "אריה שנקר 3, פ״ת",
        addressLocality: "פתח תקווה",
        streetAddress: "אריה שנקר 3",
        phone: "03-9214416",
        fax: "03-9214139",
        email: "pt@c-copy.co.il",
    },
];

export const PRIMARY_BRANCH = BRANCHES[0];

/** "03-6911155" → "+972-3-6911155" (drop leading 0, prefix Israel country code). */
export function phoneToE164(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("0") ? `+972-${digits.slice(1, 2)}-${digits.slice(2)}` : `+972-${digits}`;
}

/** "03-6911155" → "tel:+97236911155" — for `<a href>`. */
export function phoneHref(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("0") ? `tel:+972${digits.slice(1)}` : `tel:+972${digits}`;
}
