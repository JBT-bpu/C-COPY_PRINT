"use client";

import Link from "next/link";
import { MorphBlob } from "@/components/animations/MorphBlob";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <main className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-cream">
            {/* Background blob */}
            <MorphBlob
                className="top-1/4 start-1/4"
                size={600}
                opacity={0.15}
                duration={8}
            />
            <MorphBlob
                className="bottom-1/4 end-1/4"
                color="var(--color-green-soft)"
                size={400}
                opacity={0.1}
                duration={10}
            />

            <div className="relative z-10 text-center px-6">
                <h1 className="text-8xl md:text-9xl font-extrabold text-ink mb-4">404</h1>
                <p className="text-2xl md:text-3xl font-bold text-ink mb-2">
                    הדף ברח לדפוס
                </p>
                <p className="text-ink-soft text-lg mb-8 max-w-md mx-auto">
                    נראה שהדף שחיפשתם לא נמצא. אולי נדפיס לכם חדש?
                </p>

                <Button variant="primary" size="lg" arrow as="a" href="/">
                    חזרה לדף הבית
                </Button>
            </div>
        </main>
    );
}
