import type { LogsResponse, ProviderStatusResponse, UsageResponse } from "@relayforge/shared";

const now = new Date();

export const demoProviderStatus: ProviderStatusResponse = {
  success: true,
  data: {
    mode: "degraded",
    routingOrder: ["groq", "sambanova", "cerebras", "gemini", "openrouter", "mock"],
    timestamp: now.toISOString(),
    providers: [
      {
        id: "groq",
        label: "Groq Free",
        status: "limited",
        description: "Primary low-latency path. Free-tier burst limits are monitored.",
        latencyMs: 420,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: "llama-3.1-8b-instant"
      },
      {
        id: "sambanova",
        label: "SambaNova Cloud",
        status: "fallback",
        description: "OpenAI-compatible backup path that activates before Cerebras.",
        latencyMs: 610,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: "Meta-Llama-3.3-70B-Instruct"
      },
      {
        id: "cerebras",
        label: "Cerebras Inference",
        status: "live",
        description: "High-speed inference tier between SambaNova and Gemini.",
        latencyMs: 250,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: "llama3.1-8b"
      },
      {
        id: "gemini",
        label: "Gemini API",
        status: "live",
        description: "Managed Google API tier that stays ready before OpenRouter.",
        latencyMs: 930,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: "gemini-2.5-flash"
      },
      {
        id: "openrouter",
        label: "OpenRouter Free",
        status: "live",
        description: "Late free-tier fallback that stays ready before mock mode.",
        latencyMs: 860,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: "meta-llama/llama-3.2-3b-instruct:free"
      },
      {
        id: "mock",
        label: "Mock / Demo",
        status: "demo-ready",
        description: "Guaranteed public demo path with pseudo-streaming and stable UX.",
        latencyMs: 180,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: "relayforge-demo-v1"
      }
    ]
  }
};

export const demoLogs: LogsResponse = {
  success: true,
  data: {
    total: 8,
    items: [
      {
        id: "log_1",
        timestamp: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
        promptPreview: "Summarize provider fallback behavior for free-tier infrastructure.",
        strategy: "auto",
        attemptedProvider: "groq",
        finalProvider: "groq",
        durationMs: 432,
        status: "success",
        fallbackActivated: false,
        degradedMode: false
      },
      {
        id: "log_2",
        timestamp: new Date(now.getTime() - 1000 * 60 * 8).toISOString(),
        promptPreview: "Explain how RelayForge normalizes rate-limit errors.",
        strategy: "auto",
        attemptedProvider: "groq",
        finalProvider: "sambanova",
        durationMs: 1024,
        status: "fallback",
        fallbackActivated: true,
        degradedMode: true
      },
      {
        id: "log_3",
        timestamp: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
        promptPreview: "Generate a launch note for a serverless AI gateway preview.",
        strategy: "cerebras",
        attemptedProvider: "cerebras",
        finalProvider: "cerebras",
        durationMs: 388,
        status: "success",
        fallbackActivated: false,
        degradedMode: false
      },
      {
        id: "log_4",
        timestamp: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
        promptPreview: "Show a degraded-mode explanation for observability UI.",
        strategy: "auto",
        attemptedProvider: "groq",
        finalProvider: "mock",
        durationMs: 241,
        status: "fallback",
        fallbackActivated: true,
        degradedMode: true
      },
      {
        id: "log_5",
        timestamp: new Date(now.getTime() - 1000 * 60 * 28).toISOString(),
        promptPreview: "Return a concise status note for the SambaNova fallback tier.",
        strategy: "sambanova",
        attemptedProvider: "sambanova",
        finalProvider: "sambanova",
        durationMs: 684,
        status: "success",
        fallbackActivated: false,
        degradedMode: false
      },
      {
        id: "log_6",
        timestamp: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
        promptPreview: "Draft a compact Cerebras latency summary.",
        strategy: "cerebras",
        attemptedProvider: "cerebras",
        finalProvider: "cerebras",
        durationMs: 262,
        status: "success",
        fallbackActivated: false,
        degradedMode: false
      },
      {
        id: "log_7",
        timestamp: new Date(now.getTime() - 1000 * 60 * 38).toISOString(),
        promptPreview: "Return a Gemini-ready moderation note for a public AI demo.",
        strategy: "gemini",
        attemptedProvider: "gemini",
        finalProvider: "gemini",
        durationMs: 944,
        status: "success",
        fallbackActivated: false,
        degradedMode: false
      },
      {
        id: "log_8",
        timestamp: new Date(now.getTime() - 1000 * 60 * 41).toISOString(),
        promptPreview: "Simulate a malformed upstream response and normalized recovery.",
        strategy: "auto",
        attemptedProvider: "groq",
        finalProvider: "mock",
        durationMs: 196,
        status: "fallback",
        fallbackActivated: true,
        degradedMode: true
      }
    ]
  }
};

export const demoUsage: UsageResponse = {
  success: true,
  data: {
    mode: "degraded",
    totals: {
      requests: 128,
      successful: 121,
      failed: 7,
      fallbackActivations: 19,
      avgLatencyMs: 544
    },
    providerDistribution: [
      { provider: "groq", value: 72 },
      { provider: "sambanova", value: 18 },
      { provider: "cerebras", value: 22 },
      { provider: "gemini", value: 15 },
      { provider: "openrouter", value: 31 },
      { provider: "mock", value: 25 }
    ],
    timeseries: [
      { label: "09:00", requests: 9, fallbacks: 1, latencyMs: 422 },
      { label: "10:00", requests: 12, fallbacks: 2, latencyMs: 488 },
      { label: "11:00", requests: 18, fallbacks: 3, latencyMs: 504 },
      { label: "12:00", requests: 26, fallbacks: 4, latencyMs: 612 },
      { label: "13:00", requests: 21, fallbacks: 3, latencyMs: 531 },
      { label: "14:00", requests: 17, fallbacks: 2, latencyMs: 498 },
      { label: "15:00", requests: 25, fallbacks: 4, latencyMs: 588 }
    ]
  }
};
