const productionApiBaseUrl = "https://relayforge-ai-api.2257855.workers.dev";
const localApiBaseUrl = "http://127.0.0.1:8787";

function normalizeApiBaseUrl(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function getApiBaseUrl() {
  const envValue = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (envValue) {
    return envValue;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return localApiBaseUrl;
    }

    return productionApiBaseUrl;
  }

  return productionApiBaseUrl;
}

export const appConfig = {
  name: "RelayForge AI",
  description: "Unified AI gateway playground with free-tier-first provider routing.",
  workspace: "Public Sandbox",
  environment: "Cloudflare Pages + Workers"
} as const;
