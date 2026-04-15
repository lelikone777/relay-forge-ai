import type { ChatRequest } from "@relayforge/shared";

import type { Env } from "../env";
import { buildMessages, parseOpenAiJsonResponse, requestOpenAiCompatible } from "./base";
import type { ProviderAdapter } from "./base";

const endpoint = "https://api.cerebras.ai/v1/chat/completions";

function getCerebrasApiKey(env: Env) {
  return env.CEREBRAS_API_KEY?.trim() ?? "";
}

export const cerebrasProvider: ProviderAdapter = {
  id: "cerebras",
  label: "Cerebras Inference",
  supportsStreaming: true,
  isConfigured: (env) => Boolean(getCerebrasApiKey(env)),
  getModel: (env) => env.CEREBRAS_MODEL ?? "llama3.1-8b",
  async generate(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const model = env.CEREBRAS_MODEL ?? "llama3.1-8b";
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "cerebras",
      signal,
      headers: {
        Authorization: `Bearer ${getCerebrasApiKey(env)}`
      },
      body: {
        model,
        messages: buildMessages(request),
        temperature: request.options.temperature,
        max_tokens: request.options.maxTokens,
        stream: false
      }
    });
    const text = await parseOpenAiJsonResponse(response, "cerebras");

    return {
      provider: "cerebras",
      model,
      text,
      latencyMs: Date.now() - startedAt,
      demoMode: false
    };
  },
  async stream(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const model = env.CEREBRAS_MODEL ?? "llama3.1-8b";
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "cerebras",
      signal,
      headers: {
        Authorization: `Bearer ${getCerebrasApiKey(env)}`
      },
      body: {
        model,
        messages: buildMessages(request),
        temperature: request.options.temperature,
        max_tokens: request.options.maxTokens,
        stream: true
      }
    });

    return {
      provider: "cerebras",
      model,
      response,
      latencyMs: Date.now() - startedAt,
      demoMode: false,
      format: "openai-sse"
    };
  }
};
