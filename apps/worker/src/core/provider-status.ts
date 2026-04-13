import type { ProviderId, ProviderStatusResponse } from "@relayforge/shared";

import { PROVIDER_PRIORITY } from "@relayforge/shared";

import { getLogs, getMode, getProviderHealth } from "./metrics-store";
import { isDemoForced, type Env } from "../env";
import { providers } from "../providers";

const fallbackLatency: Record<ProviderId, number> = {
  groq: 420,
  openrouter: 860,
  mock: 180
};

export function getProviderStatusSnapshot(env: Env): ProviderStatusResponse["data"] {
  const forceDemo = isDemoForced(env);
  const groqConfigured = providers.groq.isConfigured(env);
  const openRouterConfigured = providers.openrouter.isConfigured(env);
  const logs = getLogs().items.slice(0, 10);
  const health = getProviderHealth();
  const recentFallback = logs.some((item) => item.fallbackActivated);
  const mode = getMode({
    forceDemo,
    groqConfigured,
    openRouterConfigured
  });

  return {
    mode,
    routingOrder: [...PROVIDER_PRIORITY],
    timestamp: new Date().toISOString(),
    providers: [
      {
        id: "groq",
        label: providers.groq.label,
        status: forceDemo ? "limited" : groqConfigured ? (recentFallback ? "limited" : "live") : "limited",
        description: forceDemo
          ? "Disabled by force-demo mode."
          : groqConfigured
            ? "Primary low-latency path for Auto strategy."
            : "Missing API key. Auto strategy will promote to the next provider.",
        latencyMs: health.groq.lastLatencyMs || fallbackLatency.groq,
        freeTierReady: true,
        supportsStreaming: true,
        available: groqConfigured && !forceDemo,
        model: providers.groq.getModel(env)
      },
      {
        id: "openrouter",
        label: providers.openrouter.label,
        status: forceDemo
          ? "limited"
          : openRouterConfigured
            ? recentFallback || !groqConfigured
              ? "fallback"
              : "live"
            : "limited",
        description: forceDemo
          ? "Held behind demo-safe routing."
          : openRouterConfigured
            ? "Secondary free-tier path when Groq cannot serve the request."
            : "Missing API key. Auto strategy will skip directly to the mock provider.",
        latencyMs: health.openrouter.lastLatencyMs || fallbackLatency.openrouter,
        freeTierReady: true,
        supportsStreaming: true,
        available: openRouterConfigured && !forceDemo,
        model: providers.openrouter.getModel(env)
      },
      {
        id: "mock",
        label: providers.mock.label,
        status: mode === "demo" ? "demo-ready" : recentFallback ? "fallback" : "demo-ready",
        description: "Guaranteed demo-safe provider with pseudo-streaming and stable latency metadata.",
        latencyMs: health.mock.lastLatencyMs || fallbackLatency.mock,
        freeTierReady: true,
        supportsStreaming: true,
        available: true,
        model: providers.mock.getModel(env)
      }
    ]
  };
}

