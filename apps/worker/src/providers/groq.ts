import type { ChatRequest } from "@relayforge/shared";

import type { Env } from "../env";
import { buildMessages, parseOpenAiJsonResponse, requestOpenAiCompatible } from "./base";
import type { ProviderAdapter } from "./base";

const endpoint = "https://api.groq.com/openai/v1/chat/completions";

export const groqProvider: ProviderAdapter = {
  id: "groq",
  label: "Groq Free",
  supportsStreaming: true,
  isConfigured: (env) => Boolean(env.GROQ_API_KEY),
  getModel: (env) => env.GROQ_MODEL ?? "llama-3.1-8b-instant",
  async generate(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "groq",
      signal,
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY ?? ""}`
      },
      body: {
        model: env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        messages: buildMessages(request),
        temperature: request.options.stream ? request.options.temperature : 0.35,
        max_tokens: request.options.maxTokens,
        stream: false
      }
    });
    const text = await parseOpenAiJsonResponse(response, "groq");

    return {
      provider: "groq",
      model: env.GROQ_MODEL ?? "llama-3.1-8b-instant",
      text,
      latencyMs: Date.now() - startedAt,
      demoMode: false
    };
  },
  async stream(request: ChatRequest, env: Env, signal) {
    const startedAt = Date.now();
    const response = await requestOpenAiCompatible({
      url: endpoint,
      provider: "groq",
      signal,
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY ?? ""}`
      },
      body: {
        model: env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        messages: buildMessages(request),
        temperature: request.options.temperature,
        max_tokens: request.options.maxTokens,
        stream: true
      }
    });

    return {
      provider: "groq",
      model: env.GROQ_MODEL ?? "llama-3.1-8b-instant",
      response,
      latencyMs: Date.now() - startedAt,
      demoMode: false,
      format: "openai-sse"
    };
  }
};
