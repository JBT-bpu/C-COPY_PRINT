import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { SYSTEM_PROMPT } from "@/content/assistant-knowledge";
import { getLLM } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(4000),
});

const bodySchema = z.object({
    conversation: z.array(messageSchema).min(1).max(40),
    contact: z.object({
        name: z.string().min(2, "שם קצר מדי").max(100),
        phone: z.string().max(40).optional(),
        email: z.string().email("אימייל לא תקין").optional(),
    }),
});

const SUMMARY_INSTRUCTION = `על סמך שיחת הייעוץ הבאה, הפק סיכום בקשת הצעת מחיר
בפורמט המדויק של "סיכום בקשת הצעת מחיר" שמופיע בידע שלך. מלא רק פרטים
שנאמרו בפועל; מה שלא נאמר — רשום תחת "פרטים חסרים". אל תמציא מחיר.`;

export async function POST(request: NextRequest) {
    try {
        const ip =
            request.headers.get("x-forwarded-for") ??
            request.headers.get("x-real-ip") ??
            "unknown";
        const now = Date.now();
        const last = rateLimit.get(ip);
        if (last && now - last < RATE_LIMIT_MS) {
            return NextResponse.json(
                { error: "כבר נשלחה בקשה. נסו שוב בעוד 30 שניות." },
                { status: 429 }
            );
        }
        rateLimit.set(ip, now);

        const json = await request.json();
        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "נתונים לא תקינים", details: parsed.error.issues },
                { status: 400 }
            );
        }

        const { conversation, contact } = parsed.data;
        const transcript = conversation
            .map((m) => `${m.role === "user" ? "לקוח" : "יועץ"}: ${m.content}`)
            .join("\n");

        // Build the structured summary (server-side LLM, falls back to raw transcript)
        let summary = "";
        const llm = getLLM();
        if (llm) {
            const completion = await llm.client.chat.completions.create({
                model: llm.model,
                temperature: 0.2,
                max_tokens: 700,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `${SUMMARY_INSTRUCTION}\n\n---\n${transcript}` },
                ],
            });
            summary = completion.choices[0]?.message?.content?.trim() ?? "";
        }
        if (!summary) {
            summary = `סיכום אוטומטי לא זמין — תמליל השיחה:\n\n${transcript}`;
        }

        const contactLine = [
            `שם: ${contact.name}`,
            contact.phone ? `טלפון: ${contact.phone}` : null,
            contact.email ? `אימייל: ${contact.email}` : null,
        ]
            .filter(Boolean)
            .join(" · ");

        const resendApiKey = process.env.RESEND_API_KEY;
        const quoteTo = process.env.QUOTE_TO ?? "info@c-copy.co.il";
        const quoteFrom = process.env.QUOTE_FROM ?? "noreply@ccopy.co.il";

        if (resendApiKey) {
            const { Resend } = await import("resend");
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
                from: `C-Copy Assistant <${quoteFrom}>`,
                to: [quoteTo],
                replyTo: contact.email,
                subject: `סיכום שיחת ייעוץ — בקשת הצעת מחיר מ-${contact.name}`,
                html: `
          <div dir="rtl" style="font-family: Rubik, system-ui, sans-serif; max-width: 640px; margin: 0 auto;">
            <h2 style="color:#0F1A05;">סיכום שיחת ייעוץ</h2>
            <p style="color:#2D3920; font-weight:bold;">${contactLine}</p>
            <pre style="white-space:pre-wrap; font-family:inherit; background:#FAFBF6; padding:16px; border-radius:12px; color:#0F1A05;">${summary
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")}</pre>
          </div>
        `,
            });
        } else {
            console.log("[DEV] Assistant quote summary:", { contactLine, summary });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Assistant summary error:", error);
        return NextResponse.json(
            { error: "שגיאה בשליחת הסיכום. נסו שוב מאוחר יותר." },
            { status: 500 }
        );
    }
}
