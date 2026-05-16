/**
 * Knowledge base for the C-COPY AI print-advisor assistant.
 *
 * Composes a compact markdown string (~2000 tokens) from the repo's live
 * content single-sources (services, branches). Small enough to fit in a
 * 3B-parameter model's context window every call — no RAG needed.
 *
 * Live data is read from CATEGORIES / BRANCHES so the assistant
 * never drifts from what the site actually says.
 */
import { CATEGORIES } from "@/content/services";
import { BRANCHES } from "@/content/branches";

/** Compose a compact knowledge base (~2000 tokens) for small models. */
export function buildKnowledgeBase(): string {
    const svcList = CATEGORIES.map(
        (c) => `${c.title}: ${c.services.map((s) => s.title).join(", ")}`
    ).join("\n");

    const branchList = BRANCHES.map(
        (b) => `${b.name} — ${b.address}, טל׳: ${b.phone}`
    ).join("\n");

    return `# חוק עליון
שאלת מידע (סניפים/חומרים/שירותים) → ענה ישירות מהידע, בלי שאלות איסוף.
כוונת הזמנה/מחיר → אסוף פרטים (מוצר, כמות, גודל, חומר, דדליין).
אסור לתת מחיר סופי. המחיר נקבע רק על ידי צוות C-COPY.
ענה בעברית, תמציתי ומקצועי. אל תמציא מידע.

# סניפים
שירות: 03-6911155 | מכירות: 072-3316655 | info@c-copy.co.il
${branchList}

# שירותים
${svcList}

# חומרים
קאפה: פנים, מצגות, זמני. | אלוקובונד: קשיח, חוץ/פנים, עמיד.
PVC: עמיד, חוץ. | פרספקס: שקוף, יוקרתי. | קנבס: אומנות קיר.
מדבקות: מיתוג, תוויות. | רולאפ: תערוכות. | שמשונית: פרסום חוץ.`;
}

/** Full system prompt for the chat endpoint. */
export const SYSTEM_PROMPT = `אתה יועץ הדפוס של C-COPY (שיא קופי) — בית דפוס בתל אביב מאז 1986.

${buildKnowledgeBase()}`;
