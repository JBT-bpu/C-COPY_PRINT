import OpenAI from "openai";

/**
 * Single source of truth for the assistant's LLM provider.
 *
 * The `openai` SDK speaks the OpenAI-compatible REST API, which LM Studio
 * also serves (default http://localhost:1234/v1). Switching provider is
 * therefore just `baseURL` + `model` config — no SDK change.
 *
 *   - Local dev:  LLM_BASE_URL=http://localhost:1234/v1  → local Gemma
 *   - Production: LLM_BASE_URL=https://ai.<domain>/v1     → PC via
 *                 Cloudflare Tunnel, gated by a CF Access service token
 *   - Unset + OPENAI_API_KEY set → OpenAI cloud (legacy fallback)
 *   - Nothing set → returns null; callers serve the Hebrew dev stub.
 */
export function getLLM(): { client: OpenAI; model: string } | null {
    const baseURL = process.env.LLM_BASE_URL;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Provider only usable if pointed at a local/tunnelled server OR an
    // OpenAI key exists. Otherwise the route falls back to its stub.
    if (!baseURL && !openaiKey) return null;

    // LM Studio ignores the key but the SDK requires a non-empty string.
    const apiKey = openaiKey || "lm-studio";
    const model = process.env.LLM_MODEL ?? "gpt-4o-mini";

    // Cloudflare Access service-token headers — present only in prod
    // (the tunnel). Absent locally → plain localhost call.
    const cfId = process.env.CF_ACCESS_CLIENT_ID;
    const cfSecret = process.env.CF_ACCESS_CLIENT_SECRET;
    const defaultHeaders =
        cfId && cfSecret
            ? { "CF-Access-Client-Id": cfId, "CF-Access-Client-Secret": cfSecret }
            : undefined;

    const client = new OpenAI({
        apiKey,
        ...(baseURL ? { baseURL } : {}),
        ...(defaultHeaders ? { defaultHeaders } : {}),
    });

    return { client, model };
}
