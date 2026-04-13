import type { ChatRequest, ErrorResponse, ResponseMeta } from "@relayforge/shared";

import { appConfig } from "@/lib/config";

export type StreamEvent =
  | { type: "token"; value: string }
  | { type: "meta"; value: ResponseMeta }
  | { type: "error"; value: ErrorResponse["error"] }
  | { type: "done" };

function parseEvent(raw: string): StreamEvent | null {
  const lines = raw.split("\n");
  const eventLine = lines.find((line) => line.startsWith("event:"));
  const dataLine = lines.filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("");

  if (!eventLine || !dataLine) {
    return null;
  }

  const eventType = eventLine.replace("event:", "").trim();
  const payload = JSON.parse(dataLine);

  if (eventType === "token") {
    return { type: "token", value: payload.value as string };
  }

  if (eventType === "meta") {
    return { type: "meta", value: payload.value as ResponseMeta };
  }

  if (eventType === "error") {
    return { type: "error", value: payload.value as ErrorResponse["error"] };
  }

  if (eventType === "done") {
    return { type: "done" };
  }

  return null;
}

export async function streamRelayResponse(
  body: ChatRequest,
  signal: AbortSignal,
  onEvent: (event: StreamEvent) => void
) {
  const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok || !response.body) {
    throw new Error(`Streaming request failed with ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const event = parseEvent(chunk.trim());

      if (event) {
        onEvent(event);
      }
    }
  }
}

