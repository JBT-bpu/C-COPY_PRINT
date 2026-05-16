"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
    role: "assistant",
    content:
        "היי! אני יועץ הדפוס של C-COPY. מה תרצו להדפיס? ספרו לי בכמה מילים ואכוון אתכם.",
};

/* ─── tiny ink-drop typing indicator ─── */
function TypingDots() {
    return (
        <div className="me-auto flex items-center gap-1.5 bg-white border border-line rounded-2xl rounded-es-sm px-4 py-3">
            <span className="assistant-dot" />
            <span className="assistant-dot" style={{ animationDelay: "0.15s" }} />
            <span className="assistant-dot" style={{ animationDelay: "0.3s" }} />
        </div>
    );
}

export function AssistantWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([GREETING]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [contact, setContact] = useState({ name: "", phone: "", email: "" });
    const [summarySent, setSummarySent] = useState(false);
    const [summaryBusy, setSummaryBusy] = useState(false);
    const [showNudge, setShowNudge] = useState(false);
    const [nudgeDismissed, setNudgeDismissed] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    /* auto-scroll on new messages */
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    /* Escape to close */
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    /* Auto-nudge: show tooltip after 6s if user hasn't opened chat */
    useEffect(() => {
        if (open || nudgeDismissed) return;
        const timer = setTimeout(() => setShowNudge(true), 6000);
        return () => clearTimeout(timer);
    }, [open, nudgeDismissed]);

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

    function openChat() {
        setOpen(true);
        setShowNudge(false);
        setNudgeDismissed(true);
    }

    return (
        <>
            {/* ─── Launcher button with pulsing ring ─── */}
            {!open && (
                <div className="fixed bottom-6 end-6 z-50 flex items-center gap-3">
                    {/* Nudge tooltip */}
                    {showNudge && !nudgeDismissed && (
                        <button
                            type="button"
                            onClick={openChat}
                            className="assistant-nudge"
                        >
                            שאלו אותנו הכל על דפוס! 💬
                        </button>
                    )}

                    {/* Pulsing ring behind the button */}
                    <span className="assistant-pulse-ring" aria-hidden="true" />

                    <button
                        type="button"
                        onClick={openChat}
                        aria-label="פתיחת יועץ הדפוס"
                        aria-expanded={false}
                        className={cn(
                            "relative flex items-center gap-2",
                            "rounded-pill bg-green text-ink ps-4 pe-5 py-3 font-extrabold",
                            "shadow-lg shadow-green/40 hover:scale-105 hover:bg-green-soft",
                            "transition-all duration-300",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                        )}
                    >
                        <span className="flex size-7 items-center justify-center rounded-full bg-ink text-green text-sm font-black">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        </span>
                        יועץ דפוס
                    </button>
                </div>
            )}

            {/* ─── Chat panel ─── */}
            {open && (
                <div
                    ref={panelRef}
                    dir="rtl"
                    role="dialog"
                    aria-label="יועץ הדפוס של C-COPY"
                    className={cn(
                        "fixed z-50 bg-cream flex flex-col overflow-hidden",
                        "shadow-2xl shadow-ink/30 border border-line",
                        "assistant-panel",
                    )}
                >
                    {/* CMYK accent strip */}
                    <div className="flex h-1 shrink-0" aria-hidden="true">
                        <span className="flex-1 bg-[#00A0E3]" /> {/* Cyan */}
                        <span className="flex-1 bg-[#E6007E]" /> {/* Magenta */}
                        <span className="flex-1 bg-[#FEBF00]" /> {/* Yellow */}
                        <span className="flex-1 bg-[#0F1A05]" /> {/* Key (black) */}
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between bg-green px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex size-8 items-center justify-center rounded-full bg-ink text-green font-black">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                                {/* Online indicator dot */}
                                <span className="absolute -bottom-0.5 -start-0.5 size-3 rounded-full bg-[#00E676] border-2 border-green assistant-online-dot" />
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
                                    "assistant-msg",
                                    m.role === "user"
                                        ? "ms-auto bg-green text-ink rounded-ee-sm assistant-msg-user"
                                        : "me-auto bg-white text-ink border border-line rounded-es-sm assistant-msg-bot"
                                )}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && <TypingDots />}
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
                                    className={cn(
                                        "size-10 shrink-0 rounded-full font-black transition-all duration-200",
                                        "flex items-center justify-center",
                                        input.trim() && !loading
                                            ? "bg-ink text-cream hover:bg-ink-soft scale-100"
                                            : "bg-green text-ink opacity-40"
                                    )}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
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
