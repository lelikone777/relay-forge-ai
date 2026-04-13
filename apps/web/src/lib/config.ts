export const appConfig = {
  name: "RelayForge AI",
  description: "Unified AI gateway playground with free-tier-first provider routing.",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8787",
  workspace: "Public Sandbox",
  environment: "Cloudflare Pages + Workers"
} as const;

