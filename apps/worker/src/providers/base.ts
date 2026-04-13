import type { ChatRequest, ProviderId } from "@relayforge/shared";

import type { Env } from "../env";
import { RelayError } from "../core/errors";

export type ProviderTextResult = {
  provider: ProviderId;
  model: string;
  text: string;
  latencyMs: number;
  demoMode: boolean;
};

export type ProviderStreamResult = {
  provider: ProviderId;
  model: string;
  response: Response;
  latencyMs: number;
  demoMode: boolean;
  format: "openai-sse" | "relay-sse";
};

export interface ProviderAdapter {
  id: ProviderId;
  label: string;
  supportsStreaming: boolean;
  isConfigured: (env: Env) => boolean;
  getModel: (env: Env) => string;
  generate: (request: ChatRequest, env: Env, signal: AbortSignal) => Promise<ProviderTextResult>;
  stream: (request: ChatRequest, env: Env, signal: AbortSignal) => Promise<ProviderStreamResult>;
}

type RequestOptions = {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  provider: ProviderId;
  signal: AbortSignal;
  timeoutMs?: number;
};

function buildAbortSignal(signal: AbortSignal, timeoutMs = 18_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);

  signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });

  return {
    signal: controller.signal,
    dispose: () => clearTimeout(timer)
  };
}

export function buildMessages(request: ChatRequest) {
  if (request.messages?.length) {
    return request.messages;
  }

  return [
    {
      role: "user" as const,
      content: request.prompt
    }
  ];
}

export async function requestOpenAiCompatible({
  url,
  headers,
  body,
  provider,
  signal,
  timeoutMs
}: RequestOptions) {
  const { signal: scopedSignal, dispose } = buildAbortSignal(signal, timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify(body),
      signal: scopedSignal
    });

    if (!response.ok) {
      const details = await response.text();

      if (response.status === 429) {
        throw new RelayError({
          code: "provider_rate_limited",
          message: `${provider} is rate limited.`,
          provider,
          technicalDetails: details,
          status: 429
        });
      }

      if (response.status >= 500) {
        throw new RelayError({
          code: "provider_unavailable",
          message: `${provider} is temporarily unavailable.`,
          provider,
          technicalDetails: details,
          status: 503
        });
      }

      throw new RelayError({
        code: "malformed_upstream_response",
        message: `${provider} returned an unexpected upstream response.`,
        provider,
        technicalDetails: details,
        status: 502
      });
    }

    return response;
  } catch (cause) {
    if (cause instanceof RelayError) {
      throw cause;
    }

    if (cause instanceof Error && cause.name === "AbortError") {
      throw new RelayError({
        code: "provider_timeout",
        message: `${provider} timed out before returning a complete response.`,
        provider,
        technicalDetails: cause.message,
        status: 504
      });
    }

    throw new RelayError({
      code: "provider_unavailable",
      message: `${provider} could not be reached.`,
      provider,
      technicalDetails: cause instanceof Error ? cause.message : "Unknown network failure.",
      status: 503
    });
  } finally {
    dispose();
  }
}

export async function parseOpenAiJsonResponse(response: Response, provider: ProviderId) {
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content;

  if (!text) {
    throw new RelayError({
      code: "malformed_upstream_response",
      message: `${provider} returned an empty text payload.`,
      provider,
      status: 502
    });
  }

  return text;
}
