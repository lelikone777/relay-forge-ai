import type { ChatRequest, ProviderId, ResponseMeta, StrategyId, SuccessResponse } from "@relayforge/shared";

import { RelayError, toRelayError } from "./errors";
import { recordError, recordSuccess } from "./metrics-store";
import { encodeSse, sseResponse } from "./sse";
import { isDemoForced, type Env } from "../env";
import { providers } from "../providers";
import type { ProviderStreamResult, ProviderTextResult } from "../providers/base";

const recoverableCodes = new Set<string>([
  "provider_timeout",
  "provider_rate_limited",
  "provider_unavailable",
  "malformed_upstream_response"
] as const);

function resolveProviderSequence(strategy: StrategyId, env: Env): ProviderId[] {
  if (isDemoForced(env)) {
    return ["mock"];
  }

  if (strategy === "auto") {
    return ["groq", "openrouter", "mock"];
  }

  return [strategy];
}

function previewPrompt(prompt: string) {
  return prompt.length > 96 ? `${prompt.slice(0, 95)}...` : prompt;
}

function shouldFallback(strategy: StrategyId, error: RelayError, index: number, sequence: ProviderId[]) {
  return strategy === "auto" && recoverableCodes.has(error.code) && index < sequence.length - 1;
}

function buildMeta({
  strategy,
  attemptedProvider,
  finalProvider,
  fallbackActivated,
  latencyMs,
  model,
  demoMode,
  env
}: {
  strategy: StrategyId;
  attemptedProvider: ProviderId;
  finalProvider: ProviderId;
  fallbackActivated: boolean;
  latencyMs: number;
  model: string;
  demoMode: boolean;
  env: Env;
}): ResponseMeta {
  const degradedMode =
    demoMode || fallbackActivated || !providers.groq.isConfigured(env) || !providers.openrouter.isConfigured(env);

  return {
    strategy,
    attemptedProvider,
    finalProvider,
    fallbackActivated,
    degradedMode,
    demoMode,
    latencyMs,
    model,
    timestamp: new Date().toISOString()
  };
}

async function attemptGenerate(
  request: ChatRequest,
  env: Env,
  signal: AbortSignal
): Promise<SuccessResponse["data"]> {
  const strategy = request.options.strategy;
  const sequence = resolveProviderSequence(strategy, env);
  const attemptedProvider = sequence[0];
  let lastError: RelayError | null = null;

  for (const [index, providerId] of sequence.entries()) {
    const provider = providers[providerId];

    if (!provider.isConfigured(env) && providerId !== "mock") {
      const missingProviderError = new RelayError({
        code: "provider_unavailable",
        message: `${provider.label} is not configured.`,
        provider: providerId,
        technicalDetails: `Missing API key for ${providerId}.`,
        status: 503
      });

      if (shouldFallback(strategy, missingProviderError, index, sequence)) {
        lastError = missingProviderError;
        continue;
      }

      throw missingProviderError;
    }

    try {
      const result = await provider.generate(request, env, signal);
      const meta = buildMeta({
        strategy,
        attemptedProvider,
        finalProvider: result.provider,
        fallbackActivated: attemptedProvider !== result.provider,
        latencyMs: result.latencyMs,
        model: result.model,
        demoMode: result.demoMode,
        env
      });

      recordSuccess({
        promptPreview: previewPrompt(request.prompt),
        strategy,
        attemptedProvider,
        finalProvider: result.provider,
        durationMs: result.latencyMs,
        fallbackActivated: meta.fallbackActivated,
        degradedMode: meta.degradedMode
      });

      return {
        text: result.text,
        meta
      };
    } catch (cause) {
      const error = toRelayError(cause, providerId);
      lastError = error;

      if (shouldFallback(strategy, error, index, sequence)) {
        continue;
      }

      recordError({
        promptPreview: previewPrompt(request.prompt),
        strategy,
        attemptedProvider,
        finalProvider: providerId,
        durationMs: 0,
        degradedMode: true,
        errorCode: error.code
      });

      throw error;
    }
  }

  throw (
    lastError ??
    new RelayError({
      code: "internal_error",
      message: "No provider could serve the request.",
      status: 500
    })
  );
}

function parseOpenAiSseChunk(chunk: string) {
  const lines = chunk.split("\n").filter((line) => line.startsWith("data:"));
  const tokens: string[] = [];

  for (const line of lines) {
    const payload = line.replace("data:", "").trim();

    if (!payload || payload === "[DONE]") {
      continue;
    }

    const parsed = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string } }>;
    };
    const token = parsed.choices?.[0]?.delta?.content;

    if (token) {
      tokens.push(token);
    }
  }

  return tokens;
}

function parseRelaySseChunk(chunk: string) {
  const eventLine = chunk.split("\n").find((line) => line.startsWith("event:"));
  const dataLine = chunk
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.replace("data:", "").trim())
    .join("");

  if (!eventLine || !dataLine) {
    return [];
  }

  const event = eventLine.replace("event:", "").trim();

  if (event !== "token") {
    return [];
  }

  const parsed = JSON.parse(dataLine) as { value?: string };
  return parsed.value ? [parsed.value] : [];
}

async function createRelayStreamResponse({
  env,
  request,
  result,
  attemptedProvider
}: {
  env: Env;
  request: ChatRequest;
  result: ProviderStreamResult;
  attemptedProvider: ProviderId;
}) {
  const strategy = request.options.strategy;
  const startedAt = Date.now() - result.latencyMs;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const initialMeta = buildMeta({
        strategy,
        attemptedProvider,
        finalProvider: result.provider,
        fallbackActivated: attemptedProvider !== result.provider,
        latencyMs: result.latencyMs,
        model: result.model,
        demoMode: result.demoMode,
        env
      });

      controller.enqueue(encodeSse("meta", initialMeta));

      try {
        if (!result.response.body) {
          throw new RelayError({
            code: "malformed_upstream_response",
            message: "Streaming provider returned an empty body.",
            provider: result.provider,
            status: 502
          });
        }

        const reader = result.response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let text = "";

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const tokens =
              result.format === "openai-sse" ? parseOpenAiSseChunk(chunk.trim()) : parseRelaySseChunk(chunk.trim());

            for (const token of tokens) {
              text += token;
              controller.enqueue(encodeSse("token", token));
            }
          }
        }

        if (!text.trim()) {
          throw new RelayError({
            code: "stream_interrupted",
            message: "Stream ended before any tokens were emitted.",
            provider: result.provider,
            status: 502
          });
        }

        const finalMeta = buildMeta({
          strategy,
          attemptedProvider,
          finalProvider: result.provider,
          fallbackActivated: attemptedProvider !== result.provider,
          latencyMs: Date.now() - startedAt,
          model: result.model,
          demoMode: result.demoMode,
          env
        });

        recordSuccess({
          promptPreview: previewPrompt(request.prompt),
          strategy,
          attemptedProvider,
          finalProvider: result.provider,
          durationMs: finalMeta.latencyMs,
          fallbackActivated: finalMeta.fallbackActivated,
          degradedMode: finalMeta.degradedMode
        });

        controller.enqueue(encodeSse("meta", finalMeta));
        controller.enqueue(encodeSse("done", { completed: true }));
        controller.close();
      } catch (cause) {
        const error = toRelayError(cause, result.provider);

        recordError({
          promptPreview: previewPrompt(request.prompt),
          strategy,
          attemptedProvider,
          finalProvider: result.provider,
          durationMs: Date.now() - startedAt,
          degradedMode: true,
          errorCode: error.code
        });

        controller.enqueue(
          encodeSse("error", {
            code: error.code,
            message: error.message,
            technicalDetails: error.technicalDetails,
            provider: error.provider,
            fallbackActivated: attemptedProvider !== result.provider,
            timestamp: new Date().toISOString()
          })
        );
        controller.close();
      }
    }
  });

  return sseResponse(env, stream);
}

async function attemptStream(request: ChatRequest, env: Env, signal: AbortSignal) {
  const strategy = request.options.strategy;
  const sequence = resolveProviderSequence(strategy, env);
  const attemptedProvider = sequence[0];
  let lastError: RelayError | null = null;

  for (const [index, providerId] of sequence.entries()) {
    const provider = providers[providerId];

    if (!provider.isConfigured(env) && providerId !== "mock") {
      const missingProviderError = new RelayError({
        code: "provider_unavailable",
        message: `${provider.label} is not configured.`,
        provider: providerId,
        technicalDetails: `Missing API key for ${providerId}.`,
        status: 503
      });

      if (shouldFallback(strategy, missingProviderError, index, sequence)) {
        lastError = missingProviderError;
        continue;
      }

      throw missingProviderError;
    }

    try {
      const result = await provider.stream(request, env, signal);
      return createRelayStreamResponse({
        env,
        request,
        result,
        attemptedProvider
      });
    } catch (cause) {
      const error = toRelayError(cause, providerId);
      lastError = error;

      if (shouldFallback(strategy, error, index, sequence)) {
        continue;
      }

      recordError({
        promptPreview: previewPrompt(request.prompt),
        strategy,
        attemptedProvider,
        finalProvider: providerId,
        durationMs: 0,
        degradedMode: true,
        errorCode: error.code
      });

      throw error;
    }
  }

  throw (
    lastError ??
    new RelayError({
      code: "internal_error",
      message: "No provider could start a stream.",
      status: 500
    })
  );
}

export async function executeChat(request: ChatRequest, env: Env, signal: AbortSignal) {
  const data = await attemptGenerate(request, env, signal);

  return {
    success: true as const,
    data
  };
}

export async function executeStream(request: ChatRequest, env: Env, signal: AbortSignal) {
  return attemptStream(request, env, signal);
}
