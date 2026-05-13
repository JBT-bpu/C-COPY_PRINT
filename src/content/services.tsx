/**
 * Service categories — single source of truth.
 * Consumers: Services.tsx (homepage cards), /services/[slug]/page.tsx (detail pages).
 *
 * Icons are brand icon names (string) referencing public/icons/*.png,
 * rendered via <BrandIcon name={...} />.
 */

export type CategoryId =
    | "print-house"
    | "copy-center"
    | "wide-format"
    | "rigid-surfaces"
    | "design"
    | "students";

export type ServiceVariant = "default" | "soft" | "green";

export interface ServiceItem {
    title: string;
    description: string;
    icon: string; // brand icon name
    tags: string[];
    variant: ServiceVariant;
}

export interface Category {
    id: CategoryId;
    title: string;
    description: string;
    icon: string; // brand icon name
    services: ServiceItem[];
}

export const CATEGORIES: Category[] = [
    {
        id: "print-house",
        title: "בית דפוס",
        description: "הדפסה דיגיטלית באיכות HD — מעותק בודד ועד אלפי עותקים.",
        icon: "digital-printer",
        services: [
            {
                title: "כרטיסי ביקור",
                description: "הדפסת כרטיסי ביקור Premium — מבריסטול, מט, למינציה ועוד.",
                icon: "approved-check",
                tags: ["Premium", "מבריסטול"],
                variant: "default",
            },
            {
                title: "מדבקות",
                description: "מדבקות מותאמות אישית — חיתוך מדויק, עמידות גבוהה, כל הגדלים.",
                icon: "quality-shield",
                tags: ["חיתוך מדויק", "עמיד"],
                variant: "soft",
            },
            {
                title: "פליירים",
                description: "פליירים וכרזות בכל הגדלים — צבעוני, חד-צדדי או דו-צדדי.",
                icon: "document-page",
                tags: ["מהיר", "צבעוני"],
                variant: "default",
            },
            {
                title: "פוסטרים",
                description: "פוסטרים באיכות גבוהה לתצוגה, אירועים וגלריות.",
                icon: "wide-format-printer",
                tags: ["איכות גבוהה", "גלריה"],
                variant: "default",
            },
            {
                title: "חוברות וקטלוגים",
                description: "הדפסת חוברות, קטלוגים וברושורים — כריכה מקצועית במקום.",
                icon: "notebook",
                tags: ["כריכה", "בינדינג"],
                variant: "soft",
            },
            {
                title: "מארזים וקופסאות",
                description: "עיצוב וייצור אריזות מותאמות — מקופסאות ועד תוויות.",
                icon: "delivery-truck",
                tags: ["מותאם", "עיצוב"],
                variant: "green",
            },
            {
                title: "ניירת משרדית",
                description: "ניירת ממותגת — דפי נוטפד, מעטפות, כרטיסי ברכה ועוד.",
                icon: "design-tools",
                tags: ["ממותג", "משרדי"],
                variant: "default",
            },
            {
                title: "רולאפ ופולדרים",
                description: "רול-אפים ופולדרים לתערוכות, אירועים ונקודות מכירה.",
                icon: "wide-format-printer",
                tags: ["תערוכות", "אירועים"],
                variant: "soft",
            },
        ],
    },
    {
        id: "copy-center",
        title: "מכון העתקות",
        description: "שירותי צילום, סריקה והדפסה — כולל תוכניות בנייה ושרטוטים.",
        icon: "document-page",
        services: [
            {
                title: "צילומי מסמכים",
                description: "צילום מסמכים בשחור-לבן או צבע — מהיר ומדויק.",
                icon: "document-page",
                tags: ["שחור-לבן", "צבע"],
                variant: "default",
            },
            {
                title: "פלוטים ותוכניות",
                description: "הדפסת פלוטים, תוכניות בנייה ושרטוטים אדריכליים.",
                icon: "wide-format-printer",
                tags: ["פלוטים", "אדריכלות"],
                variant: "green",
            },
            {
                title: "סריקה והגדלה",
                description: "סריקת מסמכים, הגדלה והקטנה — כולל מפות ותצ״ות.",
                icon: "wide-format-printer",
                tags: ["סריקה", "הגדלה"],
                variant: "default",
            },
            {
                title: "תוכניות הגשה",
                description: "תוכניות הגשה להיתרי בנייה ותוכניות בניין עיר.",
                icon: "location-pin",
                tags: ["היתרים", "עירייה"],
                variant: "soft",
            },
        ],
    },
    {
        id: "wide-format",
        title: "פורמט רחב",
        description: "הדפסה בפורמט גדול לשלטים, פוסטרים ותצוגות עד 3 מטר.",
        icon: "wide-format-printer",
        services: [
            {
                title: "שלטים",
                description: "שלטי חוץ ופנים — הדפסה בפורמט רחב עד 3 מטר רוחב.",
                icon: "signage-board",
                tags: ["עד 3 מ׳", "חוץ/פנים"],
                variant: "default",
            },
            {
                title: "שמשוניות",
                description: "הדפסה על שמשוניות — עמידות גבוהה לשמש ולמים.",
                icon: "fast-service",
                tags: ["עמיד", "חוץ"],
                variant: "soft",
            },
            {
                title: "טפטים",
                description: "טפטים מותאמים אישית — הדפסה באיכות גבוהה לעיצוב פנים.",
                icon: "design-tools",
                tags: ["עיצוב", "פנים"],
                variant: "default",
            },
        ],
    },
    {
        id: "rigid-surfaces",
        title: "משטחים קשיחים",
        description: "הדפסה ישירה על משטחים קשיחים — עץ, מתכת, אקריליק ועוד.",
        icon: "signage-board",
        services: [
            {
                title: "אלוקובונד",
                description: "הדפסה ישירה על לוחות אלוקובונד — עמידות לאורך שנים.",
                icon: "quality-shield",
                tags: ["UV", "עמיד"],
                variant: "green",
            },
            {
                title: "קאפה / קלקר",
                description: "לוחות קלים לתצוגה זמנית, מצגות ואירועים.",
                icon: "design-tools",
                tags: ["קליל", "תצוגה"],
                variant: "default",
            },
            {
                title: "עץ וקנבס",
                description: "הדפסה על עץ טבעי וקנבס — מראה חם ויוקרתי.",
                icon: "wide-format-printer",
                tags: ["טבעי", "יוקרתי"],
                variant: "soft",
            },
            {
                title: "פרספקס / אקריליק",
                description: "הדפסה על פרספקס שקוף או צבעוני — מראה מודרני ונקי.",
                icon: "fast-service",
                tags: ["מודרני", "שקוף"],
                variant: "default",
            },
            {
                title: "מגנטים",
                description: "הדפסה על משטחים מגנטיים — לשלטים נשלפים ותצוגה מתחלפת.",
                icon: "quality-shield",
                tags: ["נשלף", "מתחלף"],
                variant: "soft",
            },
        ],
    },
    {
        id: "design",
        title: "עיצוב וגרפיקה",
        description: "צוות עיצוב ופרי-פרס — מהקובץ הגולמי ועד מוכן להדפסה.",
        icon: "design-tools",
        services: [
            {
                title: "עיצוב גרפי לדפוס",
                description: "עיצוב מלא לכל מוצרי הדפוס — פליירים, חוברות, כרטיסי ביקור ועוד.",
                icon: "design-tools",
                tags: ["מלא", "מקצועי"],
                variant: "default",
            },
            {
                title: "תיקון קבצים",
                description: "תיקון קבצים שאינם מוכנים להדפסה — רזולוציה, צבע, ובליד.",
                icon: "approved-check",
                tags: ["Pre-press", "מוכן"],
                variant: "soft",
            },
            {
                title: "התאמת צבעים",
                description: "כיול צבעים מדויק — CMYK, פנטון והתאמה למסך.",
                icon: "technology-gear",
                tags: ["CMYK", "פנטון"],
                variant: "default",
            },
            {
                title: "טיפוגרפיה",
                description: "בחירת גופנים ועיצוב טקסט — עברית, אנגלית ושפות נוספות.",
                icon: "design-tools",
                tags: ["עברית", "RTL"],
                variant: "default",
            },
            {
                title: "עיצוב לוגו",
                description: "פיתוח זהות חזותית — לוגו, צבעים, גופנים ושפה גרפית.",
                icon: "design-tools",
                tags: ["מותג", "זהות"],
                variant: "green",
            },
            {
                title: "הכנת קובץ להדפסה",
                description: "בדיקת שוליים, בליד, רזולוציה והפרדות צבע — קובץ מוכן ללא הפתעות.",
                icon: "document-page",
                tags: ["בליד", "שוליים"],
                variant: "default",
            },
        ],
    },
    {
        id: "students",
        title: "שירותים לסטודנטים",
        description: "תמחור הוגן ומענה מהיר לכל הצרכים האקדמיים — מתזות ועד פוסטרים למצגות.",
        icon: "notebook",
        services: [
            {
                title: "הדפסת תזות ועבודות",
                description: "הדפסת עבודות סמינריוניות, תזות ודוקטורט — איכות גבוהה, מחיר סטודנט.",
                icon: "notebook",
                tags: ["תזה", "דוקטורט"],
                variant: "green",
            },
            {
                title: "כריכה אקדמית",
                description: "כריכה ספירלית, תרמו-בינדינג וכריכה קשה לעבודות הגשה.",
                icon: "notebook",
                tags: ["ספירלית", "קשיחה"],
                variant: "default",
            },
            {
                title: "צילום ספרים וחומר לימודי",
                description: "צילום והעתקת ספרי לימוד, מאמרים וחומר עזר — עם או בלי כריכה.",
                icon: "document-page",
                tags: ["מהיר", "זמין"],
                variant: "soft",
            },
            {
                title: "מצגות ופוסטרים אקדמיים",
                description: "פוסטרים מדעיים לכנסים, מצגות אדריכליות ועבודות הגשה ויזואליות.",
                icon: "play-video",
                tags: ["כנסים", "הגשה"],
                variant: "default",
            },
            {
                title: "הדפסת תוכניות ושרטוטים",
                description: "פלוטים ותוכניות בכל הגדלים — לסטודנטי אדריכלות והנדסה.",
                icon: "wide-format-printer",
                tags: ["אדריכלות", "הנדסה"],
                variant: "default",
            },
            {
                title: "תמחור סטודנט",
                description: "מחירים מותאמים לסטודנטים בהצגת תעודת סטודנט בתוקף.",
                icon: "pricing-dollar",
                tags: ["הנחה", "תעודה"],
                variant: "soft",
            },
        ],
    },
];
