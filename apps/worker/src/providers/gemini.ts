import type { ChatRequest } from "@relayforge/shared";

import type { Env } from "../env";
import { RelayError } from "../core/errors";
import type { ProviderAdapter } from "./base";

const apiBaseUrl = "https://generativelanguage.googleapis.com/v1beta";

function getGeminiApiKey(env: Env) {
  return env.GEMINI_API_KEY?.trim() ?? "";
}

function getGeminiModel(env: Env) {
  return env.GEMINI_MODEL ?? "gemini-2.5-flash";
}

function buildGeminiBody(request: ChatRequest) {
  const sourceMessages =
    request.messages?.length
      ? request.messages
      : [
          {
            role: "user" as const,
            content: request.prompt
          }
        ];

  const systemInstruction = sourceMessages
    .filter((message) => message.role === "system")
    .map((message) => message.content.trim())
    .filter(Boolean)
    .join("\n\n");

  const contents = sourceMessages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    }));

  return {
    ...(systemInstruction
      ? {
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        }
      : {}),
    contents: contents.length
      ? contents
      : [
          {
            role: "user",
            parts: [{ text: request.prompt }]
          }
        ],
    generationConfig: {
      temperature: request.options.temperature,
      maxOutputTokens: request.options.maxTokens
    }
  };
}

async function requestGemini({
  url,
  env,
  body,
  signal
}: {
  url: string;
  env: Env;
  body: Record<string, unknown>;
  signal: AbortSignal;
}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiApiKey(env)
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const details = await response.text();

      if (response.status === 429) {
        throw new RelayError({
          code: "provider_rate_limited",
          message: "gemini is rate limited.",
          provider: "gemini",
          technicalDetails: details,
          status: 429
        });
      }

      if (response.status === 401 || response.status === 403) {
        throw new RelayError({
          code: "provider_unavailable",
          message: "gemini authentication failed or the provider is not available for this credential.",
          provider: "gemini",
          technicalDetails: details,
          status: 503
        });
      }

      if (response.status >= 500) {
        throw new RelayError({
          code: "provider_unavailable",
          message: "gemini is temporarily unavailable.",
          provider: "gemini",
          technicalDetails: details,
          status: 503
        });
      }

      throw new RelayError({
        code: "malformed_upstream_response",
        message: "gemini returned an unexpected upstream response.",
        provider: "gemini",
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
        message: "gemini timed out before returning a complete response.",
        provider: "gemini",
        technicalDetails: cause.message,
        status: 504
      });
    }

    throw new RelayError({
      code: "provider_unavailable",
      message: "gemini could not be reached.",
      provider: "gemini",
      technicalDetails: cause instanceof Error ? cause.message : "Unknown network failure.",
      status: 503
    });
  }
}

async function parseGeminiText(response: Response) {
  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

  if (!text) {
    throw new RelayError({
      code: "malformed_upstream_response",
      message: "gemini returned an empty text payload.",
      provider: "gemini",
      status: 502
    });
  }

  return text;
}

function encodeRelayToken(value: string) {
  return new TextEncoder().encode(
    `event: token\ndata: ${JSON.stringify({
      value
    })}\n\n`
  );
}

export const geminiProvider: ProviderAdapter = {
  id: "gemini",
  label: "Gemini API",
  supportsStreaming: true,
  isConfigured: (env) => Boolean(getGeminiApiKey(env)),
  getModel: getGeminiModel,
  async generate(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const model = getGeminiModel(env);
    const response = await requestGemini({
      url: `${apiBaseUrl}/models/${model}:generateContent`,
      env,
      body: buildGeminiBody(request),
      signal
    });
    const text = await parseGeminiText(response);

    return {
      provider: "gemini",
      model,
      text,
      latencyMs: Date.now() - startedAt,
      demoMode: false
    };
  },
  async stream(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const model = getGeminiModel(env);
    const response = await requestGemini({
      url: `${apiBaseUrl}/models/${model}:streamGenerateContent?alt=sse`,
      env,
      body: buildGeminiBody(request),
      signal
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        if (!response.body) {
          controller.error(
            new RelayError({
              code: "malformed_upstream_response",
              message: "gemini streaming response was empty.",
              provider: "gemini",
              status: 502
            })
          );
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();

            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";

            for (const chunk of chunks) {
              const dataLines = chunk
                .split("\n")
                .filter((line) => line.startsWith("data:"))
                .map((line) => line.replace("data:", "").trim());

              for (const dataLine of dataLines) {
                if (!dataLine) {
                  continue;
                }

                const parsed = JSON.parse(dataLine) as {
                  candidates?: Array<{
                    content?: {
                      parts?: Array<{
                        text?: string;
                      }>;
                    };
                  }>;
                };

                const text = parsed.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");

                if (text) {
                  controller.enqueue(encodeRelayToken(text));
                }
              }
            }
          }

          controller.close();
        } catch (cause) {
          controller.error(cause);
        }
      }
    });

    return {
      provider: "gemini",
      model,
      response: new Response(stream),
      latencyMs: Date.now() - startedAt,
      demoMode: false,
      format: "relay-sse"
    };
  }
};
