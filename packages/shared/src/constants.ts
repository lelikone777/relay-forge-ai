export const PROVIDERS = ["groq", "sambanova", "cerebras", "gemini", "openrouter", "mock"] as const;

export const STRATEGIES = ["auto", "groq", "sambanova", "cerebras", "gemini", "openrouter", "mock"] as const;

export const ERROR_CODES = [
  "validation_error",
  "provider_timeout",
  "provider_rate_limited",
  "provider_unavailable",
  "malformed_upstream_response",
  "stream_interrupted",
  "internal_error",
  "fallback_activated"
] as const;

export const PROVIDER_LABELS: Record<(typeof PROVIDERS)[number], string> = {
  groq: "Groq Free",
  sambanova: "SambaNova Cloud",
  cerebras: "Cerebras Inference",
  gemini: "Gemini API",
  openrouter: "OpenRouter Free",
  mock: "Mock / Demo"
};

export const PROVIDER_PRIORITY = ["groq", "sambanova", "cerebras", "gemini", "openrouter", "mock"] as const;

export const STATUS_VARIANTS = [
  "live",
  "limited",
  "degraded",
  "fallback",
  "demo-ready"
] as const;

export const MODES = ["normal", "degraded", "demo"] as const;
