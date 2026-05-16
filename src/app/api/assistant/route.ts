import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { SYSTEM_PROMPT } from "@/content/assistant-knowledge";
import { getLLM } from "@/lib/llm";

export const runtime = "nodejs";
// A local Gemma reply over the Cloudflare Tunnel can exceed Vercel's
// default 10s function limit (Hobby allows up to 60s for Node funcs).
export const maxDuration = 60;

// Per-IP rate limit: 1 req / 3s (mirrors api/quote pattern)
const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 3_000;

const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(4000),
});

const bodySchema = z.object({
    messages: z.array(messageSchema).min(1).max(24),
});

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
                { error: "רגע אחד… יותר מדי בקשות. נסו שוב עוד כמה שניות." },
                { status: 429 }
            );
        }
        rateLimit.set(ip, now);

        const json = await request.json();
        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "נתונים לא תקינים" },
                { status: 400 }
            );
        }

        const { messages } = parsed.data;
        const llm = getLLM();

        // Dev fallback — UI testable with no provider configured
        if (!llm) {
            return NextResponse.json({
                reply:
                    "(מצב פיתוח — אין מודל מחובר) אני יועץ הדפוס של C-COPY. " +
                    "ספרו לי מה תרצו להדפיס ואשמח לעזור: סוג מוצר, כמות, גודל וחומר.",
            });
        }

        const completion = await llm.client.chat.completions.create({
            model: llm.model,
            temperature: 0.4,
            max_tokens: 300,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
        });

        const reply =
            completion.choices[0]?.message?.content?.trim() ||
            "סליחה, לא הצלחתי לנסח תשובה. נסו לנסח שוב או פנו אלינו בטלפון 072-3316655.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Assistant error:", error);
        return NextResponse.json(
            { error: "שגיאה זמנית. נסו שוב בעוד רגע." },
            { status: 500 }
        );
    }
}
