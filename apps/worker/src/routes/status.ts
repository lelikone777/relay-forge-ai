import { getProviderStatusSnapshot } from "../core/provider-status";
import { json } from "../core/responses";
import type { Env } from "../env";

export function handleStatus(_request: Request, env: Env) {
  return json(env, {
    success: true,
    data: getProviderStatusSnapshot(env)
  });
}

