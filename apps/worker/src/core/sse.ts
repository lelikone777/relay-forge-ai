import type { Env } from "../env";
import { corsHeaders } from "./cors";

const encoder = new TextEncoder();

export function encodeSse(event: string, value: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify({ value })}\n\n`);
}

export function sseResponse(env: Env, stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    status: 200,
    headers: {
      ...corsHeaders(env),
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

