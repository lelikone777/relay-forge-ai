import type { ChatRequest } from "@relayforge/shared";

import type { Env } from "../env";
import { buildMessages, parseOpenAiJsonResponse, requestOpenAiCompatible } from "./base";
import type { ProviderAdapter } from "./base";

const endpoint = "https://api.sambanova.ai/v1/chat/completions";

function getSambaNovaApiKey(env: Env) {
  return env.SAMBANOVA_API_KEY?.trim() ?? "";
}

function getTemperature(value: number) {
  return Math.max(0, Math.min(1, value));
}

export const sambaNovaProvider: ProviderAdapter = {
  id: "sambanova",
  label: "SambaNova Cloud",
  supportsStreaming: true,
  isConfigured: (env) => Boolean(getSambaNovaApiKey(env)),
  getModel: (env) => env.SAMBANOVA_MODEL ?? "Meta-Llama-3.3-70B-Instruct",
  async generate(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const model = env.SAMBANOVA_MODEL ?? "Meta-Llama-3.3-70B-Instruct";
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "sambanova",
      signal,
      headers: {
        Authorization: `Bearer ${getSambaNovaApiKey(env)}`
      },
      body: {
        model,
        messages: buildMessages(request),
        temperature: getTemperature(request.options.temperature),
        max_tokens: request.options.maxTokens,
        stream: false
      }
    });
    const text = await parseOpenAiJsonResponse(response, "sambanova");

    return {
      provider: "sambanova",
      model,
      text,
      latencyMs: Date.now() - startedAt,
      demoMode: false
    };
  },
  async stream(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const model = env.SAMBANOVA_MODEL ?? "Meta-Llama-3.3-70B-Instruct";
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "sambanova",
      signal,
      headers: {
        Authorization: `Bearer ${getSambaNovaApiKey(env)}`
      },
      body: {
        model,
        messages: buildMessages(request),
        temperature: getTemperature(request.options.temperature),
        max_tokens: request.options.maxTokens,
        stream: true
      }
    });

    return {
      provider: "sambanova",
      model,
      response,
      latencyMs: Date.now() - startedAt,
      demoMode: false,
      format: "openai-sse"
    };
  }
};
