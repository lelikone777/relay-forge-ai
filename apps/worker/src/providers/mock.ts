import type { ChatRequest } from "@relayforge/shared";

import { buildMessages } from "./base";
import type { ProviderAdapter } from "./base";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildDemoText(request: ChatRequest) {
  const prompt = request.prompt.trim();
  const excerpt = prompt.length > 180 ? `${prompt.slice(0, 180)}...` : prompt;

  return [
    "RelayForge demo mode kept the request available even though real upstream providers could not safely serve it.",
    "",
    "Key points:",
    "- The gateway preserved the same normalized response contract.",
    "- Fallback metadata remains visible so the user knows demo mode was activated.",
    "- Pseudo-streaming is used to keep the public demo interactive.",
    "",
    `Prompt excerpt: ${excerpt}`,
    "",
    "This mock provider is intentionally subtle in the UI but critical for portfolio-grade reliability."
  ].join("\n");
}

export const mockProvider: ProviderAdapter = {
  id: "mock",
  label: "Mock / Demo",
  supportsStreaming: true,
  isConfigured: () => true,
  getModel: () => "relayforge-demo-v1",
  async generate(request: ChatRequest) {
    const startedAt = Date.now();
    const text = buildDemoText(request);
    await sleep(180);

    return {
      provider: "mock",
      model: "relayforge-demo-v1",
      text,
      latencyMs: Date.now() - startedAt,
      demoMode: true
    };
  },
  async stream(request: ChatRequest) {
    const startedAt = Date.now();
    const text = buildDemoText(request);
    const words = text.split(/(\s+)/);

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();

        for (const word of words) {
          controller.enqueue(
            encoder.encode(
              `event: token\ndata: ${JSON.stringify({
                value: word
              })}\n\n`
            )
          );
          await sleep(26);
        }

        controller.close();
      }
    });

    return {
      provider: "mock",
      model: "relayforge-demo-v1",
      response: new Response(stream),
      latencyMs: Date.now() - startedAt + 180,
      demoMode: true,
      format: "relay-sse"
    };
  }
};
