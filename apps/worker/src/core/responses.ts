import type { ErrorResponse } from "@relayforge/shared";

import type { Env } from "../env";
import { RelayError } from "./errors";
import { corsHeaders } from "./cors";

export function json(env: Env, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(env),
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

export function errorResponse(env: Env, error: RelayError) {
  const body: ErrorResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      technicalDetails: error.technicalDetails,
      provider: error.provider,
      fallbackActivated: error.fallbackActivated,
      timestamp: new Date().toISOString()
    }
  };

  return json(env, body, error.status);
}

