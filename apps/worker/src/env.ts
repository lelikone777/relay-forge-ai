export interface Env {
  ALLOWED_ORIGIN?: string;
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  OPENROUTER_HTTP_REFERER?: string;
  OPENROUTER_APP_TITLE?: string;
  RELAYFORGE_FORCE_DEMO?: string;
}

export function isDemoForced(env: Env) {
  return env.RELAYFORGE_FORCE_DEMO === "true";
}

