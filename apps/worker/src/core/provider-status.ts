import type { ProviderId, ProviderStatusResponse } from "@relayforge/shared";

import { PROVIDER_PRIORITY } from "@relayforge/shared";

import { getLogs, getMode, getProviderHealth } from "./metrics-store";
import { isDemoForced, type Env } from "../env";
import { providers } from "../providers";

type RealProviderId = Exclude<ProviderId, "mock">;
type StatusVariant = ProviderStatusResponse["data"]["providers"][number]["status"];

const realProviderOrder = PROVIDER_PRIORITY.filter((providerId) => providerId !== "mock") as RealProviderId[];

const fallbackLatency: Record<ProviderId, number> = {
  groq: 420,
  sambanova: 610,
  cerebras: 250,
  gemini: 930,
  openrouter: 860,
  mock: 180
};

const descriptions: Record<
  RealProviderId,
  {
    active: string;
    missing: string;
    forced: string;
  }
> = {
  groq: {
    active: "Primary low-latency path for Auto strategy.",
    missing: "Missing API key. Auto strategy will promote to the next provider.",
    forced: "Disabled by force-demo mode."
  },
  sambanova: {
    active: "Secondary OpenAI-compatible path before Cerebras in auto mode.",
    missing: "Missing API key. Auto strategy will promote to Cerebras next.",
    forced: "Held behind demo-safe routing."
  },
  cerebras: {
    active: "High-speed inference tier after SambaNova in auto mode.",
    missing: "Missing API key. Auto strategy will promote to Gemini next.",
    forced: "Held behind demo-safe routing."
  },
  gemini: {
    active: "Managed Google API tier before OpenRouter in auto mode.",
    missing: "Missing API key. Auto strategy will promote to OpenRouter next.",
    forced: "Held behind demo-safe routing."
  },
  openrouter: {
    active: "Final free-tier path before the mock provider.",
    missing: "Missing API key. Auto strategy will skip directly to the mock provider.",
    forced: "Held behind demo-safe routing."
  }
};

export function getProviderStatusSnapshot(env: Env): ProviderStatusResponse["data"] {
  const forceDemo = isDemoForced(env);
  const health = getProviderHealth();
  const logs = getLogs().items.slice(0, 10);
  const recentFallback = logs.some((item) => item.fallbackActivated);
  const configuredProviders = realProviderOrder.filter((providerId) => providers[providerId].isConfigured(env));
  const configuredSet = new Set(configuredProviders);
  const mode = getMode({
    forceDemo,
    configuredProviders
  });

  return {
    mode,
    routingOrder: [...PROVIDER_PRIORITY],
    timestamp: new Date().toISOString(),
    providers: [
      ...realProviderOrder.map((providerId, index) => {
        const isConfigured = configuredSet.has(providerId);
        const earlierUnavailable = realProviderOrder.slice(0, index).some((id) => !configuredSet.has(id));
        const status: StatusVariant = forceDemo ? "limited" : isConfigured ? (recentFallback || earlierUnavailable ? "fallback" : "live") : "limited";

        return {
          id: providerId,
          label: providers[providerId].label,
          status,
          description: forceDemo ? descriptions[providerId].forced : isConfigured ? descriptions[providerId].active : descriptions[providerId].missing,
          latencyMs: health[providerId].lastLatencyMs || fallbackLatency[providerId],
          freeTierReady: true,
          supportsStreaming: providers[providerId].supportsStreaming,
          available: isConfigured && !forceDemo,
          model: providers[providerId].getModel(env)
        };
      }),
      {
        id: "mock",
        label: providers.mock.label,
        status: (mode === "demo" ? "demo-ready" : recentFallback ? "fallback" : "demo-ready") as StatusVariant,
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
