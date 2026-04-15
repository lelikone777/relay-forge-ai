import type { ErrorCode, LogEntry, ModeId, ProviderId, StrategyId, UsageResponse } from "@relayforge/shared";

import { PROVIDER_LABELS, PROVIDER_PRIORITY } from "@relayforge/shared";

type ProviderHealth = Record<
  ProviderId,
  {
    successes: number;
    failures: number;
    lastLatencyMs: number;
    lastErrorCode?: ErrorCode;
  }
>;

type MetricsState = {
  logs: LogEntry[];
  providerHealth: ProviderHealth;
};

const seedLogs = (): LogEntry[] => {
  return [
    {
      id: "seed_1",
      timestamp: "2026-04-13T08:40:00.000Z",
      promptPreview: "Summarize provider fallback behavior for free-tier infrastructure.",
      strategy: "auto",
      attemptedProvider: "groq",
      finalProvider: "groq",
      durationMs: 430,
      status: "success",
      fallbackActivated: false,
      degradedMode: false
    },
    {
      id: "seed_2",
      timestamp: "2026-04-13T08:35:00.000Z",
      promptPreview: "Explain how RelayForge normalizes rate-limit errors.",
      strategy: "auto",
      attemptedProvider: "groq",
      finalProvider: "sambanova",
      durationMs: 1040,
      status: "fallback",
      fallbackActivated: true,
      degradedMode: true
    },
    {
      id: "seed_3",
      timestamp: "2026-04-13T08:27:00.000Z",
      promptPreview: "Generate a launch note for a serverless AI gateway preview.",
      strategy: "cerebras",
      attemptedProvider: "cerebras",
      finalProvider: "cerebras",
      durationMs: 389,
      status: "success",
      fallbackActivated: false,
      degradedMode: false
    },
    {
      id: "seed_4",
      timestamp: "2026-04-13T08:18:00.000Z",
      promptPreview: "Show a degraded-mode explanation for observability UI.",
      strategy: "auto",
      attemptedProvider: "groq",
      finalProvider: "mock",
      durationMs: 224,
      status: "fallback",
      fallbackActivated: true,
      degradedMode: true
    }
  ];
};

const initialHealth = PROVIDER_PRIORITY.reduce((acc, provider) => {
  acc[provider] = { successes: 0, failures: 0, lastLatencyMs: 0 };
  return acc;
}, {} as ProviderHealth);

const state: MetricsState = {
  logs: seedLogs(),
  providerHealth: initialHealth
};

export function recordSuccess({
  promptPreview,
  strategy,
  attemptedProvider,
  finalProvider,
  durationMs,
  fallbackActivated,
  degradedMode
}: {
  promptPreview: string;
  strategy: StrategyId;
  attemptedProvider: ProviderId;
  finalProvider: ProviderId;
  durationMs: number;
  fallbackActivated: boolean;
  degradedMode: boolean;
}) {
  state.logs.unshift({
    id: `log_${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    promptPreview,
    strategy,
    attemptedProvider,
    finalProvider,
    durationMs,
    status: fallbackActivated ? "fallback" : "success",
    fallbackActivated,
    degradedMode
  });

  state.logs = state.logs.slice(0, 50);
  state.providerHealth[finalProvider].successes += 1;
  state.providerHealth[finalProvider].lastLatencyMs = durationMs;
}

export function recordError({
  promptPreview,
  strategy,
  attemptedProvider,
  finalProvider,
  durationMs,
  degradedMode,
  errorCode
}: {
  promptPreview: string;
  strategy: StrategyId;
  attemptedProvider: ProviderId;
  finalProvider: ProviderId;
  durationMs: number;
  degradedMode: boolean;
  errorCode: ErrorCode;
}) {
  state.logs.unshift({
    id: `log_${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    promptPreview,
    strategy,
    attemptedProvider,
    finalProvider,
    durationMs,
    status: "error",
    fallbackActivated: false,
    degradedMode,
    errorCode
  });

  state.logs = state.logs.slice(0, 50);
  state.providerHealth[attemptedProvider].failures += 1;
  state.providerHealth[attemptedProvider].lastLatencyMs = durationMs;
  state.providerHealth[attemptedProvider].lastErrorCode = errorCode;
}

export function getLogs() {
  return {
    total: state.logs.length,
    items: state.logs
  };
}

export function getMode({
  forceDemo,
  configuredProviders
}: {
  forceDemo: boolean;
  configuredProviders: ProviderId[];
}): ModeId {
  if (forceDemo || configuredProviders.length === 0) {
    return "demo";
  }

  if (state.logs.some((item) => item.fallbackActivated || item.degradedMode)) {
    return "degraded";
  }

  return "normal";
}

export function getUsage(): UsageResponse["data"] {
  const successfulLogs = state.logs.filter((item) => item.status !== "error");
  const providerDistribution = PROVIDER_PRIORITY.map((provider) => ({
    provider,
    value: state.logs.filter((item) => item.finalProvider === provider).length
  }));

  const avgLatencyMs =
    successfulLogs.reduce((sum, item) => sum + item.durationMs, 0) / Math.max(successfulLogs.length, 1);

  return {
    mode: "degraded",
    totals: {
      requests: state.logs.length,
      successful: successfulLogs.length,
      failed: state.logs.filter((item) => item.status === "error").length,
      fallbackActivations: state.logs.filter((item) => item.fallbackActivated).length,
      avgLatencyMs: Number.isFinite(avgLatencyMs) ? Math.round(avgLatencyMs) : 0
    },
    providerDistribution,
    timeseries: state.logs
      .slice(0, 7)
      .reverse()
      .map((item, index) => ({
        label: new Date(item.timestamp).toISOString().slice(11, 16),
        requests: 10 + index * 3,
        fallbacks: item.fallbackActivated ? 1 + (index % 3) : index % 2,
        latencyMs: item.durationMs
      }))
  };
}

export function getProviderHealth() {
  return state.providerHealth;
}

export function getProviderLabel(provider: ProviderId) {
  return PROVIDER_LABELS[provider];
}
