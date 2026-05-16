"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
    role: "assistant",
    content:
        "היי! אני יועץ הדפוס של C-COPY. מה תרצו להדפיס? ספרו לי בכמה מילים ואכוון אתכם.",
};

export function AssistantWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([GREETING]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [contact, setContact] = useState({ name: "", phone: "", email: "" });
    const [summarySent, setSummarySent] = useState(false);
    const [summaryBusy, setSummaryBusy] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    async function send() {
        const text = input.trim();
        if (!text || loading) return;
        const next = [...messages, { role: "user" as const, content: text }];
        setMessages(next);
        setInput("");
        setLoading(true);
        try {
            const res = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: next.slice(-20) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "error");
            setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        } catch (err) {
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    content:
                        err instanceof Error && err.message !== "error"
                            ? err.message
                            : "סליחה, משהו השתבש. נסו שוב או התקשרו 072-3316655.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    async function sendSummary() {
        if (!contact.name.trim() || summaryBusy) return;
        setSummaryBusy(true);
        try {
            const res = await fetch("/api/assistant/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversation: messages.slice(-40),
                    contact: {
                        name: contact.name.trim(),
                        phone: contact.phone.trim() || undefined,
                        email: contact.email.trim() || undefined,
                    },
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "error");
            setSummarySent(true);
        } catch {
            setSummarySent(false);
            alert("שליחת הסיכום נכשלה. נסו שוב או התקשרו 072-3316655.");
        } finally {
            setSummaryBusy(false);
        }
    }

    return (
        <>
            {/* Launcher — bottom-end so it doesn't collide with WhatsApp (bottom-start) */}
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="פתיחת יועץ הדפוס"
                    aria-expanded={false}
                    className={cn(
                        "fixed bottom-6 end-6 z-50 flex items-center gap-2",
                        "rounded-pill bg-green text-ink ps-4 pe-5 py-3 font-extrabold",
                        "shadow-lg shadow-green/40 hover:scale-105 hover:bg-green-soft",
                        "transition-all duration-300",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                    )}
                >
                    <span className="flex size-7 items-center justify-center rounded-full bg-ink text-green text-sm font-black">
                        ✦
                    </span>
                    יועץ דפוס
                </button>
            )}

            {open && (
                <div
                    ref={panelRef}
                    dir="rtl"
                    role="dialog"
                    aria-label="יועץ הדפוס של C-COPY"
                    className={cn(
                        "fixed z-50 bg-cream flex flex-col overflow-hidden",
                        "shadow-2xl shadow-ink/30 border border-line",
                        "inset-x-0 bottom-0 h-[85dvh] rounded-t-[28px]",
                        "sm:inset-x-auto sm:bottom-6 sm:end-6 sm:h-[560px] sm:w-[380px] sm:rounded-[28px]"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-green px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-full bg-ink text-green font-black">
                                ✦
                            </span>
                            <div className="leading-tight">
                                <p className="font-extrabold text-ink text-sm">יועץ הדפוס</p>
                                <p className="text-ink/70 text-xs">C-COPY · מענה מיידי</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="סגירה"
                            className="size-8 rounded-full text-ink hover:bg-ink/10 transition-colors text-lg font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                                    m.role === "user"
                                        ? "ms-auto bg-green text-ink rounded-ee-sm"
                                        : "me-auto bg-white text-ink border border-line rounded-es-sm"
                                )}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="me-auto bg-white border border-line rounded-2xl rounded-es-sm px-4 py-3 text-sm text-ink-soft">
                                כותב…
                            </div>
                        )}
                    </div>

                    {/* Summary form */}
                    {showSummary && !summarySent && (
                        <div className="border-t border-line bg-white px-4 py-3 space-y-2">
                            <p className="text-xs font-semibold text-ink-soft">
                                שלחו את סיכום השיחה לצוות לקבלת הצעת מחיר:
                            </p>
                            <input
                                value={contact.name}
                                onChange={(e) =>
                                    setContact((c) => ({ ...c, name: e.target.value }))
                                }
                                placeholder="שם מלא *"
                                className="w-full rounded-xl bg-cream/60 border border-line px-3 py-2 text-sm focus:outline-none focus:border-green"
                            />
                            <div className="flex gap-2">
                                <input
                                    value={contact.phone}
                                    onChange={(e) =>
                                        setContact((c) => ({ ...c, phone: e.target.value }))
                                    }
                                    placeholder="טלפון"
                                    dir="ltr"
                                    className="w-1/2 rounded-xl bg-cream/60 border border-line px-3 py-2 text-sm text-right focus:outline-none focus:border-green"
                                />
                                <input
                                    value={contact.email}
                                    onChange={(e) =>
                                        setContact((c) => ({ ...c, email: e.target.value }))
                                    }
                                    placeholder="אימייל"
                                    dir="ltr"
                                    className="w-1/2 rounded-xl bg-cream/60 border border-line px-3 py-2 text-sm text-right focus:outline-none focus:border-green"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={sendSummary}
                                disabled={!contact.name.trim() || summaryBusy}
                                className="w-full rounded-pill bg-ink text-cream py-2.5 text-sm font-extrabold disabled:opacity-50 hover:bg-ink-soft transition-colors"
                            >
                                {summaryBusy ? "שולח…" : "שלח לצוות"}
                            </button>
                        </div>
                    )}
                    {summarySent && (
                        <div className="border-t border-line bg-green-pale px-4 py-3 text-sm font-semibold text-green-deep text-center">
                            הסיכום נשלח! נחזור אליכם בהקדם.
                        </div>
                    )}

                    {/* Input */}
                    {!summarySent && (
                        <div className="border-t border-line bg-white px-3 py-3">
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            send();
                                        }
                                    }}
                                    rows={1}
                                    placeholder="כתבו הודעה…"
                                    className="flex-1 resize-none rounded-2xl bg-cream/60 border border-line px-4 py-2.5 text-sm max-h-28 focus:outline-none focus:border-green"
                                />
                                <button
                                    type="button"
                                    onClick={send}
                                    disabled={!input.trim() || loading}
                                    aria-label="שליחה"
                                    className="size-10 shrink-0 rounded-full bg-green text-ink font-black disabled:opacity-40 hover:bg-green-soft transition-colors"
                                >
                                    ↑
                                </button>
                            </div>
                            {messages.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => setShowSummary((s) => !s)}
                                    className="mt-2 text-xs font-semibold text-green-deep hover:underline"
                                >
                                    שלח סיכום לצוות ←
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
