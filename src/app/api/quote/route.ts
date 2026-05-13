import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

// Rate limiting: simple in-memory store (per IP, 1 req / 30s)
const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

const quoteSchema = z.object({
    name: z.string().min(2, "שם קצר מדי").max(100),
    email: z.email("אימייל לא תקין"),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
    try {
        // Rate limit check
        const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
        const now = Date.now();
        const lastRequest = rateLimit.get(ip);

        if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
            return NextResponse.json(
                { error: "יותר מדי בקשות. נסו שוב בעוד 30 שניות." },
                { status: 429 }
            );
        }

        rateLimit.set(ip, now);

        // Parse and validate body
        const body = await request.json();
        const result = quoteSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "נתונים לא תקינים", details: result.error.issues },
                { status: 400 }
            );
        }

        const { name, email, phone, service, message } = result.data;

        // Send email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        const quoteTo = process.env.QUOTE_TO ?? "info@c-copy.co.il";
        const quoteFrom = process.env.QUOTE_FROM ?? "noreply@ccopy.co.il";

        if (resendApiKey) {
            const { Resend } = await import("resend");
            const resend = new Resend(resendApiKey);

            await resend.emails.send({
                from: `C-Copy Quote <${quoteFrom}>`,
                to: [quoteTo],
                replyTo: email,
                subject: `הצעת מחיר חדשה מ-${name}`,
                html: `
          <div dir="rtl" style="font-family: Rubik, system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0F1A05;">הצעת מחיר חדשה</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #2D3920; font-weight: bold;">שם:</td><td style="padding: 8px 0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #2D3920; font-weight: bold;">אימייל:</td><td style="padding: 8px 0; direction: ltr;">${email}</td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #2D3920; font-weight: bold;">טלפון:</td><td style="padding: 8px 0; direction: ltr;">${phone}</td></tr>` : ""}
              ${service ? `<tr><td style="padding: 8px 0; color: #2D3920; font-weight: bold;">שירות:</td><td style="padding: 8px 0;">${service}</td></tr>` : ""}
              ${message ? `<tr><td style="padding: 8px 0; color: #2D3920; font-weight: bold;">הודעה:</td><td style="padding: 8px 0;">${message}</td></tr>` : ""}
            </table>
          </div>
        `,
            });
        } else {
            // Dev mode: log to console
            console.log("[DEV] Quote request:", { name, email, phone, service, message });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Quote form error:", error);
        return NextResponse.json(
            { error: "שגיאה בשליחת הטופס. נסו שוב מאוחר יותר." },
            { status: 500 }
        );
    }
}
