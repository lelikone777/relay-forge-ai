import type { LogsResponse, ProviderStatusResponse, UsageResponse } from "@relayforge/shared";

const now = new Date();

export const demoProviderStatus: ProviderStatusResponse = {
  success: true,
  data: {
    mode: "degraded",
    routingOrder: ["groq", "openrouter", "mock"],
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
        id: "openrouter",
        label: "OpenRouter Free",
        status: "fallback",
        description: "Activated when Groq is constrained or temporarily unavailable.",
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
    total: 6,
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
        finalProvider: "openrouter",
        durationMs: 1024,
        status: "fallback",
        fallbackActivated: true,
        degradedMode: true
      },
      {
        id: "log_3",
        timestamp: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
        promptPreview: "Generate a launch note for a serverless AI gateway preview.",
        strategy: "groq",
        attemptedProvider: "groq",
        finalProvider: "groq",
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
        promptPreview: "Return compact API docs for POST /api/v1/stream.",
        strategy: "openrouter",
        attemptedProvider: "openrouter",
        finalProvider: "openrouter",
        durationMs: 762,
        status: "success",
        fallbackActivated: false,
        degradedMode: false
      },
      {
        id: "log_6",
        timestamp: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
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

