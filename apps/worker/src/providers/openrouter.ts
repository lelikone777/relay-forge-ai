import type { ChatRequest } from "@relayforge/shared";

import type { Env } from "../env";
import { buildMessages, parseOpenAiJsonResponse, requestOpenAiCompatible } from "./base";
import type { ProviderAdapter } from "./base";

const endpoint = "https://openrouter.ai/api/v1/chat/completions";

export const openRouterProvider: ProviderAdapter = {
  id: "openrouter",
  label: "OpenRouter Free",
  supportsStreaming: true,
  isConfigured: (env) => Boolean(env.OPENROUTER_API_KEY),
  getModel: (env) => env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free",
  async generate(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "openrouter",
      signal,
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY ?? ""}`,
        "HTTP-Referer": env.OPENROUTER_HTTP_REFERER ?? "https://relayforge-ai.pages.dev",
        "X-Title": env.OPENROUTER_APP_TITLE ?? "RelayForge AI"
      },
      body: {
        model: env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free",
        messages: buildMessages(request),
        temperature: request.options.temperature,
        max_tokens: request.options.maxTokens,
        stream: false
      }
    });
    const text = await parseOpenAiJsonResponse(response, "openrouter");

    return {
      provider: "openrouter",
      model: env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free",
      text,
      latencyMs: Date.now() - startedAt,
      demoMode: false
    };
  },
  async stream(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "openrouter",
      signal,
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY ?? ""}`,
        "HTTP-Referer": env.OPENROUTER_HTTP_REFERER ?? "https://relayforge-ai.pages.dev",
        "X-Title": env.OPENROUTER_APP_TITLE ?? "RelayForge AI"
      },
      body: {
        model: env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free",
        messages: buildMessages(request),
        temperature: request.options.temperature,
        max_tokens: request.options.maxTokens,
        stream: true
      }
    });

    return {
      provider: "openrouter",
      model: env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free",
      response,
      latencyMs: Date.now() - startedAt,
      demoMode: false,
      format: "openai-sse"
    };
  }
};
