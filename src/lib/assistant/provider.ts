import "server-only";

/**
 * Connection to the Grandpa AI API — the only file that knows the provider's wire format.
 *
 * Configuration (Vercel → Settings → Environment Variables; never commit keys):
 *   GRANDPA_AI_API_KEY     the secret key from Grandpa AI
 *   GRANDPA_AI_API_URL     base URL, e.g. https://api.example.com/v1  (or the full …/chat/completions URL)
 *   GRANDPA_AI_MODEL       model name to request (optional)
 *   GRANDPA_AI_AUTH_HEADER header for the key: "Authorization" (default, sends "Bearer <key>") or e.g. "x-api-key"
 *
 * The request uses the widely supported OpenAI-compatible "chat completions" format.
 * If Grandpa AI's format differs, adjust buildRequest() and readReply() below.
 */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AssistantUnavailableError extends Error {}

export function assistantConfigured(): boolean {
  return Boolean(process.env.GRANDPA_AI_API_KEY && process.env.GRANDPA_AI_API_URL);
}

function endpoint(): string {
  const base = (process.env.GRANDPA_AI_API_URL ?? "").replace(/\/+$/, "");
  return /\/chat\/completions$/.test(base) ? base : `${base}/chat/completions`;
}

function buildRequest(messages: ChatMessage[]): RequestInit {
  const key = process.env.GRANDPA_AI_API_KEY ?? "";
  const header = process.env.GRANDPA_AI_AUTH_HEADER || "Authorization";
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream, application/json",
      [header]: header.toLowerCase() === "authorization" ? `Bearer ${key}` : key,
    },
    body: JSON.stringify({
      ...(process.env.GRANDPA_AI_MODEL ? { model: process.env.GRANDPA_AI_MODEL } : {}),
      messages,
      stream: true,
      temperature: 0.4,
      max_tokens: 700,
    }),
  };
}

/** Pulls the reply text out of a non-streaming JSON response, tolerating common shapes. */
function readReply(json: unknown): string {
  const j = json as Record<string, unknown> & {
    choices?: Array<{ message?: { content?: string }; text?: string }>;
    message?: { content?: string } | string;
    output_text?: string;
  };
  const candidates = [
    j.choices?.[0]?.message?.content,
    j.choices?.[0]?.text,
    typeof j.message === "string" ? j.message : j.message?.content,
    j.output_text,
    j.reply,
    j.response,
    j.answer,
    j.text,
    j.content,
  ];
  const found = candidates.find((c): c is string => typeof c === "string" && c.trim().length > 0);
  if (!found) throw new AssistantUnavailableError("Unrecognised reply format from the AI provider");
  return found;
}

/** Text of one server-sent-events "data:" payload (OpenAI-style deltas or plain text). */
function readDelta(data: string): string {
  try {
    const j = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string }; text?: string }> } & Record<string, unknown>;
    const d = j.choices?.[0]?.delta?.content ?? j.choices?.[0]?.text ?? j.content ?? j.text ?? j.response;
    return typeof d === "string" ? d : "";
  } catch {
    return data; // plain-text chunk
  }
}

/**
 * Sends the conversation and returns the reply as a stream of plain UTF-8 text,
 * whether the provider streams (SSE) or answers in one JSON response.
 */
export async function streamReply(messages: ChatMessage[], signal?: AbortSignal): Promise<ReadableStream<Uint8Array>> {
  if (!assistantConfigured()) throw new AssistantUnavailableError("Grandpa AI is not configured");

  let res: Response;
  try {
    const timeout = AbortSignal.timeout(45_000);
    res = await fetch(endpoint(), { ...buildRequest(messages), signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  } catch (e) {
    throw new AssistantUnavailableError(`Could not reach the AI provider: ${(e as Error).message}`);
  }
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new AssistantUnavailableError(`AI provider responded ${res.status}: ${detail.slice(0, 200)}`);
  }

  const encoder = new TextEncoder();
  const type = res.headers.get("content-type") ?? "";

  if (!type.includes("text/event-stream")) {
    const text = type.includes("json") ? readReply(await res.json()) : await res.text();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    });
  }

  // Server-sent events: forward only the text of each delta.
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  return new ReadableStream({
    async pull(controller) {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        let out = "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            if (out) controller.enqueue(encoder.encode(out));
            controller.close();
            await reader.cancel();
            return;
          }
          out += readDelta(data);
        }
        if (out) {
          controller.enqueue(encoder.encode(out));
          return;
        }
      }
    },
    cancel() {
      return reader.cancel();
    },
  });
}
